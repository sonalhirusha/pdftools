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

  return <ToolPageClient tool={tool} />
}
