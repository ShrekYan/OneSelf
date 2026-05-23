/**
 * 去除字符串首尾空白字符
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 去除首尾空白后的字符串；传入 null/undefined 时返回空字符串
 */
export function trim(str: string | null | undefined): string {
  return (str ?? '').trim();
}

/**
 * 将字符串转为全大写
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 全大写形式的字符串；传入 null/undefined 时返回空字符串
 */
export function uppercase(str: string | null | undefined): string {
  return (str ?? '').toUpperCase();
}

/**
 * 将字符串转为全小写
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 全小写形式的字符串；传入 null/undefined 时返回空字符串
 */
export function lowercase(str: string | null | undefined): string {
  return (str ?? '').toLowerCase();
}
