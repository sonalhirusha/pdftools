'use client'
import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDateShort } from '@/lib/utils'
import { MegaphoneIcon, PlusIcon } from 'lucide-react'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Array<{ id: string; title: string; content: string; type: string; active: boolean; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/admin/announcements').then(r => r.json()).then(d => setAnnouncements(d.announcements || [])).catch(console.error).finally(() => setLoading(false))
  }, [])
  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold">Announcements</h1><Button><PlusIcon className="h-4 w-4" /> New</Button></div>
          {loading ? <div className="space-y-3">{[1,2].map(i => <div key={i} className="card h-16 animate-pulse" />)}</div>
          : announcements.length === 0 ? <div className="card text-center py-12"><MegaphoneIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No announcements</p></div>
          : <div className="space-y-3">{announcements.map(a => (
            <div key={a.id} className="card">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{a.title}</h3>
                <Badge variant={a.active ? 'success' : 'default'}>{a.active ? 'Active' : 'Inactive'}</Badge>
                <span className="text-xs text-gray-400 ml-auto">{formatDateShort(a.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{a.content}</p>
            </div>
          ))}</div>}
        </div>
      </div>
    </AuthGuard>
  )
}
