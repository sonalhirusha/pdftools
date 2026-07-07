import { PrismaClient, UserRole } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { hash } from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create admin user
  const adminPassword = await hash('Admin123!', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pdftools.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@pdftools.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  })
  console.log('Created admin user:', adminUser.email)

  // Create demo user
  const userPassword = await hash('User1234!', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@example.com',
      password: userPassword,
      role: UserRole.USER,
      emailVerified: new Date(),
    },
  })
  console.log('Created demo user:', demoUser.email)

  // Create blog categories
  const categories = [
    { name: 'PDF Tips', slug: 'pdf-tips', description: 'Tips and tricks for working with PDFs' },
    { name: 'Productivity', slug: 'productivity', description: 'Boost your productivity with PDF tools' },
    { name: 'Tutorials', slug: 'tutorials', description: 'Step-by-step PDF tutorials' },
    { name: 'News', slug: 'news', description: 'Latest updates and news' },
  ]
  for (const cat of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Created blog categories')

  // Create blog tags
  const tags = ['PDF', 'tutorial', 'tips', 'productivity', 'security', 'conversion', 'editing']
  for (const tag of tags) {
    await prisma.blogTag.upsert({
      where: { slug: tag },
      update: {},
      create: { name: tag.charAt(0).toUpperCase() + tag.slice(1), slug: tag },
    })
  }
  console.log('Created blog tags')

  // Create sample blog post
  const category = await prisma.blogCategory.findUnique({ where: { slug: 'pdf-tips' } })
  const samplePost = await prisma.blogPost.upsert({
    where: { slug: 'how-to-merge-pdf-files-online-free' },
    update: {},
    create: {
      authorId: adminUser.id,
      title: 'How to Merge PDF Files Online Free',
      slug: 'how-to-merge-pdf-files-online-free',
      excerpt: 'Learn how to merge multiple PDF files into one document quickly and easily with our free online PDF merger tool.',
      content: `# How to Merge PDF Files Online Free

Merging multiple PDF files into a single document is a common need for many professionals, students, and everyday users. Whether you're combining reports, consolidating invoices, or creating a single document from multiple sources, our free online PDF merger makes it simple.

## Why Merge PDFs?

- **Organization**: Keep related documents together
- **Sharing**: Send one file instead of many
- **Professionalism**: Present a cohesive document
- **Efficiency**: Save time managing files

## How to Merge PDFs

1. Visit our Merge PDF tool page
2. Upload your PDF files (up to 500MB total)
3. Arrange them in your desired order
4. Click "Merge" to combine them
5. Download your merged PDF instantly

## Features of Our PDF Merger

- **Free to use**: No hidden costs or subscriptions
- **Secure**: Files are encrypted and auto-deleted after 24 hours
- **Fast**: Process your files in seconds
- **No installation**: Works in your browser
- **High quality**: Maintains original quality

## Tips for Best Results

- Ensure all PDFs are in the correct order before merging
- Files with similar page sizes work best
- You can merge up to 20 files at once

Start merging your PDFs today with our free online tool!`,
      featured: true,
      published: true,
      publishedAt: new Date(),
      categoryId: category?.id ?? null,
      readingTime: 3,
    },
  })
  console.log('Created sample blog post:', samplePost.title)

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'PDFTools' },
    { key: 'site_description', value: 'Free online PDF tools - merge, split, compress, convert and edit PDF files' },
    { key: 'footer_text', value: '© 2026 PDFTools. All rights reserved.' },
    { key: 'contact_email', value: 'hello@pdftools.com' },
    { key: 'enable_newsletter', value: true },
    { key: 'maintenance_mode', value: false },
    { key: 'cookie_consent_enabled', value: true },
    { key: 'ga_measurement_id', value: '' },
    { key: 'clarity_id', value: '' },
    { key: 'ads_enabled', value: false },
  ]
  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('Created site settings')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
