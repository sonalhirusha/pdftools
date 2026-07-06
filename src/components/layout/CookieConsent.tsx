'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-800 shadow-2xl" role="alert" aria-label="Cookie consent">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We use cookies to enhance your experience. By continuing, you agree to our{' '}
          <Link href="/cookie-policy" className="text-primary-600 hover:underline">Cookie Policy</Link>.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={decline}>Decline</Button>
          <Button size="sm" onClick={accept}>Accept</Button>
          <button onClick={decline} className="btn-ghost p-1.5" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  )
}
