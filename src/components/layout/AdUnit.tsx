'use client'

import { useEffect } from 'react'

const bannerAds = [
  { key: '323ecd135b38a26a6d45afd0e33ff4f8', height: 60, width: 468 },
  { key: '4a0047c92dec61603ab2d2cc9c33421b', height: 50, width: 320 },
  { key: 'a9851240d7f5b9c61416b6452eabc9d1', height: 300, width: 160 },
]

export function AdUnit() {
  useEffect(() => {
    if (!document.querySelector('script[src*="effectivecpmnetwork.com/dbc7e0342"]')) {
      const s = document.createElement('script')
      s.src = 'https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js'
      s.async = true
      s.setAttribute('data-cfasync', 'false')
      document.body.appendChild(s)
    }

    bannerAds.forEach(ad => {
      if (document.querySelector(`script[src*="highperformanceformat.com/${ad.key}"]`)) return
      const config = document.createElement('script')
      config.textContent = `window.atOptions=${JSON.stringify({ key: ad.key, format: 'iframe', height: ad.height, width: ad.width, params: {} })};`
      document.body.appendChild(config)
      const invoke = document.createElement('script')
      invoke.src = `https://www.highperformanceformat.com/${ad.key}/invoke.js`
      invoke.async = false
      document.body.appendChild(invoke)
    })
  }, [])

  return (
    <>
      <div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6" />
      {bannerAds.map(ad => <div key={ad.key} id={`container-${ad.key}`} />)}
    </>
  )
}
