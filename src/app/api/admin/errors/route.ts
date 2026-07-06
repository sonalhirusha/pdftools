import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const errors = await prisma.errorLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    return NextResponse.json({ errors })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
