/**
 * About 页面模拟数据
 */

import type { Feature, Link, AppInfo } from './types';

// ==================== 功能项数据 ====================
export const FEATURES: Feature[] = [
  {
    id: 'feature-1',
    title: 'Discover Quality Content',
    description:
      'Curated high-quality articles, read interesting content anytime anywhere',
    iconKey: 'discover',
  },
  {
    id: 'feature-2',
    title: 'Personalized Recommendations',
    description:
      'Intelligently recommend content based on your reading interests',
    iconKey: 'recommend',
  },
  {
    id: 'feature-3',
    title: 'Bookmark & Sync',
    description:
      'Bookmark favorite articles, sync reading progress across devices',
    iconKey: 'bookmark',
  },
  {
    id: 'feature-4',
    title: 'Clean Reading Experience',
    description: 'Minimalist design, focused reading, with dark mode support',
    iconKey: 'theme',
  },
];

// ==================== Link Items Data ====================
export const LINKS: Link[] = [
  {
    id: 'website',
    title: 'Official Website',
    iconKey: 'website',
  },
  {
    id: 'github',
    title: 'GitHub Repository',
    iconKey: 'github',
  },
  {
    id: 'email',
    title: 'Contact Us',
    iconKey: 'email',
  },
  {
    id: 'feedback',
    title: 'Feedback',
    iconKey: 'feedback',
  },
];

// ==================== App Basic Information ====================
export const APP_INFO: AppInfo = {
  name: 'Discover',
  version: 'v1.0.0',
  description:
    'Discover is a mobile reading platform focused on discovering quality content. We are committed to providing users with a clean and comfortable reading experience, allowing you to find more valuable content in your fragmented time, broaden your horizons and expand your knowledge.',
  copyright: '© 2025 Discover. All rights reserved.',
};
