/**
 * 去除字符串两端的空白字符
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 去除字符串左端的空白字符
 */
export function trimStart(str: string): string {
  return str.trimStart();
}

/**
 * 去除字符串右端的空白字符
 */
export function trimEnd(str: string): string {
  return str.trimEnd();
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 首字母小写
 */
export function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * 字符串转驼峰命名
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, c => c.toLowerCase());
}

/**
 * 字符串转短横线命名
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase();
}

/**
 * 截断字符串并添加省略号
 */
export function truncate(
  str: string,
  maxLength: number,
  ellipsis = '...',
): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}
