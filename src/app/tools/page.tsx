import Link from 'next/link'
import { FileTextIcon, ArrowRight } from 'lucide-react'
import { tools } from '@/lib/tools'
import type { Metadata } from 'next'
import { AdTopBanner, AdBottomBanner } from '@/components/ads/AdPlacement'

export const metadata: Metadata = {
  title: 'All PDF Tools',
  description: 'Browse our complete collection of free online PDF tools. Merge, split, compress, convert and edit PDFs.',
}

const categoryLabels: Record<string, { title: string; description: string }> = {
  basic: { title: 'Basic PDF Tools', description: 'Essential tools for everyday PDF management' },
  convert: { title: 'Convert PDF', description: 'Convert PDFs to and from various formats' },
  edit: { title: 'Edit PDF', description: 'Edit and customize your PDF documents' },
  security: { title: 'Security', description: 'Protect and secure your PDF files' },
}

export default function ToolsPage() {
  const categories = ['basic', 'convert', 'edit', 'security'] as const

  return (
    <div className="container-page">
      <AdTopBanner />
      <div className="text-center mb-12">
        <h1 className="section-title">All PDF Tools</h1>
        <p className="section-subtitle mx-auto">Choose from 30+ free online PDF tools</p>
      </div>
      {categories.map((category) => (
        <section key={category} className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{categoryLabels[category].title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{categoryLabels[category].description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.filter((t) => t.category === category).map((tool) => (
              <Link key={tool.id} href={tool.href} className="card-hover group flex items-start gap-4">
                <div className={`inline-flex rounded-lg bg-gradient-to-br ${tool.color} p-3 text-white shrink-0`}>
                  <FileTextIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold group-hover:text-primary-600 transition-colors">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{tool.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary-600 mt-1.5 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      ))}
      <AdBottomBanner />
    </div>
  )
}
