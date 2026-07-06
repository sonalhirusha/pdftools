'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Metadata } from 'next'
import { Mail, MapPinIcon, PhoneIcon, SendIcon, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send message')
      setSent(true)
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle mx-auto">Have a question or need help? We&apos;d love to hear from you.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary-600 mt-0.5" />
            <div><p className="font-medium">Email</p><p className="text-sm text-gray-500">hello@pdftools.com</p></div>
          </div>
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-primary-600 mt-0.5" />
            <div><p className="font-medium">Location</p><p className="text-sm text-gray-500">Available worldwide</p></div>
          </div>
          <div className="flex items-start gap-3">
            <PhoneIcon className="h-5 w-5 text-primary-600 mt-0.5" />
            <div><p className="font-medium">Response Time</p><p className="text-sm text-gray-500">Usually within 24 hours</p></div>
          </div>
        </div>
        {sent ? (
          <div className="card text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="font-semibold">Message sent!</p>
            <p className="text-sm text-gray-500 mt-1">We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4">
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <div className="space-y-1.5">
              <label className="label">Message</label>
              <textarea className="input-field min-h-[120px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <Button type="submit" loading={loading} className="w-full"><SendIcon className="h-4 w-4" /> Send Message</Button>
          </form>
        )}
      </div>
    </div>
  )
}
