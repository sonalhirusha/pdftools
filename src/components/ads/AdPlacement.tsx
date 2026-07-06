'use client'

import { useEffect, useState } from 'react'

interface AdPlacementProps {
  location: string
  className?: string
}

export function AdPlacement({ location, className = '' }: AdPlacementProps) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/ads?location=${location}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code) setHtml(data.code)
      })
      .catch(() => {})
  }, [location])

  if (!html) return null

  return (
    <div className={`ad-container ${className}`} data-ad-location={location}>
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </div>
  )
}

export function AdTopBanner() {
  return <AdPlacement location="top-banner" className="w-full min-h-[90px] bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center" />
}

export function AdSidebar() {
  return <AdPlacement location="sidebar" className="w-full min-h-[250px] bg-gray-50 dark:bg-gray-900 rounded-lg" />
}

export function AdInContent() {
  return <AdPlacement location="in-content" className="w-full min-h-[90px] bg-gray-50 dark:bg-gray-900 rounded-lg my-6" />
}

export function AdStickyFooter() {
  return <AdPlacement location="sticky-footer" className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t p-2" />
}

export function AdPopup() {
  return <AdPlacement location="popup" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" />
}
