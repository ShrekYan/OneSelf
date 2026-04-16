import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { BusinessExceptionFilter } from './filters/business-exception.filter';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

/**
 * 公共基础设施模块
 * 统一管理全局异常过滤器、拦截器、守卫等公共组件
 */
@Module({
  providers: [
    // 全局异常过滤器
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: BusinessExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    // 全局响应转换拦截器
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class CommonModule {}
