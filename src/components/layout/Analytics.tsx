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
    const adScript = document.createElement('script')
    adScript.src = 'https://pl30241180.effectivecpmnetwork.com/be/b6/c1/beb6c10bacd295422228e7015129b14e.js'
    adScript.async = true
    document.head.appendChild(adScript)

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
