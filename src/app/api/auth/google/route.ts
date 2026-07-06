import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setSessionCookie } from '@/lib/auth'
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await rateLimit(getRateLimitKey(ip, 'google-auth'))
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  if (!GOOGLE_CLIENT_ID) return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 501 })

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID, redirect_uri: REDIRECT_URI,
    response_type: 'code', scope: 'openid email profile',
    access_type: 'offline', prompt: 'consent',
  })
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    if (!code) return NextResponse.json({ error: 'Authorization code required' }, { status: 400 })

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: GOOGLE_CLIENT_ID || '', client_secret: GOOGLE_CLIENT_SECRET || '',
        redirect_uri: REDIRECT_URI, grant_type: 'authorization_code',
      }),
    })
    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok) return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 401 })

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const googleUser = await userResponse.json()

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: googleUser.id }, { email: googleUser.email }] },
    })
    if (user) {
      user = await prisma.user.update({ where: { id: user.id },
        data: { googleId: googleUser.id, image: user.image || googleUser.picture, name: user.name || googleUser.name, emailVerified: user.emailVerified || new Date() },
      })
    } else {
      user = await prisma.user.create({
        data: { name: googleUser.name, email: googleUser.email, googleId: googleUser.id, image: googleUser.picture, emailVerified: new Date(), password: '' },
      })
    }
    await setSessionCookie({ userId: user.id, email: user.email!, role: user.role })
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image } })
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
