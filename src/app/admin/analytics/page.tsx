'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { TrendingUp, BarChart3Icon } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [toolStats, setToolStats] = useState<Array<{ toolName: string; _count: number }>>([])

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then((d) => setToolStats(d.toolUsageStats || [])).catch(() => {})
  }, [])

  const total = toolStats.reduce((acc, t) => acc + t._count, 0)

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">Analytics</h1>
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><BarChart3Icon className="h-4 w-4" /> Tool Usage</h2>
            {toolStats.length === 0 ? (
              <p className="text-sm text-gray-500">No data yet</p>
            ) : (
              <div className="space-y-3">
                {toolStats.map((t) => (
                  <div key={t.toolName} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{t.toolName}</span>
                      <span className="text-gray-500">{t._count} ({((t._count / total) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-full rounded-full bg-primary-500" style={{ width: `${(t._count / total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
