/**
 * About 页面模拟数据
 */

import type { Feature, Link, AppInfo } from './types';

// ==================== 功能项数据 ====================
export const FEATURES: Feature[] = [
  {
    id: 'feature-1',
    title: '发现优质内容',
    description: '精选各类优质文章，随时随地阅读感兴趣的内容',
    iconKey: 'discover',
  },
  {
    id: 'feature-2',
    title: '个性化推荐',
    description: '基于你的阅读兴趣，智能推荐相关内容',
    iconKey: 'recommend',
  },
  {
    id: 'feature-3',
    title: '收藏与同步',
    description: '收藏喜欢的文章，多设备同步阅读进度',
    iconKey: 'bookmark',
  },
  {
    id: 'feature-4',
    title: '清新阅读体验',
    description: '简约设计，专注阅读，支持夜间模式',
    iconKey: 'theme',
  },
];

// ==================== 链接项数据 ====================
export const LINKS: Link[] = [
  {
    id: 'website',
    title: '官方网站',
    iconKey: 'website',
  },
  {
    id: 'github',
    title: 'GitHub 仓库',
    iconKey: 'github',
  },
  {
    id: 'email',
    title: '联系我们',
    iconKey: 'email',
  },
  {
    id: 'feedback',
    title: '意见反馈',
    iconKey: 'feedback',
  },
];

// ==================== 应用基本信息 ====================
export const APP_INFO: AppInfo = {
  name: 'Discover',
  version: 'v1.0.0',
  description:
    'Discover 是一个专注于发现优质内容的移动阅读平台。我们致力于为用户提供纯净、舒适的阅读体验，让你在碎片化的时间里发现更多有价值的内容，拓宽视野，增长知识。',
  copyright: '© 2025 Discover. All rights reserved.',
};
