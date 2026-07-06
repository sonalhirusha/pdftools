import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { path, referrer, userAgent } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    await prisma.pageView.create({ data: { path, referrer, userAgent, ip } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
