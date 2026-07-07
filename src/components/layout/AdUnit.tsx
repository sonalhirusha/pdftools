'use client'

import { useEffect, useRef } from 'react'

const adHTML = `
<script src="https://pl30241180.effectivecpmnetwork.com/be/b6/c1/beb6c10bacd295422228e7015129b14e.js"></script>
<script async data-cfasync="false" src="https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js"></script>
<div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6"></div>
<script src="https://pl30241182.effectivecpmnetwork.com/dc/6d/ca/dc6dca26e73c51823850fab290f2b0c1.js"></script>
<script src="https://www.effectivecpmnetwork.com/iubme16h3v?key=a190b566f3e6a174dff077c12f5d3e57"></script>

<script>window.atOptions={key:'323ecd135b38a26a6d45afd0e33ff4f8',format:'iframe',height:60,width:468,params:{}};</script>
<script src="https://www.highperformanceformat.com/323ecd135b38a26a6d45afd0e33ff4f8/invoke.js"></script>
<div id="container-323ecd135b38a26a6d45afd0e33ff4f8"></div>

<script>window.atOptions={key:'4a0047c92dec61603ab2d2cc9c33421b',format:'iframe',height:50,width:320,params:{}};</script>
<script src="https://www.highperformanceformat.com/4a0047c92dec61603ab2d2cc9c33421b/invoke.js"></script>
<div id="container-4a0047c92dec61603ab2d2cc9c33421b"></div>

<script>window.atOptions={key:'a9851240d7f5b9c61416b6452eabc9d1',format:'iframe',height:300,width:160,params:{}};</script>
<script src="https://www.highperformanceformat.com/a9851240d7f5b9c61416b6452eabc9d1/invoke.js"></script>
<div id="container-a9851240d7f5b9c61416b6452eabc9d1"></div>
`

export function AdUnit() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = adHTML
    ref.current.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script')
      if (old.src) {
        s.src = old.src
        s.async = old.async
        if (old.dataset.cfasync) s.setAttribute('data-cfasync', old.dataset.cfasync)
      } else {
        s.textContent = old.textContent || ''
      }
      old.parentNode?.replaceChild(s, old)
    })
  }, [])

  return <div ref={ref} style={{ display: 'contents' }} />
}
