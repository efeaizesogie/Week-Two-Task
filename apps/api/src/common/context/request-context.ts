import type { Role } from '@rfpilot/db';

/**
 * RequestContext is attached to `req.ctx` by ClerkAuthGuard, then
 * consumed by OrgScopeInterceptor, RolesGuard, and services via
 * the @Ctx() decorator.
 *
 * It is deliberately immutable from outside the guard.
 */
export interface RequestContext {
  userId: string;
  orgId: string;
  role: Role;
  /** Clerk user id, useful for audit logs. */
  clerkUserId: string;
  /** Resolved email for logging. */
  email: string;
}

export const CTX_KEY = '__rfpilot_ctx__';

export interface RequestWithCtx extends Express.Request {
  [CTX_KEY]?: RequestContext;
  ctx?: RequestContext;
}
