import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pdftools.com'
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/

Sitemap: ${baseUrl}/sitemap.xml`.trim()
  return new NextResponse(robots, { headers: { 'Content-Type': 'text/plain' } })
}
