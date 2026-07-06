import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { FileTextIcon, ShieldIcon, ZapIcon, GlobeIcon, UsersIcon, AwardIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about PDFTools - our mission, team, and commitment to providing free online PDF tools.',
}

const values = [
  { icon: ShieldIcon, title: 'Privacy First', description: 'We never share your files. Everything is encrypted and auto-deleted.' },
  { icon: ZapIcon, title: 'Fast & Efficient', description: 'Optimized processing ensures your files are handled in seconds.' },
  { icon: GlobeIcon, title: 'Accessible to All', description: 'Free tools for everyone, anywhere, on any device.' },
  { icon: UsersIcon, title: 'User Focused', description: 'Built based on user feedback and real-world needs.' },
  { icon: AwardIcon, title: 'High Quality', description: 'Professional-grade output with no quality loss.' },
]

export default function AboutPage() {
  return (
    <div className="container-page">
      <div className="text-center mb-12">
        <h1 className="section-title">About PDFTools</h1>
        <p className="section-subtitle mx-auto">We believe everyone should have access to powerful PDF tools without paying a fortune.</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400">PDFTools was created to provide a simple, fast, and secure way for anyone to work with PDF files. We believe that powerful document tools should be accessible to everyone, regardless of budget or technical expertise.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Why We&apos;re Different</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Unlike other PDF tools that hide features behind paywalls, we provide 30+ tools completely free. Your privacy is our priority — files are encrypted and automatically deleted after 24 hours.</p>
          <Link href="/tools"><Button>Explore Our Tools</Button></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => {
            const Icon = v.icon
            return (
              <div key={v.title} className="card-hover">
                <Icon className="h-6 w-6 text-primary-600 mb-3" />
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
