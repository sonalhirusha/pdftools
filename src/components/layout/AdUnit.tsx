'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    atOptions?: { key: string; format: string; height: number; width: number; params: Record<string, unknown> }
  }
}

export function AdUnit() {
  useEffect(() => {
    const cpmScript = document.querySelector('script[src*="effectivecpmnetwork.com/dbc7e0342"]')
    if (!cpmScript) {
      const s = document.createElement('script')
      s.src = 'https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js'
      s.async = true
      s.setAttribute('data-cfasync', 'false')
      document.body.appendChild(s)
    }

    const bannerScript = document.querySelector('script[src*="highperformanceformat.com/323ecd135b38a26a6d45afd0e33ff4f8"]')
    if (!bannerScript) {
      window.atOptions = {
        key: '323ecd135b38a26a6d45afd0e33ff4f8',
        format: 'iframe',
        height: 60,
        width: 468,
        params: {},
      }
      const s = document.createElement('script')
      s.src = 'https://www.highperformanceformat.com/323ecd135b38a26a6d45afd0e33ff4f8/invoke.js'
      document.body.appendChild(s)
    }
  }, [])

  return (
    <>
      <div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6" />
      <div id="container-323ecd135b38a26a6d45afd0e33ff4f8" />
    </>
  )
}
