import { FEATURES, LINKS, APP_INFO } from './mock';

/**
 * 关于我们页面的常量定义
 */

// ==================== 聚合导出 ====================

/**
 * 向后兼容：聚合导出 AboutConst 对象
 */
export const AboutConst = {
  FEATURES,
  LINKS,
  APP_INFO,
} as const;
