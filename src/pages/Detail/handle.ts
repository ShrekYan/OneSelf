/**
 * 文章详情页面纯函数处理逻辑
 */

import type { ArticleContentBlock } from './constant';

/**
 * 计算文章阅读时间
 */
export const calculateReadingTime = (
  content: ArticleContentBlock[],
): number => {
  let totalWords = 0;
  content.forEach(block => {
    if (block.type === 'paragraph' && block.text) {
      totalWords += block.text.trim().length;
    } else if (block.type === 'heading' && block.text) {
      totalWords += block.text.trim().length * 2;
    }
  });
  const wordsPerMinute = 300;
  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
};

/**
 * 格式化发布时间
 */
export const formatPublishTime = (publishAt: string): string => {
  return publishAt;
};
