'use client'
import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { formatBytes, formatDateShort } from '@/lib/utils'
import { Trash2, FileTextIcon } from 'lucide-react'

export default function AdminFilesPage() {
  const [files, setFiles] = useState<Array<{ id: string; originalName: string; size: number; user: { email: string | null } | null; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/admin/files').then(r => r.json()).then(d => setFiles(d.files || [])).catch(console.error).finally(() => setLoading(false))
  }, [])
  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">File Management</h1>
          {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-16 animate-pulse" />)}</div>
          : <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="pb-3 font-medium">File</th><th className="pb-3 font-medium">Size</th><th className="pb-3 font-medium">User</th><th className="pb-3 font-medium">Uploaded</th></tr></thead>
              <tbody>{files.map(f => (
                <tr key={f.id} className="border-b">
                  <td className="py-3 flex items-center gap-2"><FileTextIcon className="h-4 w-4 text-primary-600" /> {f.originalName}</td>
                  <td className="py-3 text-gray-500">{formatBytes(f.size)}</td>
                  <td className="py-3 text-gray-500">{f.user?.email || 'Anonymous'}</td>
                  <td className="py-3 text-gray-500">{formatDateShort(f.createdAt)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>}
        </div>
      </div>
    </AuthGuard>
  )
}
