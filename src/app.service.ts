import {
  buildPaginationMeta,
  type ApiResponse,
} from '@interloid/core';
import { LoggerService } from '@interloid/logger';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}
  async login(email: string): Promise<ApiResponse<string>> {
    const pageMeta = buildPaginationMeta(20, { page: 1, pageSize: 10 });
    const data = 'sample data';
    this.logger.info('login', { email });
    const response: ApiResponse<string> = {
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data,
      paginationMeta: pageMeta,
    };
    return response;
  }

  getError() {
    this.logger.error('An error occurred in getError method', {
      error: 'Error details',
    });
    throw new BadRequestException('Test the error');
  }
}
