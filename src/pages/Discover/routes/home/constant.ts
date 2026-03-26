/**
 * Discover Home 模块常量定义
 */

import type { ArticleItem } from './components/article-list-item/index';

// ==================== 模拟文章数据 ====================
export const MOCK_ARTICLES: ArticleItem[] = [
  {
    id: '1',
    title: 'Understanding React Server Components',
    description:
      'A deep dive into how RSCs are changing the way we build modern web applications',
    authorName: 'Dan Abramov',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    readTime: '8 min',
    likes: 856,
    comments: 42,
    coverImage:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=300&fit=crop',
    hasCover: true,
    isLiked: false,
  },
  {
    id: '2',
    title: 'Minimalist Workspaces setup for Developers',
    description:
      'Simple, clean, and productive setup inspiration for focused coding',
    authorName: 'Lee Robinson',
    authorAvatar:
      'https://images.unsplash.com/photo-1527980965255-d3b465886f80?w=100&h=100&fit=crop&crop=face',
    readTime: '4 min',
    likes: 1203,
    comments: 89,
    coverImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop',
    hasCover: true,
    isLiked: true,
  },
  {
    id: '3',
    title: 'Mastering Typography in Digital Products',
    description:
      'Typography is 95% of web design. Here is how to master it effectively',
    authorName: 'Gary Hustwit',
    authorAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    readTime: '6 min',
    likes: 567,
    comments: 28,
    hasCover: false,
    isLiked: false,
  },
  {
    id: '4',
    title: 'The Art of Writing Clean Code',
    description:
      'Strategies and principles for writing code that is easy to maintain',
    authorName: 'Sarah Drasner',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    readTime: '10 min',
    likes: 1024,
    comments: 156,
    hasCover: false,
    isLiked: false,
  },
];
