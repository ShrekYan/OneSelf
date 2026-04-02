/**
 * Discover Home 模块常量定义
 */

import type { ArticleItem } from './useStore';

// ==================== 轮播特色文章类型 ====================
export interface FeaturedArticleItem {
  id: string;
  category: string; // 保持 string，显示分类名称
  title: string;
  authorName: string;
  authorAvatar: string;
  publishedAt: string; // ISO 日期字符串
  readTime: number; // 分钟数（数字）
  coverUrl: string; // 字段名与后端一致
}

// ==================== 模拟轮播特色文章数据 ====================
export const MOCK_FEATURED_ARTICLES: FeaturedArticleItem[] = [
  {
    id: 'f1',
    category: 'DESIGN',
    title: 'The Future of Mobile Interface Design in 2024',
    authorName: 'Sarah Drasner',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    publishedAt: '2024-10-24T00:00:00Z',
    readTime: 5,
    coverUrl:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=750&h=520&fit=crop',
  },
  {
    id: 'f2',
    category: 'DEVELOPMENT',
    title: 'Building Responsive Layouts with CSS Grid',
    authorName: 'Dan Abramov',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    publishedAt: '2024-10-22T00:00:00Z',
    readTime: 8,
    coverUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=750&h=520&fit=crop',
  },
  {
    id: 'f3',
    category: 'PERFORMANCE',
    title: 'Optimizing React Apps for Speed',
    authorName: 'Lee Robinson',
    authorAvatar:
      'https://images.unsplash.com/photo-1527980965255-d3b465886f80?w=100&h=100&fit=crop&crop=face',
    publishedAt: '2024-10-18T00:00:00Z',
    readTime: 6,
    coverUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=750&h=520&fit=crop',
  },
];

// ==================== 模拟文章列表数据 ====================
export const MOCK_ARTICLES: ArticleItem[] = [
  {
    id: '1',
    title: 'Understanding React Server Components',
    summary:
      'A deep dive into how RSCs are changing the way we build modern web applications',
    authorName: 'Dan Abramov',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    category: { id: 'tech', name: 'Tech' },
    authorId: '1',
    tags: ['React', 'Frontend'],
    views: 12580,
    likes: 856,
    commentsCount: 42,
    publishedAt: '2024-10-24T00:00:00Z',
    coverUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=300&fit=crop',
    readTime: 8,
    isLiked: false,
  },
  {
    id: '2',
    title: 'Minimalist Workspaces setup for Developers',
    summary:
      'Simple, clean, and productive setup inspiration for focused coding',
    authorName: 'Lee Robinson',
    authorAvatar:
      'https://images.unsplash.com/photo-1527980965255-d3b465886f80?w=100&h=100&fit=crop&crop=face',
    category: { id: 'lifestyle', name: 'Lifestyle' },
    authorId: '2',
    tags: ['Productivity', 'Workspace'],
    views: 9872,
    likes: 1203,
    commentsCount: 89,
    publishedAt: '2024-10-22T00:00:00Z',
    coverUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop',
    readTime: 4,
    isLiked: true,
  },
  {
    id: '3',
    title: 'Mastering Typography in Digital Products',
    summary:
      'Typography is 95% of web design. Here is how to master it effectively',
    authorName: 'Gary Hustwit',
    authorAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    category: { id: 'design', name: 'Design' },
    authorId: '3',
    tags: ['Typography', 'Design'],
    views: 7543,
    likes: 567,
    commentsCount: 28,
    publishedAt: '2024-10-18T00:00:00Z',
    readTime: 6,
    isLiked: false,
  },
  {
    id: '4',
    title: 'The Art of Writing Clean Code',
    summary:
      'Strategies and principles for writing code that is easy to maintain',
    authorName: 'Sarah Drasner',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    category: { id: 'dev', name: 'Development' },
    authorId: '4',
    tags: ['Coding', 'Best Practices'],
    views: 15234,
    likes: 1024,
    commentsCount: 156,
    publishedAt: '2024-10-15T00:00:00Z',
    readTime: 10,
    isLiked: false,
  },
];
