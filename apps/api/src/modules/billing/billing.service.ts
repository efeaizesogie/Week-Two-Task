import { BadRequestException, Injectable } from '@nestjs/common';
import type { CheckoutInput } from '@rfpilot/types';

import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe.service';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService,
  ) {}

  /** Create a Stripe Checkout Session for a given tier + seat count. */
  async createCheckoutSession(orgId: string, userEmail: string, input: CheckoutInput) {
    const sub = await this.prisma.subscription.findUnique({ where: { orgId } });
    let customerId = sub?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.client.customers.create({
        email: userEmail,
        metadata: { orgId },
      });
      customerId = customer.id;
      await this.prisma.subscription.upsert({
        where: { orgId },
        create: { orgId, stripeCustomerId: customerId, tier: 'FREE' },
        update: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.client.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: this.stripe.priceForTier(input.tier), quantity: input.seats }],
      success_url: `${process.env.APP_URL}/billing?status=success`,
      cancel_url: `${process.env.APP_URL}/billing?status=cancelled`,
      allow_promotion_codes: true,
      metadata: { orgId, tier: input.tier },
    });

    return { url: session.url };
  }

  async createPortalSession(orgId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { orgId } });
    if (!sub) throw new BadRequestException('No billing profile');
    const portal = await this.stripe.client.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${process.env.APP_URL}/billing`,
    });
    return { url: portal.url };
  }
}
