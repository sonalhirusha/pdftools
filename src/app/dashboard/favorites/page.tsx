'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Heart, FileTextIcon } from 'lucide-react'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Array<{ id: string; toolName: string; toolId: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/favorites')
      .then((r) => r.json())
      .then((d) => setFavorites(d.favorites || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthGuard>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="dashboard" />
        <div className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-6">Favorite Tools</h1>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-16 animate-pulse" />)}</div>
          ) : favorites.length === 0 ? (
            <div className="card text-center py-12">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No favorite tools yet</p>
              <Link href="/tools"><Button variant="secondary" className="mt-4">Browse Tools</Button></Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((f) => (
                <Link key={f.id} href={`/tools/${f.toolId}`} className="card-hover flex items-center gap-3">
                  <FileTextIcon className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">{f.toolName}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
