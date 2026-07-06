import Link from 'next/link'
import { ArrowRight, FileTextIcon, ShieldIcon, ZapIcon, GlobeIcon, ClockIcon, UsersIcon, StarIcon, CheckCircle2Icon, MergeIcon, SplitIcon, FileDownIcon, FileImageIcon, LockIcon, PenIcon, SparklesIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { tools, getPopularTools } from '@/lib/tools'

const stats = [
  { value: '50K+', label: 'Files Processed Daily' },
  { value: '99.9%', label: 'Uptime' },
  { value: '1M+', label: 'Happy Users' },
  { value: '30+', label: 'PDF Tools' },
]

const features = [
  { icon: ZapIcon, title: 'Fast Processing', description: 'Process your PDFs in seconds with our optimized engine.' },
  { icon: ShieldIcon, title: 'Secure & Private', description: 'Files are encrypted and automatically deleted after 24 hours.' },
  { icon: GlobeIcon, title: 'Works Anywhere', description: 'No installation needed. Works in your browser on any device.' },
  { icon: ClockIcon, title: 'Save Time', description: 'No sign-ups required. Start using tools immediately.' },
  { icon: FileTextIcon, title: 'High Quality', description: 'Maintains original quality with no resolution loss.' },
  { icon: UsersIcon, title: 'Free Forever', description: 'All basic tools are free with no hidden costs.' },
]

const steps = [
  { number: '01', title: 'Upload Your File', description: 'Drag and drop or select your PDF file from your device.' },
  { number: '02', title: 'Choose Your Tool', description: 'Select from 30+ tools to edit, convert, or secure your PDF.' },
  { number: '03', title: 'Process & Download', description: 'Click process and download your converted file instantly.' },
]

const testimonials = [
  { name: 'Sarah Johnson', role: 'Marketing Manager', content: 'This is my go-to tool for all PDF needs. Fast, reliable, and completely free!', rating: 5 },
  { name: 'David Chen', role: 'Software Engineer', content: 'The merge and split tools are incredibly useful. Saves me hours every week.', rating: 5 },
  { name: 'Emily Rodriguez', role: 'Student', content: 'Perfect for converting my research papers. The quality is always excellent.', rating: 5 },
]

const popularTools = getPopularTools()

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-950 dark:via-gray-950 dark:to-primary-950" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center rounded-full border bg-white px-4 py-1.5 mb-6 text-sm dark:bg-gray-900 dark:border-gray-700">
              <span className="text-primary-600 font-semibold">30+ Free PDF Tools</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-500">No sign-up required</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              All Your PDF Tools in{' '}
              <span className="gradient-text">One Place</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Merge, split, compress, convert, and edit PDFs online for free. 
              Fast, secure, and works right in your browser.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tools"><Button size="lg" className="text-base px-8 py-4">Get Started Free <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/tools/merge"><Button variant="secondary" size="lg" className="text-base px-8 py-4">Try Merge PDF</Button></Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="card-hover">
                <div className="text-2xl font-bold gradient-text sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Popular PDF Tools</h2>
            <p className="section-subtitle mx-auto">Most used tools by our community</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {popularTools.slice(0, 6).map((tool) => {
              const Icon = { Merge: MergeIcon, Split: SplitIcon, Compress: FileDownIcon, Lock: LockIcon, FileImage: FileImageIcon, Pen: PenIcon, Sparkles: SparklesIcon }[tool.icon as keyof typeof icons] || FileTextIcon
              return (
                <Link key={tool.id} href={tool.href} className="card-hover group">
                  <div className={`inline-flex rounded-lg bg-gradient-to-br ${tool.color} p-3 text-white mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary-600 transition-colors">{tool.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{tool.description}</p>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/tools"><Button variant="secondary">View All Tools <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose PDFTools?</h2>
            <p className="section-subtitle mx-auto">Everything you need to manage your PDFs effectively</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="card-hover">
                  <div className="inline-flex rounded-lg bg-primary-50 p-3 text-primary-600 mb-4 dark:bg-primary-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle mx-auto">Three simple steps to work with your PDFs</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 text-primary-600 text-xl font-bold mb-4 dark:bg-primary-950">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle mx-auto">Trusted by thousands of users worldwide</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">&ldquo;{t.content}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Is PDFTools really free?', a: 'Yes! All basic PDF tools are completely free with no hidden charges.' },
              { q: 'Are my files secure?', a: 'Absolutely. Files are encrypted in transit and automatically deleted after 24 hours.' },
              { q: 'Do I need to create an account?', a: 'No account needed for basic tools. An account gives you access to history and larger file sizes.' },
              { q: 'What is the maximum file size?', a: 'You can upload files up to 500MB. Premium users get higher limits.' },
              { q: 'Which file formats are supported?', a: 'We support PDF, DOCX, DOC, PPTX, PPT, XLSX, XLS, JPG, PNG, and WEBP.' },
            ].map((faq) => (
              <details key={faq.q} className="card group cursor-pointer">
                <summary className="flex items-center justify-between font-medium text-sm">
                  {faq.q}
                  <span className="transition-transform group-open:rotate-180 text-gray-400">▼</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Stay Updated</h2>
          <p className="mt-4 text-primary-100">Get the latest PDF tips, tutorials, and updates delivered to your inbox.</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/api/newsletter" method="POST">
            <input type="email" name="email" placeholder="Enter your email" required className="flex-1 rounded-lg px-4 py-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50" />
            <button type="submit" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  )
}

const icons: Record<string, React.ElementType> = { Merge: MergeIcon, Split: SplitIcon, Compress: FileDownIcon, Lock: LockIcon, FileImage: FileImageIcon, Pen: PenIcon }
