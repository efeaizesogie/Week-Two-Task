/**
 * Worker entry: runs the same Nest app but with workers explicitly enabled.
 * Deployed as a separate Fly.io process.
 */
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { loadEnv } from './config/env';

async function bootstrap() {
  loadEnv();
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  // eslint-disable-next-line no-console
  console.info('[worker] up. Queues are processing.');
  // Keep process alive; signals handled by Nest shutdown hooks.
  app.enableShutdownHooks();
}

void bootstrap();
