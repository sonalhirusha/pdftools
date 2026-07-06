import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, generateMetaTitle, generateMetaDescription, generateCanonicalUrl } from '@/lib/utils'
import { Metadata } from 'next'
import { ArrowLeftIcon, ClockIcon, UserIcon, TagIcon } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return { title: 'Post Not Found' }
  return {
    title: generateMetaTitle(post.metaTitle || post.title),
    description: generateMetaDescription(post.metaDesc || post.excerpt || ''),
    alternates: { canonical: generateCanonicalUrl(`/blog/${post.slug}`) },
    openGraph: { title: post.title, description: post.excerpt || '', images: post.featuredImage ? [{ url: post.featuredImage }] : [] },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true, image: true } }, category: { select: { name: true, slug: true } }, tags: { include: { tag: true } } },
  })

  if (!post) notFound()

  const relatedPosts = await prisma.blogPost.findMany({
    where: { published: true, id: { not: post.id }, OR: post.categoryId ? [{ categoryId: post.categoryId }] : undefined },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    select: { title: true, slug: true, excerpt: true },
  })

  return (
    <article className="container-page max-w-3xl">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-8">
        <ArrowLeftIcon className="h-4 w-4" /> Back to blog
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          {post.category && <Link href={`/blog?category=${post.category.slug}`} className="text-primary-600 font-medium">{post.category.name}</Link>}
          <span>·</span>
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{post.readingTime} min read</span>
          <span>·</span>
          <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{post.excerpt}</p>}
        <div className="mt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-primary-600" />
          </div>
          <span className="font-medium">{post.author.name || 'Anonymous'}</span>
        </div>
      </header>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((pt) => (
            <span key={pt.tag.id} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800">
              <TagIcon className="h-3 w-3" /> {pt.tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary-600">
        {post.content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>
          if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>
          if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
          if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>
          if (line.match(/^\d+\. /)) return <li key={i}>{line.replace(/^\d+\. /, '')}</li>
          if (line.trim() === '') return <br key={i} />
          return <p key={i}>{line}</p>
        })}
      </div>

      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-bold mb-6">Related Posts</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((rp) => (
              <Link key={rp.slug} href={`/blog/${rp.slug}`} className="card-hover">
                <h3 className="font-semibold text-sm">{rp.title}</h3>
                {rp.excerpt && <p className="text-xs text-gray-500 mt-1">{rp.excerpt}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          author: { '@type': 'Person', name: post.author.name },
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
        }),
      }} />
    </article>
  )
}
