import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DMCA',
  description: 'PDFTools DMCA policy for copyright claims.',
}

export default function DMCAPage() {
  return (
    <div className="container-page max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">DMCA Notice</h1>
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <p>If you believe your copyrighted work has been used in a way that constitutes infringement, please submit a notification to dmca@pdftools.com.</p>
        <h2>Notification Requirements</h2>
        <ul>
          <li>Identification of the copyrighted work claimed to be infringed</li>
          <li>Identification of the infringing material and its location</li>
          <li>Your contact information</li>
          <li>A statement of good faith belief that the use is not authorized</li>
          <li>Your physical or electronic signature</li>
        </ul>
        <p>We will respond to all valid DMCA notices and take appropriate action.</p>
      </div>
    </div>
  )
}
