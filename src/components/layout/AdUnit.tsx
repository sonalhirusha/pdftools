'use client'

import { useEffect, useRef } from 'react'

const headAdHTML = `
<script src="https://pl30241180.effectivecpmnetwork.com/be/b6/c1/beb6c10bacd295422228e7015129b14e.js"></script>
<script async data-cfasync="false" src="https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js"></script>
<div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6"></div>
<script src="https://pl30241182.effectivecpmnetwork.com/dc/6d/ca/dc6dca26e73c51823850fab290f2b0c1.js"></script>
<script src="https://www.effectivecpmnetwork.com/iubme16h3v?key=a190b566f3e6a174dff077c12f5d3e57"></script>
`

const bannerIframes = [
  { key: '323ecd135b38a26a6d45afd0e33ff4f8', w: 468, h: 60 },
  { key: '4a0047c92dec61603ab2d2cc9c33421b', w: 320, h: 50 },
  { key: 'a9851240d7f5b9c61416b6452eabc9d1', w: 160, h: 300 },
]

export function AdUnit() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = headAdHTML
    ref.current.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script')
      if (old.src) {
        s.src = old.src
        s.async = true
        s.setAttribute('data-cfasync', 'false')
      } else {
        s.textContent = old.textContent || ''
      }
      old.parentNode?.replaceChild(s, old)
    })
  }, [])

  return (
    <div ref={ref} style={{ display: 'contents' }}>
      {bannerIframes.map(a => (
        <iframe
          key={a.key}
          srcDoc={`<script>window.atOptions={key:'${a.key}',format:'iframe',height:${a.h},width:${a.w},params:{}};</script><script src="https://www.highperformanceformat.com/${a.key}/invoke.js"></script>`}
          style={{ border: 0, width: a.w, height: a.h, maxWidth: '100%', overflow: 'hidden', display: 'block', margin: '4px auto' }}
          title="ad" scrolling="no" loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      ))}
    </div>
  )
}
