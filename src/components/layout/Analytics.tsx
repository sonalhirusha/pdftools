'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  useEffect(() => {
    if (!gaId) return
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    script.async = true
    document.head.appendChild(script)
    window.dataLayer = window.dataLayer || []
    function gtag(...args: unknown[]) { window.dataLayer.push(args) }
    gtag('js', new Date())
    gtag('config', gaId)
  }, [gaId])

  return null
}
