import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'PDFTools disclaimer about the use of our PDF tools.',
}

export default function DisclaimerPage() {
  return (
    <div className="container-page max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <p>PDFTools is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do not guarantee that our tools will be error-free, uninterrupted, or secure at all times.</p>
        <p>Users are responsible for ensuring that their use of PDFTools complies with applicable laws and regulations.</p>
      </div>
    </div>
  )
}
