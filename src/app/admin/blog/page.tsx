'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDateShort } from '@/lib/utils'
import { PlusIcon, Edit2Icon, EyeIcon } from 'lucide-react'
import Link from 'next/link'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Array<{ id: string; title: string; slug: string; published: boolean; publishedAt: string | null; author: { name: string | null } }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthGuard requireAdmin>
      <div className="flex min-h-[80vh]">
        <Sidebar variant="admin" />
        <div className="flex-1 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Blog Posts</h1>
            <Button><PlusIcon className="h-4 w-4" /> New Post</Button>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="card h-16 animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.id} className="card flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{post.title}</span>
                      <Badge variant={post.published ? 'success' : 'warning'}>{post.published ? 'Published' : 'Draft'}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">By {post.author.name} &middot; {post.publishedAt ? formatDateShort(post.publishedAt) : 'Not published'}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/blog/${post.slug}`}><Button variant="ghost" size="sm"><EyeIcon className="h-4 w-4" /></Button></Link>
                    <Button variant="ghost" size="sm"><Edit2Icon className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
