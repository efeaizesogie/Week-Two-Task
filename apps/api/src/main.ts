import 'reflect-metadata';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { loadEnv } from './config/env';

async function bootstrap() {
  const env = loadEnv(); // validates or exits

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true, // required for Stripe webhook signature verification
  });

  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.enableCors({
    origin: [env.APP_URL],
    credentials: true,
  });

  app.setGlobalPrefix('v1', { exclude: ['health', 'webhooks/(.*)'] });
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: false,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableShutdownHooks();

  const port = Number(env.PORT ?? 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.info(`[api] listening on :${port} (env=${env.NODE_ENV})`);
}

void bootstrap();
