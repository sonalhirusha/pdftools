'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Badge } from '@/components/ui/Badge'
import { formatDateShort } from '@/lib/utils'
import { Mail } from 'lucide-react'

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Array<{ id: string; email: string; active: boolean; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then((r) => r.json())
      .then((d) => setSubscribers(d.subscribers || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">Newsletter Subscribers</h1>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-16 animate-pulse" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left"><th className="pb-3 font-medium">Email</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Subscribed</th></tr></thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="py-3 flex items-center gap-1"><Mail className="h-3 w-3" /> {s.email}</td>
                      <td className="py-3"><Badge variant={s.active ? 'success' : 'danger'}>{s.active ? 'Active' : 'Unsubscribed'}</Badge></td>
                      <td className="py-3 text-gray-500">{formatDateShort(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
