'use server';

import { apiFetch } from '@/lib/api-client';

export async function startCheckout(tier: 'STARTER' | 'TEAM'): Promise<{ url: string | null }> {
  return apiFetch<{ url: string | null }>('/v1/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ tier, seats: 1 }),
  });
}

export async function openPortal(): Promise<{ url: string | null }> {
  return apiFetch<{ url: string | null }>('/v1/billing/portal', { method: 'POST' });
}
