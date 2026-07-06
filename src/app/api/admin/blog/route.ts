import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { slugify, getReadingTime } from '@/lib/utils'
import { blogPostSchema } from '@/lib/validations'

export async function GET() {
  try {
    await requireAdmin()
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } }, category: { select: { name: true } }, tags: { include: { tag: true } } },
    })
    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin()
    const body = await request.json()
    const validation = blogPostSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })

    const { title, content, excerpt, categoryId, tags, featuredImage, published, metaTitle, metaDesc } = validation.data
    const slug = slugify(title)
    const readingTime = getReadingTime(content)

    const post = await prisma.blogPost.create({
      data: {
        title, slug, content, excerpt, featuredImage, published: published || false,
        metaTitle, metaDesc, readingTime, authorId: user.id, categoryId,
        tags: tags ? { create: tags.map((tagId) => ({ tagId })) } : undefined,
      },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Create blog post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
