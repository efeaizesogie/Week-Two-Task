import { Card, CardContent, CardHeader, CardTitle } from '@rfpilot/ui';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Workspace, branding, and API keys.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Profile and org details live here. Coming in the next PR.
        </CardContent>
      </Card>
    </div>
  );
}
