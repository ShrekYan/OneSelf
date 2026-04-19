import {
  BusinessErrorCode,
  getBusinessErrorMessage,
} from '../constants/business-error-codes';

/**
 * 统一 API 响应结果
 */
export class ApiResult<T = null> {
  /** 业务错误码，200 表示成功 */
  code: number;

  /** 错误消息，成功时可为空 */
  message: string;

  /** 响应数据，失败时可为空 */
  data: T;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * 成功响应
   * @param data 响应数据
   */
  static success<T>(data: T): ApiResult<T> {
    return new ApiResult(200, 'success', data);
  }

  /**
   * 失败响应（业务错误）
   * @param code 业务错误码
   * @param message 错误消息（可选，不填则使用默认消息）
   */
  static error<T = null>(
    code: BusinessErrorCode,
    message?: string,
  ): ApiResult<T> {
    return new ApiResult(
      code,
      message || getBusinessErrorMessage(code),
      null as unknown as T,
    );
  }
}
