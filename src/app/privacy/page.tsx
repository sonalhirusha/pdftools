import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'PDFTools Privacy Policy - how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide when creating an account, such as your name and email address. When you upload files, they are processed temporarily and automatically deleted after 24 hours.</p>
        <h2>How We Use Your Information</h2>
        <p>We use your information to provide and improve our PDF tools, communicate with you, and ensure the security of our platform. We do not sell your personal data to third parties.</p>
        <h2>File Storage</h2>
        <p>Uploaded files are stored securely and automatically deleted after 24 hours. You can manually delete files at any time.</p>
        <h2>Cookies</h2>
        <p>We use essential cookies for authentication and functionality. Analytics cookies help us improve our service.</p>
        <h2>Data Security</h2>
        <p>We implement industry-standard security measures including encryption in transit and at rest.</p>
        <h2>Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@pdftools.com.</p>
      </div>
    </div>
  )
}
