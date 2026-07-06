import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(getRateLimitKey(ip, 'newsletter'))
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    const existing = await prisma.newsletterSubscription.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ message: 'Already subscribed!' })
    await prisma.newsletterSubscription.create({ data: { email } })
    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    await prisma.newsletterSubscription.updateMany({ where: { email }, data: { active: false } })
    return NextResponse.json({ success: true, message: 'Unsubscribed successfully.' })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
