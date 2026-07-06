import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { WifiOffIcon } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <WifiOffIcon className="h-20 w-20 text-gray-400 mx-auto" />
        <h1 className="text-3xl font-bold">You&apos;re offline</h1>
        <p className="text-gray-500">Please check your connection and try again.</p>
        <Link href="/"><Button>Go home</Button></Link>
      </div>
    </div>
  )
}
