import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const [totalUsers, totalFiles, totalUsage, totalBlogPosts, totalSubscribers, totalContacts] = await Promise.all([
      prisma.user.count(),
      prisma.file.count({ where: { isDeleted: false } }),
      prisma.toolUsage.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.newsletterSubscription.count({ where: { active: true } }),
      prisma.contactMessage.count(),
    ])
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const [recentUsers, recentUploads] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.file.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ])
    const toolUsageStats = await prisma.toolUsage.groupBy({
      by: ['toolName'], _count: true, orderBy: { _count: { toolName: 'desc' } }, take: 10,
    })
    const recentActivity = await prisma.toolUsage.findMany({
      orderBy: { createdAt: 'desc' }, take: 20,
      include: { user: { select: { name: true, email: true } } },
    })
    return NextResponse.json({
      stats: { totalUsers, totalFiles, totalUsage, totalBlogPosts, totalSubscribers, totalContacts, recentUsers, recentUploads },
      toolUsageStats, recentActivity,
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
