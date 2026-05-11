import Link from 'next/link';

import { Card, CardContent } from '@rfpilot/ui';

export default function RfpsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">RFPs</h1>
          <p className="text-sm text-muted-foreground">Every RFP you’re working on, in one place.</p>
        </div>
        <Link
          href="/dashboard/rfps/new"
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          New RFP
        </Link>
      </header>
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted-foreground">
          No RFPs yet. Click <span className="font-medium text-foreground">New RFP</span> to upload
          your first document.
        </CardContent>
      </Card>
    </div>
  );
}
