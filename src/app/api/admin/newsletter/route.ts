import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const subscribers = await prisma.newsletterSubscription.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ subscribers })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
