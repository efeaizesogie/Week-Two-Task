import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type Stripe from 'stripe';

import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../billing/stripe.service';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripe: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Stripe webhook. We:
   *   1. Verify signature using the raw body (main.ts sets rawBody: true).
   *   2. Idempotency: record the event in WebhookEvent; skip if seen.
   *   3. Apply the event to our subscription state.
   */
  @Post()
  @Public()
  @HttpCode(200)
  async handle(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: true }> {
    if (!req.rawBody) throw new BadRequestException('Missing raw body');
    if (!signature) throw new BadRequestException('Missing signature');

    let event: Stripe.Event;
    try {
      event = this.stripe.client.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET ?? '',
      );
    } catch (err) {
      throw new BadRequestException(`Invalid signature: ${(err as Error).message}`);
    }

    const existing = await this.prisma.webhookEvent.findUnique({ where: { eventId: event.id } });
    if (existing?.processed) return { received: true };

    await this.prisma.webhookEvent.upsert({
      where: { eventId: event.id },
      update: {},
      create: {
        source: 'stripe',
        eventId: event.id,
        type: event.type,
        payload: event as unknown as Record<string, unknown>,
      },
    });

    // TODO: subscription state machine. For now, mark processed.
    await this.prisma.webhookEvent.update({
      where: { eventId: event.id },
      data: { processed: true },
    });

    return { received: true };
  }
}
