import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(getRateLimitKey(ip, 'forgot-password'))
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' })

    const token = generateToken()
    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    })
    try { await sendPasswordResetEmail(email, token) } catch { /* optional */ }

    return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
