import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLogMiddleware } from './request-log.middleware';
import { ResponseLogInterceptor } from './response-log.interceptor';

@Module({
  providers: [
    RequestLogMiddleware,
    // 全局响应日志拦截器，捕获响应数据供日志中间件记录
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseLogInterceptor,
    },
  ],
  exports: [RequestLogMiddleware],
})
export class LoggerModule {}
