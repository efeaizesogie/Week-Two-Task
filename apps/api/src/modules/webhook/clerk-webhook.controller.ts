import { BadRequestException, Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';

import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Clerk webhook. In production we verify via Svix (Clerk uses Svix). For the
 * scaffold we record the event and mark TODO: signature verification before
 * enabling the route in production.
 */
@Controller('webhooks/clerk')
export class ClerkWebhookController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @Public()
  @HttpCode(200)
  async handle(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('svix-id') svixId?: string,
    @Headers('svix-timestamp') _svixTs?: string,
    @Headers('svix-signature') _svixSig?: string,
  ): Promise<{ received: true }> {
    if (!req.rawBody) throw new BadRequestException('Missing raw body');

    // TODO: verify svix signature (svix-node). Until then only accept in dev.
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException('Clerk webhook signature verification not yet implemented');
    }

    const event = JSON.parse(req.rawBody.toString()) as {
      type: string;
      data: unknown;
      id?: string;
    };
    const eventId = svixId ?? event.id ?? cryptoRandom();

    await this.prisma.webhookEvent.upsert({
      where: { eventId },
      update: {},
      create: {
        source: 'clerk',
        eventId,
        type: event.type,
        payload: event as unknown as Record<string, unknown>,
        processed: true,
      },
    });
    return { received: true };
  }
}

function cryptoRandom(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
