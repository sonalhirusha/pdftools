import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchTools } from '@/lib/tools'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  if (q.length < 2) return NextResponse.json({ results: [] })

  const toolResults = searchTools(q).map((t) => ({ type: 'tool' as const, title: t.name, description: t.description, href: t.href }))
  const blogResults = await prisma.blogPost.findMany({
    where: { published: true, OR: [{ title: { contains: q, mode: 'insensitive' } }, { excerpt: { contains: q, mode: 'insensitive' } }] },
    select: { title: true, slug: true, excerpt: true }, take: 5,
  })
  const results = [
    ...toolResults,
    ...blogResults.map((p) => ({ type: 'blog' as const, title: p.title, description: p.excerpt || '', href: `/blog/${p.slug}` })),
  ]
  return NextResponse.json({ results })
}
