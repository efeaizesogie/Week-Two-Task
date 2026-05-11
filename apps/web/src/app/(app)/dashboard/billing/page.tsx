import { Card, CardContent, CardHeader, CardTitle } from '@rfpilot/ui';

import { BillingActions } from './actions-client';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your plan, seats, and invoices.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Plan data comes from Stripe. Use the portal to change seats or cancel.
          </p>
          <BillingActions />
        </CardContent>
      </Card>
    </div>
  );
}
