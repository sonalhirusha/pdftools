import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { getFileExtension } from './utils'

const UPLOAD_DIR = process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp/uploads' : './uploads')
const AUTO_DELETE_HOURS = parseInt(process.env.AUTO_DELETE_HOURS || '24')

export interface StoredFile {
  id: string
  originalName: string
  storedName: string
  path: string
  extension: string
  mimeType: string
  size: number
  expiresAt: Date
}

export async function ensureUploadDir(): Promise<void> {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  } catch {
    // directory exists
  }
}

export async function storeFile(
  file: Buffer | File,
  originalName: string,
  mimeType: string
): Promise<StoredFile> {
  await ensureUploadDir()
  const extension = getFileExtension(originalName)
  const id = uuidv4()
  const storedName = `${id}.${extension}`
  const filePath = path.join(UPLOAD_DIR, storedName)

  if (Buffer.isBuffer(file)) {
    await fs.writeFile(filePath, file)
  } else {
    const buf = await file.arrayBuffer()
    const bytes = Buffer.from(buf)
    await fs.writeFile(filePath, bytes)
  }

  const stat = await fs.stat(filePath)

  return {
    id,
    originalName,
    storedName,
    path: filePath,
    extension,
    mimeType,
    size: stat.size,
    expiresAt: new Date(Date.now() + AUTO_DELETE_HOURS * 60 * 60 * 1000),
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch {
    // file already deleted
  }
}

export async function cleanupExpiredFiles(): Promise<void> {
  try {
    const files = await fs.readdir(UPLOAD_DIR)
    const now = Date.now()
    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file)
      const stat = await fs.stat(filePath)
      if (now - stat.mtimeMs > AUTO_DELETE_HOURS * 60 * 60 * 1000) {
        await fs.unlink(filePath)
      }
    }
  } catch {
    // directory doesn't exist or other error
  }
}

export async function getFileStats(filePath: string): Promise<{ exists: boolean; size: number }> {
  try {
    const stat = await fs.stat(filePath)
    return { exists: true, size: stat.size }
  } catch {
    return { exists: false, size: 0 }
  }
}
