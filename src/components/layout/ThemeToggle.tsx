'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  const toggle = () => { if (theme === 'light') setTheme('dark'); else if (theme === 'dark') setTheme('system'); else setTheme('light') }
  return (
    <button onClick={toggle} className="btn-ghost p-2 rounded-lg" aria-label={`Theme: ${theme}`}>
      {theme === 'light' ? <SunIcon className="h-4 w-4" /> : theme === 'dark' ? <MoonIcon className="h-4 w-4" /> : <MonitorIcon className="h-4 w-4" />}
    </button>
  )
}
