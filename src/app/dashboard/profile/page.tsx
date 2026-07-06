'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { UserIcon } from 'lucide-react'
import type { UserProfile } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => { setUser(data.user); setName(data.user?.name || '') })
      .catch(() => router.push('/login'))
  }, [router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) setMessage('Profile updated successfully')
      else setMessage('Failed to update profile')
    } catch {
      setMessage('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    try {
      await fetch('/api/auth/me', { method: 'DELETE' })
      router.push('/')
    } catch {}
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (!user) return null

  return (
    <AuthGuard>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="dashboard" />
        <div className="flex-1 p-6 lg:p-8 max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          <div className="card space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold">{user.name || 'User'}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email" value={user.email || ''} disabled helperText="Email cannot be changed" />
              {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
              <Button type="submit" loading={loading}>Save Changes</Button>
            </form>

            <hr />
            <div className="space-y-3">
              <Button variant="secondary" onClick={handleLogout}>Sign Out</Button>
              <div>
                <Button variant="danger" onClick={handleDelete}>Delete Account</Button>
                <p className="text-xs text-gray-500 mt-1">This action is irreversible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
