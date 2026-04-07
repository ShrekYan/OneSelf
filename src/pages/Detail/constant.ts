/**
 * 文章详情页面常量
 */

import type { ArticleContentBlock as ApiArticleContentBlock } from '@/api/article';

/**
 * 文章详情内容块（与后端 DTO 结构对齐）
 */
export type ArticleContentBlock = ApiArticleContentBlock;

/**
 * 文章详情数据结构（与后端 ArticleDetailDto 对齐）
 */
export interface ArticleDetail {
  id: string;
  title: string;
  summary?: string;
  coverUrl?: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    name: string;
    avatar: string;
  };
  authorId: string;
  authorName?: string;
  authorAvatar?: string;
  tags: string[];
  views: number;
  likes: number;
  commentsCount: number;
  publishedAt: string;
  publishAt: string;
  isTop?: boolean;
  readTime?: number;
  content: ArticleContentBlock[];
  isLiked?: boolean;
  isCollected?: boolean;
  contentHtml?: string;
  markdownContent?: string;
  updatedAt?: string;
  seoKeywords?: string[];
  seoDescription?: string;
}

// 默认模拟数据 - 保留用于 fallback
export const mockArticleDetail: ArticleDetail = {
  id: '1',
  title: 'The Future of Mobile Interface Design in 2024',
  summary: 'Exploring the new paradigms of gesture-based navigation...',
  coverUrl:
    'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=750&h=468&fit=crop',
  category: {
    id: 'ui-ux-design',
    name: 'Design',
  },
  author: {
    name: 'Sarah Drasner',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  authorId: 'author-1',
  authorName: 'Sarah Drasner',
  authorAvatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  tags: ['Design', 'Mobile'],
  views: 1234,
  likes: 89,
  commentsCount: 12,
  publishedAt: '2024-10-24T10:00:00Z',
  publishAt: '2024-10-24T10:00:00Z',
  readTime: 5,
  content: [
    {
      type: 'paragraph',
      text: 'Exploring the new paradigms of gesture-based navigation and invisible UI that are reshaping how we interact with our devices.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'The Rise of Invisible Interfaces',
    },
    {
      type: 'paragraph',
      text: "Gone are the days of cluttered navigation bars and explicit buttons. The trend is moving towards subtle, context-aware interfaces that disappear when you don't need them.",
    },
    {
      type: 'heading',
      level: 2,
      text: 'Spatial Computing Influences',
    },
    {
      type: 'quote',
      text: "The best interface is no interface. It's fluid, predictable, and responds to natural human movement.",
    },
    {
      type: 'paragraph',
      text: 'With the advent of AR headsets, 2D mobile screens are beginning to incorporate spatial thinking. Designers are now thinking in three dimensions even for flat surfaces.',
    },
  ],
  isLiked: false,
  isCollected: false,
};
