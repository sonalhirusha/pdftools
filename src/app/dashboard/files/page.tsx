'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { FileTextIcon, Download, Trash2 } from 'lucide-react'
import { formatDateShort, formatBytes } from '@/lib/utils'

export default function FilesPage() {
  const [files, setFiles] = useState<Array<{ id: string; originalName: string; size: number; mimeType: string; createdAt: string; expiresAt: string }>>([])
  const [loading, setLoading] = useState(true)

  const loadFiles = () => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => setFiles(data.recentFiles || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadFiles() }, [])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/files/${id}`, { method: 'DELETE' })
      loadFiles()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AuthGuard>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="dashboard" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">My Files</h1>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="card h-16 animate-pulse" />)}</div>
          ) : files.length === 0 ? (
            <div className="card text-center py-12">
              <FileTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="card flex items-center gap-4">
                  <FileTextIcon className="h-5 w-5 text-primary-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.originalName}</p>
                    <p className="text-xs text-gray-500">{formatBytes(file.size)} &middot; {formatDateShort(file.createdAt)}</p>
                  </div>
                  <a href={`/api/download/${file.id}`} download><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></a>
                  <button onClick={() => handleDelete(file.id)} className="btn-ghost p-2 text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
