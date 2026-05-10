/**
 * 字符串工具函数
 * 提供常用的字符串处理工具方法
 */

/**
 * 去除字符串两端的空白字符
 * @param str - 输入字符串
 * @returns 去除两端空白后的字符串
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 将字符串转换为大写
 * @param str - 输入字符串
 * @returns 大写形式的字符串
 */
export function uppercase(str: string): string {
  return str.toUpperCase();
}

/**
 * 将字符串转换为小写
 * @param str - 输入字符串
 * @returns 小写形式的字符串
 */
export function lowercase(str: string): string {
  return str.toLowerCase();
}

/**
 * 导出类型定义
 */
export type StringUtils = {
  trim: (str: string) => string;
  uppercase: (str: string) => string;
  lowercase: (str: string) => string;
};
