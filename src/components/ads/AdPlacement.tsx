'use client'

const AD_CODES: Record<string, string> = {
  'top-banner': `<iframe srcDoc='<script>window.atOptions={key:"38efece2bd53e3d63c28cff47b182d40",format:"iframe",height:90,width:728,params:{}};</script><script src="https://www.highperformanceformat.com/38efece2bd53e3d63c28cff47b182d40/invoke.js"></script>' style="border:none;width:728px;height:90px;overflow:hidden;max-width:100%" title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`,

  'in-content': `<iframe srcDoc='<script>window.atOptions={key:"2afff5e2d6cd5dc646c169f6d942ff87",format:"iframe",height:250,width:300,params:{}};</script><script src="https://www.highperformanceformat.com/2afff5e2d6cd5dc646c169f6d942ff87/invoke.js"></script>' style="border:none;width:300px;height:250px;overflow:hidden;max-width:100%" title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`,

  'sidebar': `<iframe srcDoc='<script>window.atOptions={key:"cc98ea3de58bc46ff0b5f582f1b5706a",format:"iframe",height:600,width:160,params:{}};</script><script src="https://www.highperformanceformat.com/cc98ea3de58bc46ff0b5f582f1b5706a/invoke.js"></script>' style="border:none;width:160px;height:600px;overflow:hidden" title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`,

  'sticky-footer': `<iframe srcDoc='<script>window.atOptions={key:"323ecd135b38a26a6d45afd0e33ff4f8",format:"iframe",height:60,width:468,params:{}};</script><script src="https://www.highperformanceformat.com/323ecd135b38a26a6d45afd0e33ff4f8/invoke.js"></script>' style="border:none;width:468px;height:60px;overflow:hidden;max-width:100%" title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`,

  'bottom-banner': `<iframe srcDoc='<script>window.atOptions={key:"4a0047c92dec61603ab2d2cc9c33421b",format:"iframe",height:50,width:320,params:{}};</script><script src="https://www.highperformanceformat.com/4a0047c92dec61603ab2d2cc9c33421b/invoke.js"></script>' style="border:none;width:320px;height:50px;overflow:hidden;max-width:100%" title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`,
}

interface AdPlacementProps {
  location: string
  className?: string
}

export function AdPlacement({ location, className = '' }: AdPlacementProps) {
  const html = AD_CODES[location]
  if (!html) return null

  return (
    <div className={`ad-container flex justify-center ${className}`} data-ad-location={location}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export function AdTopBanner() {
  return <AdPlacement location="top-banner" className="w-full min-h-[90px] my-4" />
}

export function AdSidebar() {
  return <AdPlacement location="sidebar" className="w-full min-h-[250px]" />
}

export function AdInContent() {
  return <AdPlacement location="in-content" className="w-full min-h-[90px] my-6" />
}

export function AdBottomBanner() {
  return <AdPlacement location="bottom-banner" className="w-full my-8" />
}

export function AdStickyFooter() {
  return <AdPlacement location="sticky-footer" className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t p-2 flex justify-center" />
}
