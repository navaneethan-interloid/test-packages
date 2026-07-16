import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '@interloid/logger';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl } = request;
    const startTime = process.hrtime.bigint();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logCompletion(
            method,
            originalUrl,
            response.statusCode,
            startTime,
            'completed',
          );
        },
        error: (err: unknown) => {
          const statusCode =
            err instanceof Error &&
            'status' in err &&
            typeof err.status === 'number'
              ? err.status
              : 500;
          this.logCompletion(
            method,
            originalUrl,
            statusCode,
            startTime,
            'failed',
          );
        },
      }),
    );
  }

  private logCompletion(
    method: string,
    url: string,
    statusCode: number,
    startTime: bigint,
    outcome: 'completed' | 'failed',
  ): void {
    const elapsedNs = process.hrtime.bigint() - startTime;
    const durationMs = Number(elapsedNs) / 1_000_000;

    this.logger.info(`HTTP ${method} ${url} ${outcome}`, {
      method,
      url,
      statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
    });
  }
}
