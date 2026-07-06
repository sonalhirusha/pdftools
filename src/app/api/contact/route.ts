import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations'
import { sendContactNotification } from '@/lib/email'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(getRateLimitKey(ip, 'contact'))
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const body = await request.json()
    const validation = contactSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })

    const { name, email, subject, message } = validation.data
    await prisma.contactMessage.create({ data: { name, email, subject, message } })
    try { await sendContactNotification({ name, email, subject, message }) } catch { /* silent */ }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
