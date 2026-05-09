/**
 * 格式化数字，添加千位分隔符
 */
export function formatNumber(num: number, locale = 'zh-CN'): string {
  return num.toLocaleString(locale);
}

/**
 * 限制数字在指定范围内
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 数字四舍五入到指定小数位数
 */
export function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * 数字向下取整到指定小数位数
 */
export function floorTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

/**
 * 数字向上取整到指定小数位数
 */
export function ceilTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
}

/**
 * 检查数字是否在指定范围内
 */
export function inRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}
