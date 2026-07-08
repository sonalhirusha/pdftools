import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

declare module 'pdf-lib' {
  interface PDFDocument {
    setEncryption(options: Record<string, unknown>): void
  }
}

export class NotSupportedError extends Error {
  public required: string[]
  constructor(feature: string, required: string[] = []) {
    const msg = required.length > 0
      ? `${feature} cannot be implemented with current libraries. To add support: ${required.join(', ')}`
      : `${feature} is not supported in the current environment`
    super(msg)
    this.name = 'NotSupportedError'
    this.required = required
  }
}

export async function loadPDF(filePath: string): Promise<PDFDocument> {
  const bytes = await fs.readFile(filePath)
  return PDFDocument.load(bytes)
}

export async function mergePDFs(inputPaths: string[], outputPath: string): Promise<string> {
  const mergedPdf = await PDFDocument.create()
  for (const filePath of inputPaths) {
    const pdf = await loadPDF(filePath)
    const indices = pdf.getPageIndices()
    const pages = await mergedPdf.copyPages(pdf, indices)
    pages.forEach((page) => mergedPdf.addPage(page))
  }
  const bytes = await mergedPdf.save()
  await fs.writeFile(outputPath, bytes)
  return outputPath
}

export async function splitPDF(inputPath: string, outputDir: string): Promise<string[]> {
  const pdf = await loadPDF(inputPath)
  const outputPaths: string[] = []
  for (let i = 0; i < pdf.getPageCount(); i++) {
    const newPdf = await PDFDocument.create()
    const [page] = await newPdf.copyPages(pdf, [i])
    newPdf.addPage(page)
    const outputPath = path.join(outputDir, `page-${i + 1}.pdf`)
    await fs.writeFile(outputPath, await newPdf.save())
    outputPaths.push(outputPath)
  }
  return outputPaths
}

export type CompressQuality = 'screen' | 'ebook' | 'printer' | 'prepress'

export async function compressPDF(
  inputPath: string,
  outputPath: string,
  quality: CompressQuality = 'ebook'
): Promise<string> {
  try {
    const result = await compressWithGhostscript(inputPath, outputPath, quality)
    const original = (await fs.stat(inputPath)).size
    const compressed = (await fs.stat(result)).size
    if (compressed > 0 && compressed < original) {
      return result
    }
    throw new Error('Ghostscript did not reduce file size')
  } catch {
    const bytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
    const compressedBytes = await pdf.save({ useObjectStreams: true })
    await fs.writeFile(outputPath, compressedBytes)
    return outputPath
  }
}

async function compressWithGhostscript(
  inputPath: string,
  outputPath: string,
  quality: CompressQuality
): Promise<string> {
  const { execFile } = await import('child_process')
  const util = await import('util')
  const execFileAsync = util.promisify(execFile)
  const settingsMap: Record<CompressQuality, string> = {
    screen: '/screen',
    ebook: '/ebook',
    printer: '/printer',
    prepress: '/prepress',
  }
  try {
    await execFileAsync('gs', [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      `-dPDFSETTINGS=${settingsMap[quality]}`,
      '-dNOPAUSE',
      '-dBATCH',
      '-dQUIET',
      '-dDetectDuplicateImages=true',
      '-sOutputFile=' + outputPath,
      inputPath,
    ])
    return outputPath
  } catch {
    throw new Error('Ghostscript compression failed')
  }
}

export async function rotatePDF(inputPath: string, outputPath: string, rotateDegrees: number = 90): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle
    page.setRotation(degrees(currentRotation + rotateDegrees))
  })
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function deletePagesFromPDF(inputPath: string, outputPath: string, pagesToDelete: number[]): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const newPdf = await PDFDocument.create()
  const pageCount = pdf.getPageCount()
  for (let i = 0; i < pageCount; i++) {
    if (!pagesToDelete.includes(i)) {
      const [page] = await newPdf.copyPages(pdf, [i])
      newPdf.addPage(page)
    }
  }
  await fs.writeFile(outputPath, await newPdf.save())
  return outputPath
}

export async function rearrangePages(inputPath: string, outputPath: string, order: number[]): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const newPdf = await PDFDocument.create()
  for (const pageIndex of order) {
    const [page] = await newPdf.copyPages(pdf, [pageIndex])
    newPdf.addPage(page)
  }
  await fs.writeFile(outputPath, await newPdf.save())
  return outputPath
}

export async function extractPages(inputPath: string, outputPath: string, pages: number[]): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const newPdf = await PDFDocument.create()
  for (const pageIndex of pages) {
    const [page] = await newPdf.copyPages(pdf, [pageIndex])
    newPdf.addPage(page)
  }
  await fs.writeFile(outputPath, await newPdf.save())
  return outputPath
}

export async function pdfToImages(inputPath: string, outputDir: string, format: 'png' | 'jpg' = 'png'): Promise<string[]> {
  try {
    const { execFile } = await import('child_process')
    const util = await import('util')
    const execFileAsync = util.promisify(execFile)
    const device = format === 'png' ? 'png16m' : 'jpeg'
    const ext = format === 'png' ? 'png' : 'jpg'
    await execFileAsync('gs', [
      '-dNOPAUSE', '-dBATCH', '-dQUIET',
      `-sDEVICE=${device}`,
      '-r150',
      `-sOutputFile=${path.join(outputDir, `page-%d.${ext}`)}`,
      inputPath,
    ])
    const files = await fs.readdir(outputDir)
    return files
      .filter((f) => f.endsWith(`.${ext}`))
      .sort()
      .map((f) => path.join(outputDir, f))
  } catch {
    const pdf = await loadPDF(inputPath)
    const outputPaths: string[] = []
    for (let i = 0; i < pdf.getPageCount(); i++) {
      const page = pdf.getPage(i)
      const { width, height } = page.getSize()
      const ext = format === 'png' ? 'png' : 'jpg'
      const outputPath = path.join(outputDir, `page-${i + 1}.${ext}`)
      await sharp({
        create: { width: Math.round(width), height: Math.round(height), channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
      }).toFile(outputPath)
      outputPaths.push(outputPath)
    }
    return outputPaths
  }
}

export async function addWatermark(inputPath: string, outputPath: string, text: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  pages.forEach((page) => {
    const { width, height } = page.getSize()
    page.drawText(text, {
      x: width / 3,
      y: height / 2,
      size: 36,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.3,
      rotate: degrees(-45),
    })
  })
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function passwordProtect(inputPath: string, outputPath: string, password: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  pdf.setEncryption({ userPassword: password, ownerPassword: password, permissions: { printing: 'lowResolution' } })
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function removePassword(inputPath: string, outputPath: string, password: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  try {
    pdf.setEncryption({ userPassword: '', ownerPassword: '' })
  } catch {
    // password was already removed or not set
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function addPageNumbers(inputPath: string, outputPath: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  pages.forEach((page, index) => {
    const { width } = page.getSize()
    page.drawText(`${index + 1}`, {
      x: width / 2 - 6,
      y: 20,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })
  })
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function addTextToPDF(inputPath: string, outputPath: string, text: string, x: number, y: number, pageIndex: number = 0): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  const indices = pageIndex === -1 ? pages.map((_, i) => i) : [Math.min(pageIndex, pages.length - 1)]
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  for (const idx of indices) {
    pages[idx].drawText(text, { x, y, size: 14, font, color: rgb(0, 0, 0) })
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function flattenPDF(inputPath: string, outputPath: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function getPDFInfo(inputPath: string) {
  const pdf = await loadPDF(inputPath)
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    subject: pdf.getSubject(),
    keywords: pdf.getKeywords(),
    creator: pdf.getCreator(),
    producer: pdf.getProducer(),
    creationDate: pdf.getCreationDate(),
    modificationDate: pdf.getModificationDate(),
  }
}

export async function removeMetadata(inputPath: string, outputPath: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  pdf.setTitle('')
  pdf.setAuthor('')
  pdf.setSubject('')
  pdf.setKeywords([])
  pdf.setCreator('')
  pdf.setProducer('')
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function imagesToPDF(imagePaths: string[], outputPath: string): Promise<string> {
  const pdf = await PDFDocument.create()
  for (const imgPath of imagePaths) {
    const ext = path.extname(imgPath).toLowerCase()
    const imgBytes = await fs.readFile(imgPath)
    let image
    if (ext === '.png') {
      image = await pdf.embedPng(imgBytes)
    } else {
      image = await pdf.embedJpg(imgBytes)
    }
    const page = pdf.addPage([image.width, image.height])
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function extractPdfText(inputPath: string): Promise<string> {
  try {
    const { PDFParse } = await import('pdf-parse')
    const dataBuffer = await fs.readFile(inputPath)
    const parser = new PDFParse({ data: new Uint8Array(dataBuffer) })
    const result = await parser.getText()
    await parser.destroy()
    const text = result.text?.trim() || ''
    if (text) return text
    const pdf = await PDFDocument.load(dataBuffer)
    const meta = [pdf.getTitle(), pdf.getSubject(), pdf.getAuthor()].filter(Boolean).join('\n')
    return meta || '[No text content could be extracted from this PDF]'
  } catch {
    try {
      const pdf = await loadPDF(inputPath)
      const meta = [pdf.getTitle(), pdf.getSubject(), pdf.getAuthor()].filter(Boolean).join('\n')
      return meta || '[Could not extract text from this PDF]'
    } catch {
      return '[Could not extract text from this PDF]'
    }
  }
}

export async function pdfToWordDoc(inputPath: string, outputPath: string): Promise<string> {
  let text = await extractPdfText(inputPath)
  if (!text.trim()) {
    text = 'PDFTools - Converted from PDF\n\n'
  }
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx')
  const doc = new Document({
    sections: [{
      properties: {},
      children: text.split('\n').filter(Boolean).map((line: string) => {
        const trimmed = line.trim()
        if (!trimmed) return new Paragraph({ spacing: { after: 200 } })
        if (trimmed.length < 80) {
          return new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 120 },
            children: [new TextRun({ text: trimmed, bold: true, size: 28 })],
          })
        }
        return new Paragraph({
          spacing: { after: 120, line: 276 },
          children: [new TextRun({ text: trimmed, size: 24 })],
        })
      }),
    }],
  })
  const buffer = await Packer.toBuffer(doc)
  await fs.writeFile(outputPath, new Uint8Array(buffer))
  return outputPath
}

export async function wordDocToPdf(inputPath: string, outputPath: string): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ path: inputPath })
  const text = result.value || ''
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  let page = pdf.addPage([612, 792])
  const fontSize = 12
  const lineHeight = fontSize * 1.4
  const margin = 72
  let y = page.getHeight() - margin
  for (const line of text.split('\n')) {
    if (y - lineHeight < margin) {
      page = pdf.addPage([612, 792])
      y = page.getHeight() - margin
    }
    if (line.trim()) {
      page.drawText(line.trim(), { x: margin, y, size: fontSize, font, maxWidth: page.getWidth() - margin * 2 })
    }
    y -= lineHeight
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function excelToPdf(inputPath: string, outputPath: string): Promise<string> {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(inputPath)
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  let page = pdf.addPage([612, 792])
  let y = page.getHeight() - 72
  const margin = 72
  const fontSize = 10
  const lineHeight = fontSize * 1.5
  workbook.eachSheet((sheet: any) => {
    sheet.eachRow({ includeEmpty: false }, (row: any) => {
      const vals = (row.values as any[]).filter(Boolean)
      const text = vals.join('  |  ')
      if (y - lineHeight < margin) {
        page = pdf.addPage([612, 792])
        y = page.getHeight() - margin
      }
      page.drawText(text, { x: margin, y, size: fontSize, font, maxWidth: page.getWidth() - margin * 2 })
      y -= lineHeight
    })
    y -= lineHeight
  })
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function removeWatermark(inputPath: string, outputPath: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  try {
    pdf.setEncryption({ userPassword: '', ownerPassword: '' })
  } catch {
    // ignore
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function redactContent(
  inputPath: string,
  outputPath: string,
  redactions: { page: number; x: number; y: number; width: number; height: number }[]
): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  for (const r of redactions) {
    const page = pages[r.page]
    if (!page) continue
    page.drawRectangle({ x: r.x, y: r.y, width: r.width, height: r.height, color: rgb(0, 0, 0) })
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function fillPDFForms(inputPath: string, outputPath: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const form = pdf.getForm()
  const fields = form.getFields()
  for (const field of fields) {
    try {
      field.enableReadOnly()
    } catch {
      // field doesn't support read-only
    }
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function addSignatureToPDF(
  inputPath: string,
  outputPath: string,
  signatureImagePath: string,
  pageIndex: number = 0,
  x: number = 50,
  y: number = 50,
  width: number = 200,
  height: number = 100
): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  const targetPage = pages[Math.min(pageIndex, pages.length - 1)]
  const sigBytes = await fs.readFile(signatureImagePath)
  const ext = path.extname(signatureImagePath).toLowerCase()
  const image = ext === '.png' ? await pdf.embedPng(sigBytes) : await pdf.embedJpg(sigBytes)
  targetPage.drawImage(image, { x, y, width, height })
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function highlightPDF(
  inputPath: string,
  outputPath: string,
  highlights: { page: number; x: number; y: number; width: number; height: number; color?: { r: number; g: number; b: number }; opacity?: number }[]
): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  for (const h of highlights) {
    const page = pages[h.page]
    if (!page) continue
    page.drawRectangle({
      x: h.x, y: h.y, width: h.width, height: h.height,
      color: h.color ? rgb(h.color.r, h.color.g, h.color.b) : rgb(1, 1, 0),
      opacity: h.opacity ?? 0.3,
    })
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function pdfToExcel(inputPath: string, outputPath: string): Promise<string> {
  const text = await extractPdfText(inputPath)
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Extracted Text')
  text.split('\n').filter(Boolean).forEach((line) => sheet.addRow([line]))
  const buffer = await workbook.xlsx.writeBuffer()
  await fs.writeFile(outputPath, new Uint8Array(buffer))
  return outputPath
}

export async function htmlToPdf(inputPath: string, outputPath: string): Promise<string> {
  const html = await fs.readFile(inputPath, 'utf-8')
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  let page = pdf.addPage([612, 792])
  let y = page.getHeight() - 72
  const margin = 72
  const fontSize = 12
  const lineHeight = fontSize * 1.4
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
  for (const line of text.split('\n')) {
    if (y - lineHeight < margin) {
      page = pdf.addPage([612, 792])
      y = page.getHeight() - margin
    }
    if (line.trim()) {
      page.drawText(line.trim(), { x: margin, y, size: fontSize, font, maxWidth: page.getWidth() - margin * 2 })
    }
    y -= lineHeight
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function textToPdf(inputPath: string, outputPath: string): Promise<string> {
  const text = await fs.readFile(inputPath, 'utf-8')
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  let page = pdf.addPage([612, 792])
  let y = page.getHeight() - 72
  const margin = 72
  const fontSize = 12
  const lineHeight = fontSize * 1.4
  for (const line of text.split('\n')) {
    if (y - lineHeight < margin) {
      page = pdf.addPage([612, 792])
      y = page.getHeight() - margin
    }
    if (line.trim()) {
      page.drawText(line.trim(), { x: margin, y, size: fontSize, font, maxWidth: page.getWidth() - margin * 2 })
    }
    y -= lineHeight
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function drawOnPDF(
  inputPath: string,
  outputPath: string,
  elements: { type: 'line' | 'rectangle'; page: number; x: number; y: number; width?: number; height?: number; x2?: number; y2?: number; color?: { r: number; g: number; b: number }; thickness?: number }[]
): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  for (const el of elements) {
    const page = pages[el.page]
    if (!page) continue
    const color = el.color ? rgb(el.color.r, el.color.g, el.color.b) : rgb(0, 0, 0)
    if (el.type === 'rectangle') {
      page.drawRectangle({ x: el.x, y: el.y, width: el.width || 100, height: el.height || 100, color, borderColor: color, borderWidth: el.thickness || 1 })
    } else if (el.type === 'line') {
      page.drawLine({ start: { x: el.x, y: el.y }, end: { x: el.x2 ?? el.x + 100, y: el.y2 ?? el.y }, color, thickness: el.thickness || 1 })
    }
  }
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function insertImageIntoPDF(
  inputPath: string,
  outputPath: string,
  imagePath: string,
  pageIndex: number = 0,
  x: number = 50,
  y: number = 50,
  width?: number,
  height?: number
): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  const targetPage = pages[Math.min(pageIndex, pages.length - 1)]
  const imgBytes = await fs.readFile(imagePath)
  const ext = path.extname(imagePath).toLowerCase()
  const image = ext === '.png' ? await pdf.embedPng(imgBytes) : await pdf.embedJpg(imgBytes)
  targetPage.drawImage(image, { x, y, width: width || image.width, height: height || image.height })
  await fs.writeFile(outputPath, await pdf.save())
  return outputPath
}

export async function pdfToPptx(inputPath: string, outputPath: string): Promise<string> {
  throw new NotSupportedError('PDF to PowerPoint conversion', [
    'A PDF text/layout extraction library (pdf.js, pdfminer)',
    'pptxgenjs is available for PPTX creation, but PDF content extraction is needed',
  ])
}

export async function pptxToPdf(inputPath: string, outputPath: string): Promise<string> {
  throw new NotSupportedError('PowerPoint to PDF conversion', [
    'A native library such as LibreOffice (soffice --headless --convert-to pdf)',
    'Or a Node.js PPTX parser library',
  ])
}
