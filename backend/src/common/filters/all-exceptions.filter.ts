import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResult } from '../result/api-result';
import { appendErrorLog } from '../utils/file-logger';

interface ErrorResponse {
  message?: string;
}

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

    // Write error log to file
    appendErrorLog({
      message: errorMessage,
      stack: exception instanceof Error ? exception.stack : undefined,
      name: exception instanceof Error ? exception.name : undefined,
      method: request.method,
      url: request.originalUrl,
      ip: request.ip,
    });

    // Use uniform ApiResult format
    const errorResponse = new ApiResult(status, errorMessage, null);

    response.status(status).json(errorResponse);
  }
}
