import { Module } from '@nestjs/common';
import { RequestLogMiddleware } from './request-log.middleware';

@Module({
  providers: [RequestLogMiddleware],
  exports: [RequestLogMiddleware],
})
export class LoggerModule {}
