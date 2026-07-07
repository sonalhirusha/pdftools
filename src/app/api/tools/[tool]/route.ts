import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { getToolById } from '@/lib/tools'
import { storeFile, ensureUploadDir } from '@/lib/file-storage'
import {
  mergePDFs, splitPDF, compressPDF, addWatermark,
  passwordProtect, removePassword, addPageNumbers, imagesToPDF,
  pdfToWordDoc, wordDocToPdf, excelToPdf,
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
      case 'split':
        const splitDir = path.join(OUTPUT_DIR, uuidv4())
        await fs.mkdir(splitDir, { recursive: true })
        const splitPaths = await splitPDF(inputPaths[0], splitDir)
        resultPath = splitPaths[0]
        break
      case 'compress': resultPath = await compressPDF(inputPaths[0], outputPath); break
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
      case 'pdf-to-word': resultPath = await pdfToWordDoc(inputPaths[0], outputPath.replace('.pdf', '.docx')); break
      case 'word-to-pdf': resultPath = await wordDocToPdf(inputPaths[0], outputPath); break
      case 'pdf-to-excel': resultPath = await pdfToWordDoc(inputPaths[0], outputPath.replace('.pdf', '.xlsx')); break
      case 'excel-to-pdf': resultPath = await excelToPdf(inputPaths[0], outputPath); break
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
    }
    const contentType = mimeMap[ext] || 'application/octet-stream'
    const resultContent = await fs.readFile(resultPath)
    return new NextResponse(resultContent, {
      headers: { 'Content-Type': contentType, 'Content-Disposition': `attachment; filename="output${ext}"` },
    })
  } catch (error) {
    console.error(`Tool ${toolId} error:`, error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
