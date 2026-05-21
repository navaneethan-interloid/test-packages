import { Injectable, OnModuleInit } from '@nestjs/common';
import { MetricsService } from '@interloid/observability';
import type { Counter, Histogram } from 'prom-client';

interface CreateOrderInput {
  paymentMethod: string;
}
@Injectable()
export class OrdersService implements OnModuleInit {
  private ordersCreated!: Counter;
  private orderDuration!: Histogram;

  constructor(private readonly metrics: MetricsService) {}

  onModuleInit() {
    this.ordersCreated = this.metrics.counter(
      'orders_created_total',
      'Total orders created',
      ['payment_method', 'status'],
    );

    this.orderDuration = this.metrics.histogram(
      'order_processing_duration_seconds',
      'Time to fully process an order',
      ['payment_method'],
      [0.1, 0.5, 1, 2.5, 5, 10],
    );
  }

  async createOrder(input: CreateOrderInput) {
    const end = this.orderDuration.labels(input.paymentMethod).startTimer();

    try {
      const order = await this.create(input);
      this.ordersCreated.labels(input.paymentMethod, 'success').inc();
      return order;
    } catch (err) {
      this.ordersCreated.labels(input.paymentMethod, 'failure').inc();
      throw err;
    } finally {
      end();
    }
  }
  async create(input: CreateOrderInput) {
    throw new Error('Method not implemented.');
  }
}
