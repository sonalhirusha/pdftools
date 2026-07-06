'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types'

export function AuthGuard({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(res => { if (!res.ok) throw new Error('Not authenticated'); return res.json() })
      .then(data => {
        if (data.user) { setUser(data.user); if (requireAdmin && data.user.role !== 'ADMIN') router.push('/dashboard') }
      }).catch(() => router.push('/login')).finally(() => setLoading(false))
  }, [router, requireAdmin])

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" /></div>
  if (!user) return null
  return <>{children}</>
}
