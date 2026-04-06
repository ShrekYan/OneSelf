/**
 * 业务错误码枚举
 * 按模块分段编码，统一管理
 *
 * 分段规则：
 * - 1xxx - 认证授权模块 (auth)
 * - 2xxx - 用户模块 (user)
 * - 3xxx - 文章模块 (article)
 * - 4xxx - 分类模块 (category)
 */
export enum BusinessErrorCode {
  // ========== 1xxx - 认证授权模块 (auth) ==========

  /** 用户名或密码错误 */
  AUTH_INVALID_CREDENTIALS = 1001,

  /** 用户已被禁用 */
  AUTH_USER_DISABLED = 1002,

  /** 手机号已注册 */
  AUTH_MOBILE_ALREADY_REGISTERED = 1003,

  /** 刷新令牌无效或已过期 */
  AUTH_INVALID_REFRESH_TOKEN = 1004,

  /** 用户已被锁定（登录失败次数过多）*/
  AUTH_USER_LOCKED = 1005,

  // ========== 可继续扩展其他模块... ==========
}

/**
 * 错误码对应错误消息映射
 */
export const BusinessErrorMessage: Record<BusinessErrorCode, string> = {
  [BusinessErrorCode.AUTH_INVALID_CREDENTIALS]: '用户名或密码错误',
  [BusinessErrorCode.AUTH_USER_DISABLED]: '用户已被禁用',
  [BusinessErrorCode.AUTH_MOBILE_ALREADY_REGISTERED]: '手机号已注册',
  [BusinessErrorCode.AUTH_INVALID_REFRESH_TOKEN]: '刷新令牌无效或已过期',
  [BusinessErrorCode.AUTH_USER_LOCKED]: '账户已被锁定，请稍后再试',
};

/**
 * 获取错误消息
 */
export function getBusinessErrorMessage(code: BusinessErrorCode): string {
  return BusinessErrorMessage[code] || '未知错误';
}
