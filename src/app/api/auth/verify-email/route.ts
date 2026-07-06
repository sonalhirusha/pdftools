import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    if (!token) return NextResponse.json({ error: 'Token is required' }, { status: 400 })

    const verification = await prisma.verificationToken.findUnique({ where: { token } })
    if (!verification || verification.expires < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }
    await prisma.user.update({ where: { email: verification.identifier }, data: { emailVerified: new Date() } })
    await prisma.verificationToken.delete({ where: { token: verification.token } })
    return NextResponse.redirect(new URL('/login?verified=true', request.url))
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
