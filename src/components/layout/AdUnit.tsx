'use client'

import { useEffect } from 'react'

export function AdUnit() {
  useEffect(() => {
    const scripts = [
      'https://pl30241180.effectivecpmnetwork.com/be/b6/c1/beb6c10bacd295422228e7015129b14e.js',
      'https://pl30241182.effectivecpmnetwork.com/dc/6d/ca/dc6dca26e73c51823850fab290f2b0c1.js',
      'https://www.effectivecpmnetwork.com/iubme16h3v?key=a190b566f3e6a174dff077c12f5d3e57',
      'https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js',
    ]
    scripts.forEach(src => {
      const key = src.includes('?') ? src.split('?')[0] : src
      if (!document.querySelector(`script[src*="${key}"]`)) {
        const s = document.createElement('script')
        s.src = src
        s.async = true
        document.body.appendChild(s)
      }
    })
  }, [])

  return (
    <>
      <div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6" />
      <iframe
        srcDoc={`<script>window.atOptions={key:'323ecd135b38a26a6d45afd0e33ff4f8',format:'iframe',height:60,width:468,params:{}};</script><script src="https://www.highperformanceformat.com/323ecd135b38a26a6d45afd0e33ff4f8/invoke.js"></script>`}
        style={{ border: 0, width: 468, height: 60, maxWidth: '100%', overflow: 'hidden' }}
        title="ad" scrolling="no" loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <iframe
        srcDoc={`<script>window.atOptions={key:'4a0047c92dec61603ab2d2cc9c33421b',format:'iframe',height:50,width:320,params:{}};</script><script src="https://www.highperformanceformat.com/4a0047c92dec61603ab2d2cc9c33421b/invoke.js"></script>`}
        style={{ border: 0, width: 320, height: 50, maxWidth: '100%', overflow: 'hidden' }}
        title="ad" scrolling="no" loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <iframe
        srcDoc={`<script>window.atOptions={key:'a9851240d7f5b9c61416b6452eabc9d1',format:'iframe',height:300,width:160,params:{}};</script><script src="https://www.highperformanceformat.com/a9851240d7f5b9c61416b6452eabc9d1/invoke.js"></script>`}
        style={{ border: 0, width: 160, height: 300, maxWidth: '100%', overflow: 'hidden' }}
        title="ad" scrolling="no" loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </>
  )
}
