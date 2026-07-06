import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, XCircleIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for PDFTools.',
}

const plans = [
  {
    name: 'Free', price: '$0', description: 'For occasional PDF tasks',
    features: [
      { text: 'Up to 10 files per day', included: true },
      { text: 'Max 50MB per file', included: true },
      { text: 'Basic PDF tools', included: true },
      { text: '24-hour auto-delete', included: true },
      { text: 'Priority support', included: false },
      { text: '500MB file limit', included: false },
    ], cta: 'Get Started', href: '/register', highlighted: false,
  },
  {
    name: 'Pro', price: '$9.99', period: '/month', description: 'For professionals',
    features: [
      { text: 'Unlimited file processing', included: true },
      { text: 'Max 500MB per file', included: true },
      { text: 'All PDF tools', included: true },
      { text: 'Extended storage (7 days)', included: true },
      { text: 'Priority support', included: true },
      { text: 'Batch processing', included: true },
    ], cta: 'Start Free Trial', href: '/register', highlighted: true,
  },
  {
    name: 'Enterprise', price: '$29.99', period: '/month', description: 'For teams',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'Team management', included: true },
    ], cta: 'Contact Sales', href: '/contact', highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="container-page">
      <div className="text-center mb-12">
        <h1 className="section-title">Simple Pricing</h1>
        <p className="section-subtitle mx-auto">Start free, upgrade when you need more.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`card flex flex-col ${plan.highlighted ? 'ring-2 ring-primary-500 relative' : ''}`}>
            {plan.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">Popular</div>}
            <div className="mb-6">
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-gray-500">{plan.period}</span>}
              </div>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f.text} className="flex items-center gap-2 text-sm">
                  {f.included ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircleIcon className="h-4 w-4 text-gray-300" />}
                  <span className={f.included ? '' : 'text-gray-400'}>{f.text}</span>
                </li>
              ))}
            </ul>
            <Link href={plan.href} className="w-full"><Button variant={plan.highlighted ? 'primary' : 'secondary'} className="w-full">{plan.cta}</Button></Link>
          </div>
        ))}
      </div>
    </div>
  )
}
