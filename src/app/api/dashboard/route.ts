import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const [totalFiles, totalUsage, favoriteTools, totalDownloads] = await Promise.all([
      prisma.file.count({ where: { userId: user.id, isDeleted: false } }),
      prisma.toolUsage.count({ where: { userId: user.id } }),
      prisma.userFavoriteTool.count({ where: { userId: user.id } }),
      prisma.download.count({ where: { userId: user.id } }),
    ])
    const recentFiles = await prisma.file.findMany({
      where: { userId: user.id, isDeleted: false }, orderBy: { createdAt: 'desc' }, take: 10,
    })
    const recentActivity = await prisma.toolUsage.findMany({
      where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10,
    })
    return NextResponse.json({ stats: { totalFiles, totalUsage, favoriteTools, totalDownloads }, recentFiles, recentActivity })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}
