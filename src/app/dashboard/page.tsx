'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { FileTextIcon, Activity, Heart, Download, ArrowRight, ClockIcon } from 'lucide-react'
import type { DashboardStats } from '@/types'
import { formatDateShort, formatBytes } from '@/lib/utils'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentFiles, setRecentFiles] = useState<Array<{ id: string; originalName: string; size: number; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats)
        setRecentFiles(data.recentFiles || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Files', value: stats.totalFiles, icon: FileTextIcon, href: '/dashboard/files', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950' },
    { label: 'Tool Usage', value: stats.totalUsage, icon: Activity, href: '/dashboard/activity', color: 'text-green-600 bg-green-50 dark:bg-green-950' },
    { label: 'Favorites', value: stats.favoriteTools, icon: Heart, href: '/dashboard/favorites', color: 'text-red-600 bg-red-50 dark:bg-red-950' },
    { label: 'Downloads', value: stats.totalDownloads, icon: Download, href: '/dashboard/downloads', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950' },
  ] : []

  return (
    <AuthGuard>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="dashboard" />
        <div className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your files and activity</p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {statCards?.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <Link key={stat.label} href={stat.href} className="card-hover group">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className={`rounded-lg p-3 ${stat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        View details <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="card">
                        <h2 className="font-semibold mb-4 flex items-center gap-2"><ClockIcon className="h-4 w-4" /> Recent Files</h2>
                  {recentFiles.length === 0 ? (
                    <p className="text-sm text-gray-500">No files yet. <Link href="/tools" className="text-primary-600 hover:underline">Try a tool</Link></p>
                  ) : (
                    <div className="space-y-2">
                      {recentFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <FileTextIcon className="h-4 w-4 text-primary-600" />
                          <span className="text-sm flex-1 truncate">{file.originalName}</span>
                          <span className="text-xs text-gray-500">{formatBytes(file.size)}</span>
                          <span className="text-xs text-gray-400">{formatDateShort(file.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="card">
                  <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-4 w-4" /> Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/tools/merge" className="btn-secondary text-center text-xs">Merge PDF</Link>
                    <Link href="/tools/split" className="btn-secondary text-center text-xs">Split PDF</Link>
                    <Link href="/tools/compress" className="btn-secondary text-center text-xs">Compress PDF</Link>
                    <Link href="/tools/pdf-to-word" className="btn-secondary text-center text-xs">PDF to Word</Link>
                    <Link href="/tools/jpg-to-pdf" className="btn-secondary text-center text-xs">JPG to PDF</Link>
                    <Link href="/tools/password-protect" className="btn-secondary text-center text-xs">Protect PDF</Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
