import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const favorites = await prisma.userFavoriteTool.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ favorites })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { toolId, toolName } = await request.json()
    const favorite = await prisma.userFavoriteTool.upsert({
      where: { userId_toolId: { userId: user.id, toolId } },
      update: {},
      create: { userId: user.id, toolId, toolName },
    })
    return NextResponse.json({ favorite })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth()
    const { toolId } = await request.json()
    await prisma.userFavoriteTool.deleteMany({ where: { userId: user.id, toolId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
