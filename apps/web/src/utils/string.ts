/**
 * 去除字符串首尾空格
 * @param str 输入字符串
 * @returns 去除首尾空格后的字符串
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 将字符串转为大写
 * @param str 输入字符串
 * @returns 大写字符串
 */
export function uppercase(str: string): string {
  return str.toUpperCase();
}

/**
 * 将字符串转为小写
 * @param str 输入字符串
 * @returns 小写字符串
 */
export function lowercase(str: string): string {
  return str.toLowerCase();
}
