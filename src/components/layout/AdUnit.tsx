'use client'

import { useEffect } from 'react'

const bannerAds = [
  { key: '323ecd135b38a26a6d45afd0e33ff4f8', height: 60, width: 468 },
  { key: '4a0047c92dec61603ab2d2cc9c33421b', height: 50, width: 320 },
  { key: 'a9851240d7f5b9c61416b6452eabc9d1', height: 300, width: 160 },
]

function adIframe(html: string, height: number) {
  return (
    <iframe
      srcDoc={html}
      style={{ border: 0, width: '100%', height, maxWidth: '100%', overflow: 'hidden' }}
      title="ad"
      scrolling="no"
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  )
}

export function AdUnit() {
  useEffect(() => {
    const adScripts = [
      'https://pl30241180.effectivecpmnetwork.com/be/b6/c1/beb6c10bacd295422228e7015129b14e.js',
      'https://pl30241182.effectivecpmnetwork.com/dc/6d/ca/dc6dca26e73c51823850fab290f2b0c1.js',
      'https://www.effectivecpmnetwork.com/iubme16h3v?key=a190b566f3e6a174dff077c12f5d3e57',
      'https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js',
    ]
    adScripts.forEach(src => {
      if (document.querySelector(`script[src="${src}"]`)) return
      const s = document.createElement('script')
      s.src = src
      s.async = true
      document.body.appendChild(s)
    })
  }, [])

  return (
    <>
      <div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6" />
      {bannerAds.map(ad => adIframe(`
<script>window.atOptions={key:'${ad.key}',format:'iframe',height:${ad.height},width:${ad.width},params:{}};</script>
<script src="https://www.highperformanceformat.com/${ad.key}/invoke.js"></script>
      `.trim(), ad.height + 20))}
    </>
  )
}
