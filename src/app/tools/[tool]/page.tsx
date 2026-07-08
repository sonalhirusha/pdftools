import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getToolById } from '@/lib/tools'
import { ToolPageClient } from './ToolPageClient'
import { generateMetaTitle, generateMetaDescription, generateCanonicalUrl } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool: toolId } = await params
  const tool = getToolById(toolId)
  if (!tool) return { title: 'Tool Not Found' }
  return {
    title: generateMetaTitle(tool.name),
    description: generateMetaDescription(tool.description),
    alternates: { canonical: generateCanonicalUrl(`/tools/${tool.id}`) },
    openGraph: {
      title: `${tool.name} - Free Online PDF Tool`,
      description: tool.description,
    },
  }
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: toolId } = await params
  const tool = getToolById(toolId)
  if (!tool) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pdftools.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    url: `${baseUrl}/tools/${tool.id}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    description: tool.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'PDF Tools', item: `${baseUrl}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.name },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }} />
      <nav className="container-page py-3 text-xs text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-primary-600">Home</a></li>
          <li>/</li>
          <li><a href="/tools" className="hover:text-primary-600">PDF Tools</a></li>
          <li>/</li>
          <li className="text-gray-800 dark:text-gray-200 font-medium" aria-current="page">{tool.name}</li>
        </ol>
      </nav>
      <ToolPageClient tool={tool} />
    </>
  )
}
