import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import { getSession } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const file = await prisma.file.findUnique({ where: { id } })
    if (!file || file.isDeleted) return NextResponse.json({ error: 'File not found' }, { status: 404 })
    const content = await fs.readFile(file.path)
    await prisma.download.create({
      data: { userId: (await getSession())?.id, fileId: file.id, fileName: file.originalName, fileSize: file.size },
    })
    return new NextResponse(content, {
      headers: { 'Content-Type': file.mimeType, 'Content-Disposition': `attachment; filename="${file.originalName}"`, 'Content-Length': String(file.size) },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
