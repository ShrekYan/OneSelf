import { HttpException, HttpStatus } from '@nestjs/common';
import {
  BusinessErrorCode,
  getBusinessErrorMessage,
} from '../constants/business-error-codes';

/**
 * 业务异常
 * 用于抛出业务错误，由全局异常过滤器统一处理成 ApiResult 格式
 */
export class BusinessException extends HttpException {
  private readonly businessCode: BusinessErrorCode;

  constructor(
    businessCode: BusinessErrorCode,
    customMessage?: string,
    httpStatus: number = HttpStatus.OK,
  ) {
    const message = customMessage || getBusinessErrorMessage(businessCode);
    super(
      {
        code: businessCode,
        message,
        data: null,
      },
      httpStatus,
    );
    this.businessCode = businessCode;
  }

  /**
   * 获取业务错误码
   */
  getBusinessCode(): BusinessErrorCode {
    return this.businessCode;
  }
}
