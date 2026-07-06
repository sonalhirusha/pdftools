import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, getReadingTime } from '@/lib/utils'
import { Metadata } from 'next'
import { ArrowRight, ClockIcon, UserIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog - PDF Tips & Tutorials',
  description: 'Learn how to get the most out of PDFs with our tips, tutorials, and guides.',
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = 9
  const categorySlug = params.category

  const where = { published: true, ...(categorySlug ? { category: { slug: categorySlug } } : {}) }

  const [posts, total, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { name: true, image: true } }, category: { select: { name: true, slug: true } }, tags: { include: { tag: true } } },
    }),
    prisma.blogPost.count({ where }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container-page">
      <div className="text-center mb-12">
        <h1 className="section-title">PDFTools Blog</h1>
        <p className="section-subtitle mx-auto">Tips, tutorials, and guides for working with PDFs</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Link href="/blog" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categorySlug ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
          All
        </Link>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/blog?category=${cat.slug}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categorySlug === cat.slug ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
            {cat.name}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-hover group flex flex-col">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-950 dark:to-accent-950 mb-4 flex items-center justify-center">
                <span className="text-4xl opacity-30">📄</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                {post.category && <span className="text-primary-600 font-medium">{post.category.name}</span>}
                <span>·</span>
                <ClockIcon className="h-3 w-3" />
                <span>{post.readingTime} min read</span>
              </div>
              <h2 className="font-semibold group-hover:text-primary-600 transition-colors mb-2">{post.title}</h2>
              {post.excerpt && <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">{post.excerpt}</p>}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <UserIcon className="h-3 w-3" />
                <span>{post.author.name || 'Anonymous'}</span>
                <span>·</span>
                <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}`}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
