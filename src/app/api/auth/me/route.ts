import { NextResponse } from 'next/server'
import { getSession, requireAuth, clearSessionCookie } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/file-storage'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()
    const { name } = await request.json()
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name },
      select: { id: true, name: true, email: true, image: true, role: true },
    })
    return NextResponse.json({ user: updated })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  try {
    const user = await requireAuth()
    const userFiles = await prisma.file.findMany({ where: { userId: user.id } })
    for (const file of userFiles) {
      await deleteFile(file.path)
    }
    await prisma.user.delete({ where: { id: user.id } })
    await clearSessionCookie()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
