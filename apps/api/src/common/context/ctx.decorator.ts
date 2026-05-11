import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import type { RequestContext } from './request-context';

/**
 * Usage: `handler(@Ctx() ctx: RequestContext) { ... }`
 * Throws if the context is missing — which only happens on routes that
 * have been marked public by mistake.
 */
export const Ctx = createParamDecorator((_data: unknown, host: ExecutionContext): RequestContext => {
  const req = host.switchToHttp().getRequest<{ ctx?: RequestContext }>();
  if (!req.ctx) {
    throw new UnauthorizedException('Missing request context');
  }
  return req.ctx;
});
