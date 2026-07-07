'use client'

import { useEffect } from 'react'

export function AdUnit() {
  useEffect(() => {
    const existing = document.querySelector('script[src*="effectivecpmnetwork.com/dbc7e0342"]')
    if (existing) return
    const script = document.createElement('script')
    script.src = 'https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js'
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    document.body.appendChild(script)
  }, [])

  return <div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6" />
}
