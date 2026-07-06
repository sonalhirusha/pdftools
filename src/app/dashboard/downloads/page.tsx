'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Download, FileTextIcon } from 'lucide-react'
import { formatDateShort, formatBytes } from '@/lib/utils'

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<Array<{ id: string; fileName: string; fileSize: number; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/downloads')
      .then((r) => r.json())
      .then((d) => setDownloads(d.downloads || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthGuard>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="dashboard" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">Download History</h1>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-16 animate-pulse" />)}</div>
          ) : downloads.length === 0 ? (
            <div className="card text-center py-12">
              <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No downloads yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {downloads.map((d) => (
                <div key={d.id} className="card flex items-center gap-3">
                  <FileTextIcon className="h-4 w-4 text-primary-600" />
                  <span className="text-sm flex-1 truncate">{d.fileName}</span>
                  <span className="text-xs text-gray-500">{formatBytes(d.fileSize)}</span>
                  <span className="text-xs text-gray-400">{formatDateShort(d.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
