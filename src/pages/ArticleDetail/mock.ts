/**
 * 文章详情页面 Mock 数据
 */

import type { ArticleDetail } from './types';

// ==================== 示例文章数据 ====================

export const MOCK_ARTICLE_DETAIL: ArticleDetail = {
  id: 'article-001',
  title: '如何写出可维护的 React 组件 - 前端最佳实践分享',
  summary:
    '本文分享了一些在大型项目中编写可维护 React 组件的实践经验，从组件设计、目录结构到状态管理，全方位提升代码质量。',
  content: `
# 如何写出可维护的 React 组件

在大型前端项目中，代码的可维护性比短期的开发速度更加重要。本文将分享一些我在实际项目中总结的最佳实践。

## 1. 组件拆分原则

一个组件只做一件事。如果一个组件超过了 300 行，就应该考虑拆分。

### 拆分的信号：
- 组件中有多个独立的功能区块
- 某个部分可以被复用
- 注释把代码分成了多个部分

## 2. 目录结构规范

好的目录结构能让新来的同事一眼就找到需要修改的地方。我们项目现在使用的结构是：

\`\`\`
ComponentName/
├── index.tsx           # 组件代码
└── index.module.scss  # 组件样式
\`\`\`

每个组件独立自治，包含自己的逻辑和样式，修改的时候只需要进入这个文件夹即可。

## 3. TypeScript 类型安全

不要滥用 any，给所有的 Props 和数据都加上正确的类型。类型系统是最好的文档。

### 推荐做法：
- 使用 interface 定义组件 Props
- 使用联合类型代替 enum
- 利用 TypeScript 的类型推断减少冗余声明

## 4. 状态管理的选择

不是所有状态都需要放到全局 Store。

- 组件内部状态：useState / useLocalObservable
- 页面级状态：MobX Store
- 全局共享状态：Root Store

## 总结

写出可维护的代码是一种习惯，需要长期的练习和总结。希望这些经验对你有所帮助。
  `,
  coverImage:
    'https://via.placeholder.com/750x400/667eea/ffffff?text=Article+Cover',
  publishTime: '2024-03-26 10:00',
  author: {
    id: 'author-001',
    name: '前端开发者',
    avatar: 'https://via.placeholder.com/80x80/f5f5f5/666?text=AV',
    bio: '热爱技术，分享成长',
  },
  stats: {
    readCount: 1234,
    likeCount: 89,
    commentCount: 23,
    collectCount: 45,
  },
  tags: [
    { id: 'tag-1', name: 'React' },
    { id: 'tag-2', name: '前端' },
    { id: 'tag-3', name: '最佳实践' },
  ],
  isCollected: false,
  isLiked: false,
};
