/**
 * 数字工具函数
 */

/**
 * 加法运算
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之和
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * 乘法运算
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之积
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * 格式化数字（千分位分隔）
 * @param num 待格式化的数字
 * @param decimals 小数位数，默认 2 位
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (!Number.isFinite(num)) {
    return '0';
  }

  const fixed = num.toFixed(decimals);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
