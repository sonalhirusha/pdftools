import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import type { Prisma } from '@prisma/client'

type SettingsRecord = Record<string, string | boolean | number>

export async function GET() {
  try {
    await requireAdmin()
    const settings = await prisma.siteSettings.findMany()
    const plain: SettingsRecord = {}
    settings.forEach((s) => { plain[s.key] = s.value as string | boolean | number })
    return NextResponse.json({ settings: plain })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const { settings } = await request.json() as { settings: SettingsRecord }
    for (const [key, value] of Object.entries(settings)) {
      const jsonValue = String(value) as unknown as Prisma.InputJsonValue
      await prisma.siteSettings.upsert({
        where: { key },
        update: { value: jsonValue },
        create: { key, value: jsonValue },
      })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
