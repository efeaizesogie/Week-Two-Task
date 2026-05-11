import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  readonly client: Stripe;

  constructor() {
    this.client = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      // Pin the API version — Stripe releases monthly.
      apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
      typescript: true,
    });
  }

  priceForTier(tier: 'STARTER' | 'TEAM'): string {
    return tier === 'STARTER'
      ? process.env.STRIPE_PRICE_STARTER!
      : process.env.STRIPE_PRICE_TEAM!;
  }
}
