/**
 * 安全相关工具函数
 */

import { ALLOWED_ROUTE_PREFIXES } from '@/routes/allowed-routes';

// 危险协议黑名单（包含协议前缀和无协议绝对路径）
// 使用小写进行不区分大小写匹配
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'http:',
  'https:',
  'ftp:',
  '//',
];

/**
 * 安全验证重定向 URL
 *
 * 安全规则：
 * 1. 空值返回 fallback
 * 2. 危险协议（http、https、javascript 等）返回 fallback
 * 3. 非相对路径（不以 / 开头）返回 fallback
 * 4. 路径不在路由白名单内返回 fallback
 *
 * @param url - 待验证的 URL
 * @param fallback - 验证失败时的 fallback 路径，默认为 /home
 * @returns 安全的路径
 *
 * @example
 * // 安全路径
 * safeRedirectUrl('/profile') // => '/profile'
 * safeRedirectUrl('/article/123') // => '/article/123'（前缀匹配）
 *
 * // 危险路径
 * safeRedirectUrl('https://evil.com') // => '/home'（拦截）
 * safeRedirectUrl('javascript:alert(1)') // => '/home'（拦截）
 * safeRedirectUrl('//evil.com') // => '/home'（拦截）
 */
export function safeRedirectUrl(
  url: string | null,
  fallback = '/home',
): string {
  // 1. 空值检查
  if (!url) {
    return fallback;
  }

  // 2. 危险协议检测（不区分大小写，去除前后空格）
  const lowerUrl = url.toLowerCase().trim();
  if (DANGEROUS_PROTOCOLS.some(protocol => lowerUrl.startsWith(protocol))) {
    return fallback;
  }

  // 3. 必须是相对路径（以 / 开头）
  if (!url.startsWith('/')) {
    return fallback;
  }

  // 4. 路由白名单前缀匹配
  // 支持精确匹配或前缀匹配（如 /article 匹配 /article/123）
  const isAllowed = ALLOWED_ROUTE_PREFIXES.some(allowedPath => {
    return url === allowedPath || url.startsWith(`${allowedPath}/`);
  });

  return isAllowed ? url : fallback;
}
