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
    ;['https://pl30241180.effectivecpmnetwork.com/be/b6/c1/beb6c10bacd295422228e7015129b14e.js',
      'https://pl30241182.effectivecpmnetwork.com/dc/6d/ca/dc6dca26e73c51823850fab290f2b0c1.js',
      'https://www.effectivecpmnetwork.com/iubme16h3v?key=a190b566f3e6a174dff077c12f5d3e57',
    ].forEach(src => {
      if (document.querySelector(`script[src="${src}"]`)) return
      const s = document.createElement('script')
      s.src = src; s.async = true
      document.head.appendChild(s)
    })

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
