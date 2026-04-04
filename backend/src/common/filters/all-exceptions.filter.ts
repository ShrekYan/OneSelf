import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  message?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 处理未知异常
    const ctx = host.switchToHttp();
    // 获取响应对象
    const response = ctx.getResponse<Response>();
    // 获取请求对象
    const request = ctx.getRequest<{ url: string }>();

    // 确定 HTTP 状态码和错误消息
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 构建错误响应体
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // 处理非 HTTP 异常
    const errorMessage =
      typeof message === 'string'
        ? message
        : ((message as ErrorResponse).message ?? 'Internal server error');

    const errorResponse = {
      code: status,
      message: errorMessage,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
