import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@interloid/config';
import {
  CoreModule,
  GlobalExceptionFilter,
  RequestContextMiddleware,
} from '@interloid/core';
import { LoggerModule } from '@interloid/logger';
import { CronExpression } from '@nestjs/schedule';
import { ValidationModule } from '@interloid/validation';
import { ObservabilityModule } from '@interloid/observability';
import { appConfigSchema } from './config/env.config';
import { OrdersService } from './order/order.service';
import { GLOBAL_THROTTLER_PRESET, SecurityModule } from '@interloid/security';

@Module({
  imports: [
    SecurityModule.forRoot({ throttler: GLOBAL_THROTTLER_PRESET, csrf: {} }),
    ObservabilityModule.forRoot({
      health: {
        diskThresholdPercent: 0.5,
        memoryHeapBytes: 512 * 1024 * 1024,
      },
      metrics: {
        collectDefaultMetrics: true,
      },
      sentry: {
        enabled: process.env.SENTRY_ENABLED === 'true',
        dsn: process.env.SENTRY_DSN,
      },
    }),

    CoreModule.forRoot({ applyMiddleware: false }),
    ValidationModule.forRoot({ global: true }),
    LoggerModule.forRoot({
      level: 'info',
      serviceName: 'demo_app',
      file: {
        directory: './logs',
        retentionDays: 1,
        cleanupCron: CronExpression.EVERY_DAY_AT_9PM,
      },
      redact: ['email'],
    }),
    ConfigModule.forRoot({
      schema: appConfigSchema,
      nodeEnv: 'test',
      envDir: './',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OrdersService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
