import { auth } from '@clerk/nextjs/server';

import { serverEnv } from './env';

/**
 * Server-side typed fetch for calling apps/api from React Server Components
 * and route handlers. Attaches the Clerk session JWT + the org header.
 *
 * For client components, prefer calling Server Actions which use this
 * internally — never expose the Clerk token to the browser.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit & { orgId?: string } = {},
): Promise<T> {
  const { getToken, orgId: clerkOrgId } = await auth();
  const token = await getToken();
  const orgId = init.orgId ?? clerkOrgId ?? undefined;

  const url = `${serverEnv.API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(orgId ? { 'x-rfpilot-org': orgId } : {}),
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errBody: unknown = await res.json().catch(() => ({}));
    const message =
      (errBody as { error?: { message?: string } }).error?.message ?? res.statusText;
    throw new ApiError(res.status, message, errBody);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
