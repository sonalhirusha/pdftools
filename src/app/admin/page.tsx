'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { UsersIcon, FileTextIcon, Activity, Newspaper, Mail, MessageSquare, TrendingUp, ClockIcon } from 'lucide-react'
import type { AdminStats } from '@/types'
import { formatDateShort } from '@/lib/utils'

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<Array<{ toolName: string; createdAt: string; user: { name: string | null } | null }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats)
        setRecentActivity(data.recentActivity || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, change: `+${stats.recentUsers} this month`, icon: UsersIcon, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950' },
    { label: 'Files Processed', value: stats.totalFiles, change: `+${stats.recentUploads} this month`, icon: FileTextIcon, color: 'text-green-600 bg-green-50 dark:bg-green-950' },
    { label: 'Tool Usage', value: stats.totalUsage, icon: Activity, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950' },
    { label: 'Blog Posts', value: stats.totalBlogPosts, icon: Newspaper, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950' },
    { label: 'Subscribers', value: stats.totalSubscribers, icon: Mail, color: 'text-pink-600 bg-pink-50 dark:bg-pink-950' },
    { label: 'Messages', value: stats.totalContacts, icon: MessageSquare, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950' },
  ] : []

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your PDFTools platform</p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="card h-24 animate-pulse" />)}</div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {statCards?.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          {'change' in stat && <p className="text-xs text-green-600 mt-1">{stat.change}</p>}
                        </div>
                        <div className={`rounded-lg p-3 ${stat.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="card">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-4 w-4" /> Recent Activity</h2>
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity yet</p>
                ) : (
                  <div className="space-y-2">
                    {recentActivity.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm flex-1">{a.toolName}</span>
                        <span className="text-xs text-gray-500">{a.user?.name || 'Anonymous'}</span>
                        <span className="text-xs text-gray-400">{formatDateShort(a.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
