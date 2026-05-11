import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@rfpilot/ui';

export default function DashboardPage() {
  const stats = [
    { label: 'Active RFPs', value: '—' },
    { label: 'Questions answered', value: '—' },
    { label: 'Hours saved', value: '—' },
    { label: 'Library answers', value: '—' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Here’s what’s happening in your workspace.
          </p>
        </div>
        <Link
          href="/dashboard/rfps/new"
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New RFP
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent RFPs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Upload your first RFP to get started.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stale library answers</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We’ll flag answers that haven’t been reviewed in 90 days once your library is populated.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
