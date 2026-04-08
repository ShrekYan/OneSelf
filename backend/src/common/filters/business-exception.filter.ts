import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { ApiResult } from '../result/api-result';
import { appendErrorLog } from '../utils/file-logger';

/**
 * 业务异常过滤器
 * 捕获 BusinessException，转换成统一的 ApiResult 格式响应
 */
@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpStatus = exception.getStatus();
    const businessCode = exception.getBusinessCode();
    const responseBody = exception.getResponse() as { message: string };

    // Write business error log to file
    appendErrorLog({
      message: `${responseBody.message} (code: ${businessCode})`,
      stack: exception.stack,
      name: exception.name,
      method: request.method,
      url: request.originalUrl,
      ip: request.ip,
    });

    // 使用 ApiResult 包装，保持与现有格式完全一致
    const apiResult = ApiResult.error(businessCode, responseBody.message);

    // 使用 exception 本身的 HTTP 状态码
    response.status(httpStatus).json(apiResult);
  }
}
