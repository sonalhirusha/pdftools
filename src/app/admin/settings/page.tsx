'use client'
import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(data => {
      if (Array.isArray(data.settings)) {
        const s: Record<string, string> = {}
        data.settings.forEach((item: { key: string; value: string | boolean | number }) => { s[item.key] = String(item.value) })
        setSettings(s)
      } else if (data.settings && typeof data.settings === 'object') {
        const s: Record<string, string> = {}
        Object.entries(data.settings).forEach(([key, value]) => { s[key] = String(value) })
        setSettings(s)
      }
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setMessage('')
    try {
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings }) })
      setMessage(res.ok ? 'Settings saved' : 'Failed to save')
    } catch { setMessage('An error occurred') }
    finally { setSaving(false) }
  }

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8 max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
          {loading ? <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="card h-16 animate-pulse" />)}</div>
          : <div className="card space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <Input key={key} label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} value={value} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
            ))}
            {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
            <Button onClick={handleSave} loading={saving}>Save Settings</Button>
          </div>}
        </div>
      </div>
    </AuthGuard>
  )
}
