import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { setSessionCookie } from '@/lib/auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code')
    const error = request.nextUrl.searchParams.get('error')
    if (error || !code) {
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: GOOGLE_CLIENT_ID || '', client_secret: GOOGLE_CLIENT_SECRET || '',
        redirect_uri: REDIRECT_URI, grant_type: 'authorization_code',
      }),
    })
    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url))
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const googleUser = await userResponse.json()

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: googleUser.id }, { email: googleUser.email }] },
    })
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.id,
          image: user.image || googleUser.picture,
          name: user.name || googleUser.name,
          emailVerified: user.emailVerified || new Date(),
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          name: googleUser.name, email: googleUser.email,
          googleId: googleUser.id, image: googleUser.picture,
          emailVerified: new Date(), password: '',
        },
      })
    }

    await setSessionCookie({ userId: user.id, email: user.email!, role: user.role })
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch {
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}
