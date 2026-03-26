/**
 * Explore 探索模块常量定义
 */

export interface Category {
  id: string;
  name: string;
  articleCount: number;
  imageUrl?: string;
}

// ==================== 分类数据 ====================
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    articleCount: 142,
    imageUrl:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    articleCount: 284,
    imageUrl:
      'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=300&fit=crop',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    articleCount: 95,
    imageUrl:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
  },
  {
    id: 'life-culture',
    name: 'Life & Culture',
    articleCount: 213,
  },
  {
    id: 'web3-crypto',
    name: 'Web3 & Crypto',
    articleCount: 87,
  },
  {
    id: 'startups',
    name: 'Startups',
    articleCount: 164,
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
  },
  {
    id: 'frontend',
    name: 'Frontend',
    articleCount: 326,
    imageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
  },
  {
    id: 'backend',
    name: 'Backend',
    articleCount: 198,
    imageUrl:
      'https://images.unsplash.com/photo-1558498352-06930131459d?w=400&h=300&fit=crop',
  },
  {
    id: 'mobile',
    name: 'Mobile Dev',
    articleCount: 127,
    imageUrl:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
  },
  {
    id: 'devops',
    name: 'DevOps',
    articleCount: 89,
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  },
];

// ==================== 热门搜索关键词 ====================
export const HOT_SEARCH_KEYWORDS: string[] = [
  'React 19',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'MobX',
  '性能优化',
  '设计系统',
  '微前端',
];
