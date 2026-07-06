import Link from 'next/link'
import { FileTextIcon, Mail, GlobeIcon, MessageCircleIcon } from 'lucide-react'

const footerLinks = {
  tools: { title: 'Tools', links: [{ name: 'Merge PDF', href: '/tools/merge' }, { name: 'Split PDF', href: '/tools/split' }, { name: 'Compress PDF', href: '/tools/compress' }, { name: 'PDF to Word', href: '/tools/pdf-to-word' }, { name: 'JPG to PDF', href: '/tools/jpg-to-pdf' }, { name: 'All Tools', href: '/tools' }] },
  company: { title: 'Company', links: [{ name: 'About', href: '/about' }, { name: 'Blog', href: '/blog' }, { name: 'Contact', href: '/contact' }, { name: 'Privacy', href: '/privacy' }, { name: 'Terms', href: '/terms' }] },
  support: { title: 'Support', links: [{ name: 'FAQ', href: '/faq' }, { name: 'Cookie Policy', href: '/cookie-policy' }, { name: 'DMCA', href: '/dmca' }, { name: 'Disclaimer', href: '/disclaimer' }, { name: 'Pricing', href: '/pricing' }] },
}

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4"><FileTextIcon className="h-6 w-6 text-primary-600" /><span className="gradient-text">PDFTools</span></Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">Free online PDF tools to merge, split, compress, convert and edit your PDF documents securely.</p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn-ghost p-2" aria-label="Twitter"><MessageCircleIcon className="h-4 w-4" /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-ghost p-2" aria-label="GitHub"><GlobeIcon className="h-4 w-4" /></a>
              <a href="mailto:hello@pdftools.com" className="btn-ghost p-2" aria-label="Email"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}><Link href={link.href} className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} PDFTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
