/**
 * 文章详情页面 Mock 数据
 */

import type { ArticleDetail } from './types';

// ==================== 示例文章数据 ====================

export const MOCK_ARTICLE_DETAIL: ArticleDetail = {
  id: 'article-001',
  title: 'How to Write Maintainable React Components - Best Practices',
  summary:
    'This article shares practical experience for writing maintainable React components in large projects, from component design and folder structure to state management, improving code quality comprehensively.',
  content: `
# How to Write Maintainable React Components

In large frontend projects, code maintainability is more important than short-term development speed. This article shares best practices I've summarized from real-world projects.

## 1. Component Splitting Principles

One component should do only one thing. If a component exceeds 300 lines, you should consider splitting it.

### Signs for Splitting:
- Multiple independent functional blocks in one component
- A specific part can be reused elsewhere
- Comments divide the code into multiple sections

## 2. Directory Structure Guidelines

A good directory structure helps new team members find what they need to modify quickly. The structure we use in our project is:

\`\`\`
ComponentName/
├── index.tsx           # Component code
└── index.module.scss  # Component styles
\`\`\`

Each component is self-contained with its own logic and styles. You only need to enter this folder when making changes.

## 3. TypeScript Type Safety

Don't abuse any. Give correct types to all Props and data. The type system is the best documentation.

### Recommended Practices:
- Use interface to define component Props
- Use union types instead of enum
- Leverage TypeScript type inference to reduce redundant declarations

## 4. State Management Selection

Not all state needs to go into the global Store.

- Component internal state: useState / useLocalObservable
- Page-level state: MobX Store
- Global shared state: Root Store

## Summary

Writing maintainable code is a habit that requires long-term practice and reflection. I hope these experiences help you.
  `,
  coverImage:
    'https://via.placeholder.com/750x400/667eea/ffffff?text=Article+Cover',
  publishTime: 'Mar 26, 2024 10:00',
  author: {
    id: 'author-001',
    name: 'Frontend Developer',
    avatar: 'https://via.placeholder.com/80x80/f5f5f5/666?text=AV',
    bio: 'Passionate about technology, sharing and growing',
  },
  stats: {
    readCount: 1234,
    likeCount: 89,
    commentCount: 23,
    collectCount: 45,
  },
  tags: [
    { id: 'tag-1', name: 'React' },
    { id: 'tag-2', name: 'Frontend' },
    { id: 'tag-3', name: 'Best Practices' },
  ],
  isCollected: false,
  isLiked: false,
};
