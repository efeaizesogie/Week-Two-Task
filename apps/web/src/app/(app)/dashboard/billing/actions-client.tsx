'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@rfpilot/ui';

import { openPortal, startCheckout } from './actions';

export function BillingActions() {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          start(async () => {
            try {
              const { url } = await startCheckout('STARTER');
              if (url) window.location.href = url;
            } catch (err) {
              toast.error(err instanceof Error ? err.message : 'Failed to start checkout');
            }
          })
        }
        disabled={pending}
      >
        Upgrade to Starter
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          start(async () => {
            try {
              const { url } = await openPortal();
              if (url) window.location.href = url;
            } catch (err) {
              toast.error(err instanceof Error ? err.message : 'Failed to open portal');
            }
          })
        }
        disabled={pending}
      >
        Manage plan
      </Button>
    </div>
  );
}
