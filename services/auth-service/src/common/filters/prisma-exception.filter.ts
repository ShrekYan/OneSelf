import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { ApiResult } from '../result/api-result';
import { BusinessErrorCode } from '../constants/business-error-codes';

/**
 * Prisma 数据库异常过滤器
 * 专门处理 Prisma ORM 抛出的数据库异常，转换为友好的业务错误响应
 */
@Catch(PrismaClientKnownRequestError, PrismaClientUnknownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception: PrismaClientKnownRequestError | PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 将异常挂载到 request 对象，供 RequestLogMiddleware 统一记录
    request.error = exception;

    // 处理已知的 Prisma 请求错误
    if (exception instanceof PrismaClientKnownRequestError) {
      const { code } = exception;
      let businessCode: BusinessErrorCode;
      let message: string;
      let status: number;

      // 根据 Prisma 错误码映射到业务错误码
      switch (code) {
        case 'P2002':
          // 唯一约束冲突
          businessCode = BusinessErrorCode.DATABASE_UNIQUE_CONSTRAINT;
          message = '数据已存在，违反唯一约束';
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'P2025':
          // 记录不存在
          businessCode = BusinessErrorCode.DATABASE_RECORD_NOT_FOUND;
          message = '记录不存在';
          status = HttpStatus.NOT_FOUND;
          break;
        case 'P2003':
        case 'P2014':
          // 外键约束冲突
          businessCode = BusinessErrorCode.DATABASE_FOREIGN_KEY_CONSTRAINT;
          message = '存在关联数据，无法执行此操作';
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'P2034':
          // 事务冲突
          businessCode = BusinessErrorCode.DATABASE_TRANSACTION_CONFLICT;
          message = '事务冲突，请重试';
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
        default:
          // 其他 Prisma 错误
          this.logger.error(`Unhandled Prisma error: ${code}`, exception.stack);
          businessCode = BusinessErrorCode.DATABASE_CONNECTION_ERROR;
          message = '数据库操作异常';
          status = HttpStatus.INTERNAL_SERVER_ERROR;
      }

      // 记录详细错误日志
      this.logger.error(
        `Prisma error: code=${code}, message=${exception.message}`,
        exception.stack,
      );

      const apiResult = ApiResult.error(businessCode, message);
      response.status(status).json(apiResult);
      return;
    }

    // 处理未知的 Prisma 错误
    this.logger.error(
      `Unknown Prisma error: ${exception.message}`,
      exception.stack,
    );

    const apiResult = ApiResult.error(
      BusinessErrorCode.DATABASE_CONNECTION_ERROR,
      '数据库操作异常',
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiResult);
  }
}
