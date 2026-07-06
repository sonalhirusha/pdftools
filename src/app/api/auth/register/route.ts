import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { sendVerificationEmail } from '@/lib/email'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(getRateLimitKey(ip, 'register'))
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const body = await request.json()
    const validation = registerSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })

    const { name, email, password } = validation.data
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const hashedPassword = await hashPassword(password)
    await prisma.user.create({ data: { name, email, password: hashedPassword } })

    const verificationToken = generateToken()
    await prisma.verificationToken.create({
      data: { identifier: email, token: verificationToken, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    })
    try { await sendVerificationEmail(email, verificationToken) } catch { /* optional */ }

    return NextResponse.json({ success: true, message: 'Account created. Please check your email for verification.' })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
