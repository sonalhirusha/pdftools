'use client'

function AdIframe({ srcdoc, style }: { srcdoc: string; style: React.CSSProperties }) {
  return (
    <iframe
      srcDoc={srcdoc}
      style={style}
      title="ad"
      scrolling="no"
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  )
}

function TopBannerAd() {
  return (
    <AdIframe
      srcdoc={`<script>window.atOptions={key:"38efece2bd53e3d63c28cff47b182d40",format:"iframe",height:90,width:728,params:{}};</script><script src="https://www.highperformanceformat.com/38efece2bd53e3d63c28cff47b182d40/invoke.js"></script>`}
      style={{ border: 'none', width: 728, height: 90, overflow: 'hidden', maxWidth: '100%' }}
    />
  )
}

function InContentAd() {
  return (
    <AdIframe
      srcdoc={`<script>window.atOptions={key:"2afff5e2d6cd5dc646c169f6d942ff87",format:"iframe",height:250,width:300,params:{}};</script><script src="https://www.highperformanceformat.com/2afff5e2d6cd5dc646c169f6d942ff87/invoke.js"></script>`}
      style={{ border: 'none', width: 300, height: 250, overflow: 'hidden', maxWidth: '100%' }}
    />
  )
}

function BottomBannerAd() {
  return (
    <AdIframe
      srcdoc={`<script>window.atOptions={key:"4a0047c92dec61603ab2d2cc9c33421b",format:"iframe",height:50,width:320,params:{}};</script><script src="https://www.highperformanceformat.com/4a0047c92dec61603ab2d2cc9c33421b/invoke.js"></script>`}
      style={{ border: 'none', width: 320, height: 50, overflow: 'hidden', maxWidth: '100%' }}
    />
  )
}

function StickyFooterAd() {
  return (
    <AdIframe
      srcdoc={`<script>window.atOptions={key:"323ecd135b38a26a6d45afd0e33ff4f8",format:"iframe",height:60,width:468,params:{}};</script><script src="https://www.highperformanceformat.com/323ecd135b38a26a6d45afd0e33ff4f8/invoke.js"></script>`}
      style={{ border: 'none', width: 468, height: 60, overflow: 'hidden', maxWidth: '100%' }}
    />
  )
}

function SidebarAd() {
  return (
    <AdIframe
      srcdoc={`<script>window.atOptions={key:"cc98ea3de58bc46ff0b5f582f1b5706a",format:"iframe",height:600,width:160,params:{}};</script><script src="https://www.highperformanceformat.com/cc98ea3de58bc46ff0b5f582f1b5706a/invoke.js"></script>`}
      style={{ border: 'none', width: 160, height: 600, overflow: 'hidden' }}
    />
  )
}

export function AdTopBanner() {
  return <div className="flex justify-center w-full my-4"><TopBannerAd /></div>
}

export function AdInContent() {
  return <div className="flex justify-center w-full my-6"><InContentAd /></div>
}

export function AdBottomBanner() {
  return <div className="flex justify-center w-full my-8"><BottomBannerAd /></div>
}

export function AdStickyFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t p-2 flex justify-center">
      <StickyFooterAd />
    </div>
  )
}

export function AdSidebar() {
  return <div className="flex justify-center w-full"><SidebarAd /></div>
}
