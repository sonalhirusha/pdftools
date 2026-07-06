import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/file-storage'
import { requireAuth } from '@/lib/auth'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const file = await prisma.file.findUnique({ where: { id } })
    if (!file || file.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    await deleteFile(file.path)
    await prisma.file.update({ where: { id }, data: { isDeleted: true } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
