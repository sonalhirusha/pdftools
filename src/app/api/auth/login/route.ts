import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, setSessionCookie } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(getRateLimitKey(ip, 'login'))
    if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const body = await request.json()
    const validation = loginSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })

    const { email, password } = validation.data
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    const valid = await verifyPassword(password, user.password)
    if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    if (!user.isActive) return NextResponse.json({ error: 'Account deactivated' }, { status: 403 })

    await setSessionCookie({ userId: user.id, email: user.email!, role: user.role })
    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
