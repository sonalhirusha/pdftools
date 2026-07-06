export interface Tool {
  id: string
  name: string
  description: string
  category: 'basic' | 'convert' | 'edit' | 'security' | 'ai'
  icon: string
  color: string
  href: string
  popular?: boolean
  new?: boolean
  comingSoon?: boolean
}

export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: 'USER' | 'ADMIN'
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface FileInfo {
  id: string
  originalName: string
  size: number
  mimeType: string
  extension: string
  createdAt: string
  expiresAt: string
}

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  readingTime: number | null
  publishedAt: string | null
  author: { name: string | null; image: string | null }
  category: { name: string; slug: string } | null
  tags: { tag: { name: string; slug: string } }[]
}

export interface DashboardStats {
  totalFiles: number
  totalUsage: number
  favoriteTools: number
  totalDownloads: number
  storageUsed: number
}

export interface AdminStats {
  totalUsers: number
  totalFiles: number
  totalUsage: number
  totalBlogPosts: number
  totalSubscribers: number
  totalContacts: number
  recentUsers: number
  recentUploads: number
}
