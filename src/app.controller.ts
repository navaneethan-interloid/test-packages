import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  LoginDto,
  LoginSchema,
  RegisterSchema,
} from './dto/login.dto';
import { TypedConfigService } from '@interloid/config';
import fs from 'fs';
import { AppConfig } from './config/env.config';
import { OrdersService } from './order/order.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: TypedConfigService<AppConfig>,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {

    return this.appService.login(loginDto.email);
  }

  @Post('/password')
  @ApiResponse({ status: 200, description: 'Password validated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {

    return changePasswordDto;
  }

  @Get('/error')
  async getError() {

    return this.appService.getError();
  }
  // @Get('config-check')
  // checkConfig() {
  //   console.log(process.env.NODE_ENV);

  //   this.config.get('DATABASE_URL');

  //   const oldDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  //   fs.utimesSync('./logs/error.1.log', oldDate, oldDate);
  //   const updated = fs.statSync('./logs/error.1.log');

  //   console.log(new Date(updated.mtime));

  //   return {
  //     port: this.config.get('PORT'),
  //     db: this.config.getOrThrow('DATABASE_URL'), // Should throw if missing in .env
  //     all: this.config.getAll(), // Returns the frozen object
  //   };
  // }
  
}
