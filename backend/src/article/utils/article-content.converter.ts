import type { ArticleContentBlocks } from '@prisma/client';
import type { ContentBlock } from '../dto';

/**
 * 将数据库 ArticleContentBlocks 转换为 DTO ContentBlock 数组
 * 处理：按 sortOrder 排序，类型映射，heading 格式解析
 */
export function convertArticleContentBlocks(
  blocks: ArticleContentBlocks[],
): ContentBlock[] {
  return blocks
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((block): ContentBlock => {
      const { blockType, content } = block;

      switch (blockType) {
        case 'heading': {
          // 预期格式: "2:这是二级标题"
          const parts = content.split(':', 2);
          if (parts.length === 2) {
            const level = parseInt(parts[0], 10);
            return {
              type: 'heading',
              level: !isNaN(level) && level >= 1 && level <= 6 ? level : 1,
              text: parts[1].trim(),
            };
          }
          // 格式不对降级：默认一级标题
          return {
            type: 'heading',
            level: 1,
            text: content,
          };
        }

        case 'text':
        case 'paragraph':
          return {
            type: 'paragraph',
            text: content,
          };

        case 'quote':
          return {
            type: 'quote',
            text: content,
          };

        case 'image':
          return {
            type: 'image',
            imageUrl: content.trim(),
          };

        case 'list':
          return {
            type: 'list',
            items: content
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
          };

        case 'code':
          // code 类型降级为普通段落
          return {
            type: 'paragraph',
            text: content,
          };

        default:
          // 未知类型降级为普通段落
          return {
            type: 'paragraph',
            text: content,
          };
      }
    });
}
