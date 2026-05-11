import Link from 'next/link';

import { Card, CardContent } from '@rfpilot/ui';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <SocialProof />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-to-b from-primary/10 via-transparent to-transparent"
        aria-hidden
      />
      <div className="container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            AI copilot for RFPs
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Win more deals. Stop re-writing the same answers.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            RFPilot drafts answers to your RFPs and security questionnaires in minutes, cited from
            your own past proposals. Built for modern sales teams.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center rounded-md border border-input bg-background px-6 text-sm font-medium hover:bg-accent"
            >
              See pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card required.</p>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: 'AI drafts with citations',
      body: 'Answer 80% of any RFP from your own documents. Every claim links to the source.',
    },
    {
      title: 'Answer Library, maintained',
      body: 'Canonical Q&A with ownership, versions, and staleness detection.',
    },
    {
      title: 'Ship-ready exports',
      body: 'Export to branded DOCX or PDF. Preserve the customer’s table structure.',
    },
    {
      title: 'Collaboration, finally',
      body: 'Assign, comment, approve. Your SMEs actually want to use it.',
    },
    {
      title: 'Security questionnaires',
      body: 'CAIQ and SIG modes built for security-heavy procurement.',
    },
    {
      title: 'API + integrations',
      body: 'Salesforce, HubSpot, Slack, Drive. Fits your stack.',
    },
  ];
  return (
    <section id="features" className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Everything a proposal team needs</h2>
        <p className="mt-4 text-muted-foreground">
          Designed with Maya the proposal manager in mind. Loved by Derek the AE.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Card key={i.title}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="container py-14 text-center">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Teams moving off Loopio, Responsive, and Google Docs
        </p>
        <div className="mt-6 grid grid-cols-2 gap-6 opacity-60 md:grid-cols-5">
          {['Northwind', 'Acme', 'Globex', 'Initech', 'Vandelay'].map((n) => (
            <div key={n} className="text-lg font-semibold tracking-tight">
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="container py-24 text-center">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Stop losing weekends to RFPs.
      </h2>
      <p className="mt-4 text-muted-foreground">Set up in 10 minutes. Your first draft is free.</p>
      <Link
        href="/sign-up"
        className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Start free
      </Link>
    </section>
  );
}
