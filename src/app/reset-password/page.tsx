'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FileTextIcon } from 'lucide-react'

export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const router = useRouter()
  const { token } = use(searchParams)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ password: '', confirmPassword: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      })
      if (!res.ok) throw new Error('Failed to reset password')
      router.push('/login?reset=true')
    } catch {
      setError('Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Invalid reset link.</p></div>

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6"><FileTextIcon className="h-8 w-8 text-primary-600" /><span className="gradient-text">PDFTools</span></Link>
          <h1 className="text-2xl font-bold">Set new password</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <Input label="New Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          <Button type="submit" loading={loading} className="w-full">Reset password</Button>
        </form>
      </div>
    </div>
  )
}
