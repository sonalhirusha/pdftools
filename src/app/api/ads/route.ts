import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  if (!location) return NextResponse.json({ code: null })

  const ad = await prisma.adPlacement.findFirst({
    where: { location, active: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ code: ad?.code || null })
}
