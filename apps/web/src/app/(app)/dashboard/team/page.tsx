import { Card, CardContent } from '@rfpilot/ui';

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="text-sm text-muted-foreground">Invite teammates and manage roles.</p>
      </header>
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted-foreground">
          Invite flow coming in the next PR.
        </CardContent>
      </Card>
    </div>
  );
}
