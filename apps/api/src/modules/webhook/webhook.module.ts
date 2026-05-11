import { Module } from '@nestjs/common';

import { BillingModule } from '../billing/billing.module';
import { ClerkWebhookController } from './clerk-webhook.controller';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  imports: [BillingModule],
  controllers: [StripeWebhookController, ClerkWebhookController],
})
export class WebhookModule {}
