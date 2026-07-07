import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { Analytics } from '@/components/layout/Analytics'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'PDFTools - Free Online PDF Tools', template: '%s | PDFTools' },
  description: 'Free online PDF tools to merge, split, compress, convert and edit PDF files. No installation required. Secure, fast, and 100% free.',
  keywords: 'PDF tools, merge PDF, split PDF, compress PDF, PDF converter, free PDF tools, online PDF editor',
  authors: [{ name: 'PDFTools' }],
  creator: 'PDFTools',
  publisher: 'PDFTools',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pdftools.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'PDFTools',
    title: 'PDFTools - Free Online PDF Tools',
    description: 'Free online PDF tools to merge, split, compress, convert and edit PDF files.',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFTools - Free Online PDF Tools',
    description: 'Free online PDF tools to merge, split, compress, convert and edit PDF files.',
    images: ['/images/og-image.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/icons/favicon.ico', shortcut: '/icons/favicon-16x16.png', apple: '/icons/apple-touch-icon.png' },
  manifest: '/manifest.json',
  other: { 'google-site-verification': 'wZb24k9TWrlGFtDUq0DQUSJ1m7h3IFRgGjx02Su_IRs' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark';
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
          <Analytics />
          <div id="container-dbc7e0342c21f0bd0baa4df5c5df10f6" />
          <Script src="https://pl30241180.effectivecpmnetwork.com/be/b6/c1/beb6c10bacd295422228e7015129b14e.js" strategy="afterInteractive" />
          <Script src="https://pl30241182.effectivecpmnetwork.com/dc/6d/ca/dc6dca26e73c51823850fab290f2b0c1.js" strategy="afterInteractive" />
          <Script src="https://www.effectivecpmnetwork.com/iubme16h3v?key=a190b566f3e6a174dff077c12f5d3e57" strategy="afterInteractive" />
          <Script src="https://pl30241181.effectivecpmnetwork.com/dbc7e0342c21f0bd0baa4df5c5df10f6/invoke.js" strategy="afterInteractive" />
          <div style={{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center'}}>
            <iframe srcDoc={`<script>window.atOptions={key:'323ecd135b38a26a6d45afd0e33ff4f8',format:'iframe',height:60,width:468,params:{}};</script><script src="https://www.highperformanceformat.com/323ecd135b38a26a6d45afd0e33ff4f8/invoke.js"></script>`} style={{border:0,width:468,height:60,overflow:'hidden'}} title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" />
            <iframe srcDoc={`<script>window.atOptions={key:'4a0047c92dec61603ab2d2cc9c33421b',format:'iframe',height:50,width:320,params:{}};</script><script src="https://www.highperformanceformat.com/4a0047c92dec61603ab2d2cc9c33421b/invoke.js"></script>`} style={{border:0,width:320,height:50,overflow:'hidden'}} title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" />
            <iframe srcDoc={`<script>window.atOptions={key:'a9851240d7f5b9c61416b6452eabc9d1',format:'iframe',height:300,width:160,params:{}};</script><script src="https://www.highperformanceformat.com/a9851240d7f5b9c61416b6452eabc9d1/invoke.js"></script>`} style={{border:0,width:160,height:300,overflow:'hidden'}} title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" />
            <iframe srcDoc={`<script>window.atOptions={key:'2afff5e2d6cd5dc646c169f6d942ff87',format:'iframe',height:250,width:300,params:{}};</script><script src="https://www.highperformanceformat.com/2afff5e2d6cd5dc646c169f6d942ff87/invoke.js"></script>`} style={{border:0,width:300,height:250,overflow:'hidden'}} title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" />
            <iframe srcDoc={`<script>window.atOptions={key:'cc98ea3de58bc46ff0b5f582f1b5706a',format:'iframe',height:600,width:160,params:{}};</script><script src="https://www.highperformanceformat.com/cc98ea3de58bc46ff0b5f582f1b5706a/invoke.js"></script>`} style={{border:0,width:160,height:600,overflow:'hidden'}} title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" />
            <iframe srcDoc={`<script>window.atOptions={key:'38efece2bd53e3d63c28cff47b182d40',format:'iframe',height:90,width:728,params:{}};</script><script src="https://www.highperformanceformat.com/38efece2bd53e3d63c28cff47b182d40/invoke.js"></script>`} style={{border:0,width:728,height:90,overflow:'hidden'}} title="ad" scrolling="no" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups" />
          </div>
        </Providers>
      </body>
    </html>
  )
}
