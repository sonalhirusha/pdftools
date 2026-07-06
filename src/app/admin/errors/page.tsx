'use client'
import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Badge } from '@/components/ui/Badge'
import { formatDateShort } from '@/lib/utils'
import { AlertTriangleIcon } from 'lucide-react'

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<Array<{ id: string; message: string; path: string | null; statusCode: number | null; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/admin/errors').then(r => r.json()).then(d => setErrors(d.errors || [])).catch(console.error).finally(() => setLoading(false))
  }, [])
  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">Error Logs</h1>
          {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16 animate-pulse" />)}</div>
          : errors.length === 0 ? <div className="card text-center py-12"><AlertTriangleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No errors logged</p></div>
          : <div className="space-y-2">{errors.map(e => (
            <div key={e.id} className="card">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="danger">{e.statusCode || 'Error'}</Badge>
                <span className="text-xs text-gray-500">{e.path}</span>
                <span className="text-xs text-gray-400 ml-auto">{formatDateShort(e.createdAt)}</span>
              </div>
              <p className="text-sm">{e.message}</p>
            </div>
          ))}</div>}
        </div>
      </div>
    </AuthGuard>
  )
}
