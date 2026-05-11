import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@rfpilot/ui';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    blurb: 'For trying RFPilot on a single RFP.',
    features: [
      '1 user',
      '3 RFPs per month',
      'Watermarked exports',
      '500 MB knowledge base',
    ],
    cta: { label: 'Start free', href: '/sign-up' },
  },
  {
    name: 'Starter',
    price: '$79',
    cadence: 'per user / month',
    blurb: 'For small teams responding to RFPs weekly.',
    features: [
      'Unlimited RFPs',
      'No watermark on exports',
      '5 GB knowledge base',
      'AI drafts with citations',
    ],
    cta: { label: 'Start 14-day trial', href: '/sign-up?plan=starter' },
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$199',
    cadence: 'per user / month',
    blurb: 'For proposal teams that need collaboration + analytics.',
    features: [
      'Everything in Starter',
      'SSO + roles',
      'Analytics dashboards',
      '50 GB knowledge base',
      'API access',
    ],
    cta: { label: 'Start 14-day trial', href: '/sign-up?plan=team' },
  },
];

export default function PricingPage() {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Pricing</h1>
        <p className="mt-4 text-muted-foreground">
          Simple seat-based pricing. Cancel any time. 14-day trial on paid plans, no card required.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={tier.highlighted ? 'border-primary/60 shadow-lg ring-1 ring-primary/30' : undefined}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.cadence}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tier.blurb}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.cta.href}
                className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {tier.cta.label}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
