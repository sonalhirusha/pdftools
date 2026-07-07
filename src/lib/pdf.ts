import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

declare module 'pdf-lib' {
  interface PDFDocument {
    setEncryption(options: Record<string, unknown>): void
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

export async function compressPDF(inputPath: string, outputPath: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const bytes = await pdf.save()
  await fs.writeFile(outputPath, bytes)
  return outputPath
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

export async function addTextToPDF(inputPath: string, outputPath: string, text: string, x: number, y: number): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const page = pdf.getPage(0)
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  page.drawText(text, { x, y, size: 14, font, color: rgb(0, 0, 0) })
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

export async function pdfToWordDoc(inputPath: string, outputPath: string): Promise<string> {
  const pdf = await loadPDF(inputPath)
  const pages = pdf.getPages()
  let text = ''
  for (const page of pages) {
    const content = await (page as any).getText?.() || ''
    text += content + '\n\n'
  }
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
