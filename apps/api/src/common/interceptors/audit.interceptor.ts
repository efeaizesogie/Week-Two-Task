import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import type { RequestContext } from '../context/request-context';

/**
 * Audit every mutating request (POST/PATCH/PUT/DELETE) into the AuditLog.
 *
 * Implementation note: this is a placeholder that logs to stdout. In the
 * next PR it will inject PrismaService and persist an AuditLog row. We keep
 * the interceptor shape here so its position in the module graph is fixed.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      ctx?: RequestContext;
    }>();
    const mutating = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);

    return next.handle().pipe(
      tap(() => {
        if (!mutating || !req.ctx) return;
        // eslint-disable-next-line no-console
        console.info(
          `[audit] ${req.method} ${req.url} user=${req.ctx.userId} org=${req.ctx.orgId}`,
        );
      }),
    );
  }
}
