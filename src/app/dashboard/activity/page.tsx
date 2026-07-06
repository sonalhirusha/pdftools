'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Activity, ClockIcon } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'

export default function ActivityPage() {
  const [activities, setActivities] = useState<Array<{ toolName: string; toolCategory: string; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => setActivities(d.recentActivity || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthGuard>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="dashboard" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">Recent Activity</h1>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-16 animate-pulse" />)}</div>
          ) : activities.length === 0 ? (
            <div className="card text-center py-12">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((a, i) => (
                <div key={i} className="card flex items-center gap-3">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm flex-1">Used <strong>{a.toolName}</strong></span>
                  <span className="text-xs text-gray-400 capitalize">{a.toolCategory}</span>
                  <span className="text-xs text-gray-400">{formatDateShort(a.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
