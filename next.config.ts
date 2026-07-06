import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*.googleusercontent.com https://www.google-analytics.com https://*.clarity.ms; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.google-analytics.com https://*.clarity.ms; frame-src 'self' https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: '/sitemap' },
      { source: '/rss.xml', destination: '/api/rss' },
      { source: '/robots.txt', destination: '/api/robots' },
    ]
  },
}

export default nextConfig
