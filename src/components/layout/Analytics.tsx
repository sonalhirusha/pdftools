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
    const gaScript = document.createElement('script')
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    gaScript.async = true
    document.head.appendChild(gaScript)
    window.dataLayer = window.dataLayer || []
    function gtag(...args: unknown[]) { window.dataLayer.push(args) }
    gtag('js', new Date())
    gtag('config', gaId)
  }, [gaId])

  return null
}
