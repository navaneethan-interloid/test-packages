import { ApiResponse } from '@interloid/core';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async login(email: string): Promise<ApiResponse<string>> {
    return {
      success: true,
      statusCode: 200,
      data: email,
      message: 'Logged in successfully',
    };
  }

  getError() {
    throw new BadRequestException('Test the error');
  }
}
