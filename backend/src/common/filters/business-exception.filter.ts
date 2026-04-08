import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { ApiResult } from '../result/api-result';

/**
 * 业务异常过滤器
 * 捕获 BusinessException，转换成统一的 ApiResult 格式响应
 *
 * 日志记录统一交由 RequestLogMiddleware 在 finish 事件处理
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

    // 将异常挂载到 request 对象，供 RequestLogMiddleware 统一记录
    request.error = exception;

    // 使用 ApiResult 包装，保持与现有格式完全一致
    const apiResult = ApiResult.error(businessCode, responseBody.message);

    // 使用 exception 本身的 HTTP 状态码
    response.status(httpStatus).json(apiResult);
  }
}
