'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { MenuIcon, X, FileTextIcon, ChevronDownIcon } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'AI Chat', href: '/ai-chat' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password')
  if (isAuthPage) return null

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FileTextIcon className="h-7 w-7 text-primary-600" />
            <span className="gradient-text">PDFTools</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={cn('px-3 py-2 text-sm font-medium rounded-lg transition-colors', 
                pathname === item.href ? 'text-primary-600 bg-primary-50 dark:bg-primary-950 dark:text-primary-400' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-gray-800')}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar />
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link href="/register"><Button size="sm">Sign up</Button></Link>
          </div>
          <button className="md:hidden btn-ghost p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-950 p-4 space-y-2 animate-in slide-in-from-top-2">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileOpen(false)}>
              {item.name}
            </Link>
          ))}
          <hr className="my-2" />
          <Link href="/login" className="block"><Button variant="ghost" className="w-full">Log in</Button></Link>
          <Link href="/register" className="block"><Button className="w-full">Sign up</Button></Link>
        </div>
      )}
    </header>
  )
}
