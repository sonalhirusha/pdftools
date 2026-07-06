'use client'
import { useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Building2Icon } from 'lucide-react'

export default function AdminAdsPage() {
  const locations = ['top-banner', 'sidebar', 'in-content', 'bottom-banner', 'sticky-footer', 'mobile-header', 'mobile-in-content', 'mobile-sticky-bottom', 'popup']
  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">Ad Placements</h1>
          <div className="card">
            <p className="text-sm text-gray-500 mb-4">Configure advertisement locations. Add your ad network code in the database.</p>
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Building2Icon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium flex-1 capitalize">{location.replace(/-/g, ' ')}</span>
                  <span className="text-xs text-gray-500">Not configured</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
