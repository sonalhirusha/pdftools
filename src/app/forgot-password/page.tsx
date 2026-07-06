'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FileTextIcon, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed to send reset email')
      setSent(true)
    } catch {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6"><FileTextIcon className="h-8 w-8 text-primary-600" /><span className="gradient-text">PDFTools</span></Link>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="mt-2 text-sm text-gray-500">Enter your email and we&apos;ll send you a reset link</p>
        </div>
        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Check your email for the reset link. It may take a few minutes.</p>
            <Link href="/login"><Button variant="secondary">Back to login</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">{error}</div>}
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            <Button type="submit" loading={loading} className="w-full">Send reset link</Button>
            <p className="text-center text-sm text-gray-500"><Link href="/login" className="text-primary-600 hover:underline">Back to login</Link></p>
          </form>
        )}
      </div>
    </div>
  )
}
