/**
 * ArticleDetail page pure logic handlers
 * @description Only pure functions, no side effects, no React hooks
 */

/**
 * Format count number for display (e.g. 10000 -> 1.0w)
 */
export const formatCount = (count: number): string => {
  if (count > 10000) {
    return `${(count / 10000).toFixed(1)}w`;
  }
  return String(count);
};

/**
 * Format read count (alias of formatCount, for semantic clarity)
 */
export const formatReadCount = formatCount;
