'use client'

import { Button } from '@/components/ui/Button'
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <AlertTriangleIcon className="h-20 w-20 text-red-500 mx-auto opacity-50" />
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-gray-500 max-w-sm mx-auto">An unexpected error occurred. Please try again.</p>
        <Button onClick={reset}><RefreshCwIcon className="h-4 w-4" /> Try again</Button>
      </div>
    </div>
  )
}
