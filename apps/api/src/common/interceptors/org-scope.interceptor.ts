import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';

import type { RequestContext } from '../context/request-context';

/**
 * Multi-tenancy guard rail.
 *
 * This interceptor attaches the current `orgId` from RequestContext onto the
 * Express request under `req.orgScope`. Every service query **must** use this
 * value to filter Prisma calls — centralising tenancy checks in one place.
 *
 * Services should call `ctx.orgId` (not parameters, not URL params) as the
 * sole source of truth for tenant scope.
 */
@Injectable()
export class OrgScopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{
      ctx?: RequestContext;
      orgScope?: { orgId: string };
    }>();
    if (req.ctx) {
      req.orgScope = { orgId: req.ctx.orgId };
    }
    return next.handle();
  }
}
