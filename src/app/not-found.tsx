import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FileTextIcon, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <FileTextIcon className="h-20 w-20 text-primary-600 mx-auto opacity-50" />
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-gray-500 max-w-sm mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/"><Button><Home className="h-4 w-4" /> Go home</Button></Link>
      </div>
    </div>
  )
}
