'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    atOptions?: Record<string, unknown>
  }
}

const bannerAds = [
  { key: '323ecd135b38a26a6d45afd0e33ff4f8', height: 60, width: 468 },
  { key: '4a0047c92dec61603ab2d2cc9c33421b', height: 50, width: 320 },
  { key: 'a9851240d7f5b9c61416b6452eabc9d1', height: 300, width: 160 },
]

function loadAd(containerId: string, src: string, attrs?: Record<string, string>) {
  return new Promise<void>(resolve => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) { resolve(); return }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    if (attrs) Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v))
    script.onload = () => resolve()
    script.onerror = () => resolve()
    document.getElementById(containerId)?.appendChild(script)
  })
}

function loadHighPerformanceAd(containerId: string, key: string, height: number, width: number) {
  return new Promise<void>(resolve => {
    const existing = document.querySelector(`script[src*="${key}/invoke.js"]`)
    if (existing) { resolve(); return }
    const container = document.getElementById(containerId)
    if (!container) { resolve(); return }
    const buf: string[] = []
    const ow = document.write
    const owln = document.writeln
    document.write = (s: string) => buf.push(s)
    document.writeln = (s: string) => buf.push(s + '\n')
    window.atOptions = { key, format: 'iframe', height, width, params: {} }
    const s = document.createElement('script')
    s.src = `https://www.highperformanceformat.com/${key}/invoke.js`
    s.onload = () => {
      document.write = ow
      document.writeln = owln
      container.innerHTML = buf.join('')
      resolve()
    }
    s.onerror = () => { document.write = ow; document.writeln = owln; resolve() }
    document.body.appendChild(s)
  })
}

export function AdUnit() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    loadAd('container-dbc7e0342c21f0bd0baa4df5c5df10f6',
      'https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js',
      { 'data-cfasync': 'false' })

    bannerAds.forEach(ad =>
      loadHighPerformanceAd(`container-${ad.key}`, ad.key, ad.height, ad.width))
  }, [])

  return (
    <>
      <div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6" />
      {bannerAds.map(ad => <div key={ad.key} id={`container-${ad.key}`} />)}
    </>
  )
}
