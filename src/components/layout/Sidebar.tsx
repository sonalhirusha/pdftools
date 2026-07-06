'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboardIcon, FileTextIcon, BarChart3Icon, UsersIcon, Newspaper, Mail, AlertTriangleIcon, FolderOpenIcon, MegaphoneIcon, SettingsIcon, Building2Icon, UserIcon, Download, HistoryIcon, Heart, ClockIcon } from 'lucide-react'

interface SidebarProps { variant: 'dashboard' | 'admin' }

const dashboardLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
  { name: 'My Files', href: '/dashboard/files', icon: FileTextIcon },
  { name: 'Activity', href: '/dashboard/activity', icon: HistoryIcon },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  { name: 'Downloads', href: '/dashboard/downloads', icon: Download },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
]

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboardIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3Icon },
  { name: 'Blog', href: '/admin/blog', icon: Newspaper },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { name: 'Errors', href: '/admin/errors', icon: AlertTriangleIcon },
  { name: 'Files', href: '/admin/files', icon: FolderOpenIcon },
  { name: 'Announcements', href: '/admin/announcements', icon: MegaphoneIcon },
  { name: 'Ads', href: '/admin/ads', icon: Building2Icon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
]

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname()
  const links = variant === 'admin' ? adminLinks : dashboardLinks
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-gray-50/50 dark:bg-gray-900/50 dark:border-gray-800">
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {links.map(link => {
          const Icon = link.icon
          const active = pathname === link.href
          return (
            <Link key={link.href} href={link.href} className={cn('flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
              active ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800')}>
              <Icon className="h-4 w-4" /> {link.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
