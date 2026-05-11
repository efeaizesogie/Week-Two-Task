import { Card, CardContent } from '@rfpilot/ui';

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Answer Library</h1>
        <p className="text-sm text-muted-foreground">
          Canonical Q&A your team reuses across every RFP. Edits are versioned.
        </p>
      </header>
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted-foreground">
          Your library will fill automatically as we ingest your past proposals.
        </CardContent>
      </Card>
    </div>
  );
}
