import 'dotenv/config';
import { bootstrapSentry, bootstrapTracing } from '@interloid/observability';

bootstrapSentry({
  enabled: process.env.SENTRY_ENABLED === 'true',
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION ?? '0.0.0',
  tracesSampleRate: 0.1,
});

bootstrapTracing({
  enabled: process.env.OTEL_ENABLED == 'true',
  serviceName: process.env.SERVICE_NAME ?? 'my-service',
  serviceVersion: process.env.APP_VERSION ?? '0.0.0',
  exporter: { type: 'console' },
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from '@interloid/logger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import {
  buildCorsOptions,
  strictHelmet,
  swaggerSafeHelmet,
} from '@interloid/security';
import * as cookieParser from 'cookie-parser';
import { RequestHandler } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const isProd = process.env.NODE_ENV === 'production';
  app.use(isProd ? strictHelmet() : swaggerSafeHelmet());

  app.enableCors(buildCorsOptions({ origins: ['*'], allowNoOrigin: true }));
  // app.use((cookieParser as unknown as () => RequestHandler)());

  const config = new DocumentBuilder()
    .setTitle('Testing API')
    .setDescription('The Starter app package testing API')
    .setVersion('1.0')
    .build();

  app.set('trust proxy', 1);
  const document = SwaggerModule.createDocument(app, config);
  const logger = app.get(LoggerService);

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  SwaggerModule.setup('api/docs', app, document);
  await app.listen(3000);
}
bootstrap()
  .then(() => {
    console.log('Application is running on http://localhost:3000');
  })
  .catch((err) => {
    console.error('Error starting application:', err);
  });
