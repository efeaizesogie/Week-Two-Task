import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

/**
 * Converts all exceptions into a stable JSON error shape:
 *   { error: { code, message, details? } }
 * so the web client can render them consistently.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof ZodError) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: {
          code: 'validation_error',
          message: 'Invalid request payload',
          details: exception.flatten(),
        },
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const payload =
        typeof body === 'string'
          ? { code: statusCode(status), message: body }
          : { code: statusCode(status), ...(body as Record<string, unknown>) };
      res.status(status).json({ error: payload });
      return;
    }

    this.logger.error({
      msg: 'unhandled_exception',
      err: exception,
      url: req.url,
      method: req.method,
    });
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: { code: 'internal_error', message: 'Something went wrong' },
    });
  }
}

function statusCode(status: number): string {
  switch (status) {
    case 400:
      return 'bad_request';
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'not_found';
    case 409:
      return 'conflict';
    case 429:
      return 'rate_limited';
    default:
      return 'error';
  }
}
