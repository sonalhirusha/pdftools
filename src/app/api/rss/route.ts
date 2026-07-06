import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pdftools.com'
  const posts = await prisma.blogPost.findMany({
    where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 20,
    include: { author: { select: { name: true } } },
  })
  const items = posts.map((p) => `
    <item>
      <title>${escXml(p.title)}</title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <description>${escXml(p.excerpt || '')}</description>
      <pubDate>${p.publishedAt?.toUTCString() || ''}</pubDate>
      <guid>${baseUrl}/blog/${p.slug}</guid>
    </item>`).join('')

  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PDFTools Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Latest PDF tips, tutorials, and news</description>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
