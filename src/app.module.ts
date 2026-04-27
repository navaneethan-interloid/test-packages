import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule, GlobalExceptionFilter } from '@interloid/core';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [CoreModule.forRoot({applyMiddleware:false})],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
