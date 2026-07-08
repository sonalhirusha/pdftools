import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import archiver from 'archiver'

export const maxDuration = 120

async function createZip(filePaths: string[], outputZip: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputZip)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', () => resolve(outputZip))
    archive.on('error', reject)
    archive.pipe(output)
    for (const fp of filePaths) {
      archive.file(fp, { name: path.basename(fp) })
    }
    archive.finalize()
  })
}
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getToolById } from '@/lib/tools'
import { storeFile, ensureUploadDir } from '@/lib/file-storage'
import {
  mergePDFs, splitPDF,   compressPDF, type CompressQuality, addWatermark,
  passwordProtect, removePassword, addPageNumbers, imagesToPDF,
  pdfToWordDoc, wordDocToPdf, excelToPdf,
  rotatePDF, deletePagesFromPDF, rearrangePages, extractPages,
  addTextToPDF, flattenPDF, removeMetadata, pdfToImages,
  removeWatermark, redactContent, fillPDFForms, addSignatureToPDF,
  highlightPDF, pdfToExcel, htmlToPdf, textToPdf, drawOnPDF,
  insertImageIntoPDF, pdfToPptx, pptxToPdf, NotSupportedError,
} from '@/lib/pdf'

const UPLOAD_BASE = process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : './uploads')
const OUTPUT_DIR = path.join(UPLOAD_BASE, 'output')

export async function POST(request: NextRequest, { params }: { params: Promise<{ tool: string }> }) {
  const { tool: toolId } = await params
  const tool = getToolById(toolId)
  if (!tool) return NextResponse.json({ error: 'Tool not found' }, { status: 404 })

  try {
    await ensureUploadDir()
    await fs.mkdir(OUTPUT_DIR, { recursive: true })

    const user = await getSession()
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    if (files.length === 0) return NextResponse.json({ error: 'No files provided' }, { status: 400 })

    const inputPaths: string[] = []
    for (const file of files) {
      const stored = await storeFile(file, file.name, file.type)
      inputPaths.push(stored.path)
    }

    const outputFileName = `${uuidv4()}-${toolId}-output.pdf`
    const outputPath = path.join(OUTPUT_DIR, outputFileName)
    let resultPath: string

    switch (toolId) {
      case 'merge': resultPath = await mergePDFs(inputPaths, outputPath); break
      case 'split': {
        const splitDir = path.join(OUTPUT_DIR, uuidv4())
        await fs.mkdir(splitDir, { recursive: true })
        const splitPaths = await splitPDF(inputPaths[0], splitDir)
        if (splitPaths.length === 1) {
          resultPath = splitPaths[0]
        } else {
          const zipPath = path.join(OUTPUT_DIR, `${uuidv4()}-split-pages.zip`)
          resultPath = await createZip(splitPaths, zipPath)
        }
        break
      }
      case 'compress': {
        const quality = (formData.get('quality') as CompressQuality) || 'ebook'
        resultPath = await compressPDF(inputPaths[0], outputPath, quality); break
      }
      case 'rotate': {
        const deg = Number(formData.get('degrees')) || 90
        resultPath = await rotatePDF(inputPaths[0], outputPath, deg); break
      }
      case 'delete-pages': {
        const pagesStr = (formData.get('pages') as string) || ''
        const pagesToDelete = pagesStr.split(',').map(Number).filter(n => !isNaN(n))
        resultPath = await deletePagesFromPDF(inputPaths[0], outputPath, pagesToDelete); break
      }
      case 'rearrange': {
        const orderStr = (formData.get('order') as string) || ''
        const order = orderStr.split(',').map(Number).filter(n => !isNaN(n))
        resultPath = await rearrangePages(inputPaths[0], outputPath, order); break
      }
      case 'extract': {
        const pagesStr = (formData.get('pages') as string) || ''
        const pages = pagesStr.split(',').map(Number).filter(n => !isNaN(n))
        resultPath = await extractPages(inputPaths[0], outputPath, pages); break
      }
      case 'watermark': {
        const text = (formData.get('text') as string) || 'Watermark'
        resultPath = await addWatermark(inputPaths[0], outputPath, text); break
      }
      case 'password-protect': case 'encrypt': {
        const password = (formData.get('password') as string) || 'password'
        resultPath = await passwordProtect(inputPaths[0], outputPath, password); break
      }
      case 'unlock': case 'remove-password': resultPath = await removePassword(inputPaths[0], outputPath, ''); break
      case 'number-pages': resultPath = await addPageNumbers(inputPaths[0], outputPath); break
      case 'jpg-to-pdf': case 'png-to-pdf': resultPath = await imagesToPDF(inputPaths, outputPath); break
      case 'pdf-to-word': {
        const wordPath = path.join(OUTPUT_DIR, `${uuidv4()}-${toolId}-output.docx`)
        resultPath = await pdfToWordDoc(inputPaths[0], wordPath); break
      }
      case 'word-to-pdf': resultPath = await wordDocToPdf(inputPaths[0], outputPath); break
      case 'excel-to-pdf': resultPath = await excelToPdf(inputPaths[0], outputPath); break
      case 'pdf-to-excel': {
        const excelPath = path.join(OUTPUT_DIR, `${uuidv4()}-${toolId}-output.xlsx`)
        resultPath = await pdfToExcel(inputPaths[0], excelPath); break
      }
      case 'pdf-to-jpg': {
        const imgDir = path.join(OUTPUT_DIR, uuidv4())
        await fs.mkdir(imgDir, { recursive: true })
        const imgPaths = await pdfToImages(inputPaths[0], imgDir, 'jpg')
        if (imgPaths.length === 1) {
          resultPath = imgPaths[0]
        } else {
          const zipPath = path.join(OUTPUT_DIR, `${uuidv4()}-images.zip`)
          resultPath = await createZip(imgPaths, zipPath)
        }
        break
      }
      case 'pdf-to-png': {
        const imgDir = path.join(OUTPUT_DIR, uuidv4())
        await fs.mkdir(imgDir, { recursive: true })
        const imgPaths = await pdfToImages(inputPaths[0], imgDir, 'png')
        if (imgPaths.length === 1) {
          resultPath = imgPaths[0]
        } else {
          const zipPath = path.join(OUTPUT_DIR, `${uuidv4()}-images.zip`)
          resultPath = await createZip(imgPaths, zipPath)
        }
        break
      }
      case 'html-to-pdf': resultPath = await htmlToPdf(inputPaths[0], outputPath); break
      case 'text-to-pdf': resultPath = await textToPdf(inputPaths[0], outputPath); break
      case 'pdf-to-powerpoint': {
        const pptxPath = path.join(OUTPUT_DIR, `${uuidv4()}-${toolId}-output.pptx`)
        resultPath = await pdfToPptx(inputPaths[0], pptxPath); break
      }
      case 'powerpoint-to-pdf': resultPath = await pptxToPdf(inputPaths[0], outputPath); break
      case 'add-text': {
        const text = (formData.get('text') as string) || ''
        const x = Number(formData.get('x')) || 50
        const y = Number(formData.get('y')) || 50
        const pageIdx = Number(formData.get('page')) || 0
        resultPath = await addTextToPDF(inputPaths[0], outputPath, text, x, y, pageIdx); break
      }
      case 'highlight': {
        const highlightsJson = (formData.get('highlights') as string) || '[]'
        const highlights = JSON.parse(highlightsJson)
        resultPath = await highlightPDF(inputPaths[0], outputPath, highlights); break
      }
      case 'draw': {
        const elementsJson = (formData.get('elements') as string) || '[]'
        const elements = JSON.parse(elementsJson)
        resultPath = await drawOnPDF(inputPaths[0], outputPath, elements); break
      }
      case 'insert-image': {
        const imgFile = formData.get('image') as File
        if (!imgFile) return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        const imgStored = await storeFile(imgFile, imgFile.name, imgFile.type)
        const pageIdx = Number(formData.get('page')) || 0
        const x = Number(formData.get('x')) || 50
        const y = Number(formData.get('y')) || 50
        resultPath = await insertImageIntoPDF(inputPaths[0], outputPath, imgStored.path, pageIdx, x, y); break
      }
      case 'remove-watermark': resultPath = await removeWatermark(inputPaths[0], outputPath); break
      case 'add-signature': {
        const sigFile = formData.get('signature') as File
        if (!sigFile) return NextResponse.json({ error: 'No signature image provided' }, { status: 400 })
        const sigStored = await storeFile(sigFile, sigFile.name, sigFile.type)
        const pageIdx = Number(formData.get('page')) || 0
        const x = Number(formData.get('x')) || 50
        const y = Number(formData.get('y')) || 50
        const w = Number(formData.get('width')) || 200
        const h = Number(formData.get('height')) || 100
        resultPath = await addSignatureToPDF(inputPaths[0], outputPath, sigStored.path, pageIdx, x, y, w, h); break
      }
      case 'fill-forms': resultPath = await fillPDFForms(inputPaths[0], outputPath); break
      case 'flatten': resultPath = await flattenPDF(inputPaths[0], outputPath); break
      case 'redact': {
        const redactionsJson = (formData.get('redactions') as string) || '[]'
        const redactions = JSON.parse(redactionsJson)
        resultPath = await redactContent(inputPaths[0], outputPath, redactions); break
      }
      case 'metadata-cleaner': resultPath = await removeMetadata(inputPaths[0], outputPath); break
      case 'ai-chat': return NextResponse.json({ error: 'AI Chat is handled by a separate endpoint' }, { status: 400 })
      default: resultPath = await compressPDF(inputPaths[0], outputPath)
    }

    await prisma.toolUsage.create({
      data: {
        userId: user?.id, toolId, toolName: tool.name,
        toolCategory: tool.category.toUpperCase() as 'BASIC' | 'CONVERT' | 'EDIT' | 'SECURITY' | 'AI',
      },
    })

    const ext = path.extname(resultPath).toLowerCase()
    const mimeMap: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.zip': 'application/zip',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    }
    const contentType = mimeMap[ext] || 'application/octet-stream'
    const resultContent = await fs.readFile(resultPath)
    return new NextResponse(resultContent, {
      headers: { 'Content-Type': contentType, 'Content-Disposition': `attachment; filename="output${ext}"` },
    })
  } catch (error) {
    console.error(`Tool ${toolId} error:`, error)
    if (error instanceof NotSupportedError) {
      return NextResponse.json({ error: error.message }, { status: 501 })
    }
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
