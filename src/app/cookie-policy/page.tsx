import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'PDFTools Cookie Policy - how we use cookies.',
}

export default function CookiePolicyPage() {
  return (
    <div className="container-page max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h2>What Are Cookies</h2>
        <p>Cookies are small text files stored on your device when you visit a website.</p>
        <h2>How We Use Cookies</h2>
        <ul>
          <li><strong>Essential cookies:</strong> Required for authentication and basic functionality</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site</li>
          <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
        </ul>
        <h2>Managing Cookies</h2>
        <p>You can control cookies through your browser settings.</p>
        <h2>Contact</h2>
        <p>For questions about our cookie policy, contact us at privacy@pdftools.com.</p>
      </div>
    </div>
  )
}
