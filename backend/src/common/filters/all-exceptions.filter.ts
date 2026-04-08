import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResult } from '../result/api-result';

interface ErrorResponse {
  message?: string;
}

/**
 * 全局所有异常过滤器
 * 捕获未被 BusinessExceptionFilter 捕获的所有异常
 *
 * 日志记录统一交由 RequestLogMiddleware 在 finish 事件处理
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage =
      typeof message === 'string'
        ? message
        : ((message as ErrorResponse).message ?? 'Internal server error');

    // 将异常挂载到 request 对象，供 RequestLogMiddleware 统一记录
    if (exception instanceof Error) {
      request.error = exception;
    }

    // Use uniform ApiResult format
    const errorResponse = new ApiResult(status, errorMessage, null);

    response.status(status).json(errorResponse);
  }
}
