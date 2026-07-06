import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'PDFTools Terms of Service - the terms governing your use of our PDF tools.',
}

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h2>Acceptance of Terms</h2>
        <p>By using PDFTools, you agree to these terms. If you do not agree, please do not use our services.</p>
        <h2>Use of Service</h2>
        <p>You agree to use our tools for lawful purposes only. You may not upload malicious files or attempt to bypass security measures.</p>
        <h2>User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
        <h2>Intellectual Property</h2>
        <p>You retain all rights to your uploaded files. We do not claim ownership of any content you process.</p>
        <h2>Limitation of Liability</h2>
        <p>PDFTools is provided &ldquo;as is&rdquo; without warranties.</p>
        <h2>Contact</h2>
        <p>For questions about these terms, contact us at legal@pdftools.com.</p>
      </div>
    </div>
  )
}
