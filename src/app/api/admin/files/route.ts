import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { deleteFile } from '@/lib/file-storage'

export async function GET() {
  try {
    await requireAdmin()
    const files = await prisma.file.findMany({
      where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, take: 50,
      include: { user: { select: { email: true } } },
    })
    return NextResponse.json({ files })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    const { id } = await request.json()
    const file = await prisma.file.findUnique({ where: { id } })
    if (file) { await deleteFile(file.path); await prisma.file.update({ where: { id }, data: { isDeleted: true } }) }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
