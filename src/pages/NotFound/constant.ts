/**
 * NotFound 页面常量定义
 */

/**
 * 错误图标常量
 */
export const NotFoundConst = {
  ERROR_ICONS: {
    NOT_FOUND: '📄',
    ERROR: '⚠️',
  },
  DEFAULT_ERROR_CODE: '404',
} as const;

/**
 * NotFoundConst 类型
 */
export type NotFoundConstType = typeof NotFoundConst;
