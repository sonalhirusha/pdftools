import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { storeFile } from '@/lib/file-storage'
import { getSession } from '@/lib/auth'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(getRateLimitKey(ip, 'upload'))
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const user = await getSession()
    const formData = await request.formData()
    const uploadedFiles = formData.getAll('files') as File[]
    if (uploadedFiles.length === 0) return NextResponse.json({ error: 'No files provided' }, { status: 400 })

    const results = []
    for (const file of uploadedFiles) {
      const stored = await storeFile(file, file.name, file.type)
      const fileRecord = await prisma.file.create({
        data: { userId: user?.id, originalName: stored.originalName, storedName: stored.storedName, mimeType: stored.mimeType, extension: stored.extension, size: stored.size, path: stored.path, expiresAt: stored.expiresAt },
      })
      results.push({ id: fileRecord.id, originalName: fileRecord.originalName, size: fileRecord.size, mimeType: fileRecord.mimeType })
    }
    return NextResponse.json({ success: true, files: results })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
