/**
 * Home 页面常量定义
 * @description 包含分类配置、文章数据类型定义、模拟数据
 */

// ==================== 分类标签配置 ====================
/** 分类标签列表 */
export const CATEGORY_TABS = [
  { id: 'for-you', name: 'For You' },
  { id: 'following', name: 'Following' },
  { id: 'design', name: 'Design' },
  { id: 'tech', name: 'Tech' },
  { id: 'culture', name: 'Culture' },
];

/**
 * 分类标签项
 */
export interface CategoryTab {
  /** 分类唯一 ID */
  id: string;
  /** 分类显示名称 */
  name: string;
}

// ==================== 分页配置 ====================
/** 每页加载文章数量 */
export const PAGE_SIZE = 10;

// ==================== 页面配置 ====================
/** 页面标题 */
export const PAGE_TITLE = 'Home';

// ==================== 数据类型定义 ====================
/**
 * 文章作者信息
 */
export interface ArticleAuthor {
  /** 作者 ID */
  id: string;
  /** 作者昵称 */
  name: string;
  /** 作者头像 URL */
  avatar: string;
}

/**
 * 文章数据结构
 */
export interface ArticleItem {
  /** 文章唯一 ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章描述/摘要 */
  description: string;
  /** 封面图片 URL */
  coverImage: string;
  /** 作者信息 */
  author: ArticleAuthor;
  /** 发布日期 */
  publishDate: string;
  /** 预计阅读时间（分钟） */
  readTime: number;
  /** 点赞数量 */
  likes: number;
  /** 评论数量 */
  comments: number;
  /** 当前用户是否已点赞 */
  isLiked: boolean;
  /** 当前用户是否已收藏 */
  isSaved: boolean;
  /** 文章标签列表 */
  tags: string[];
  /** 是否为特色文章（大图展示） */
  isFeatured: boolean;
}

export const MOCK_FEATURED_ARTICLE: ArticleItem = {
  id: 'featured-1',
  title: 'The Future of Mobile Interface Design in 2024',
  description:
    'Explore the cutting-edge technologies and methodologies shaping the future of mobile interface design in this comprehensive overview.',
  coverImage:
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
  author: {
    id: 'author-1',
    name: 'Sarah Drasner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahDrasner',
  },
  publishDate: 'Oct 24',
  readTime: 5,
  likes: 423,
  comments: 56,
  isLiked: false,
  isSaved: false,
  tags: ['DESIGN'],
  isFeatured: true,
};

export const MOCK_ARTICLE_LIST: ArticleItem[] = [
  {
    id: 'article-1',
    title: 'Understanding React Server Components',
    description: 'A deep dive into how RSCs are changing the React ecosystem.',
    coverImage:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    author: {
      id: 'author-2',
      name: 'Dan Abramov',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DanAbramov',
    },
    publishDate: '',
    readTime: 8,
    likes: 856,
    comments: 42,
    isLiked: false,
    isSaved: false,
    tags: [],
    isFeatured: false,
  },
  {
    id: 'article-2',
    title: 'Minimalist Workspaces setup for Developers',
    description:
      'Create a clean and focused development environment with these simple tips.',
    coverImage:
      'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=300&fit=crop',
    author: {
      id: 'author-3',
      name: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    publishDate: '',
    readTime: 4,
    likes: 156,
    comments: 23,
    isLiked: false,
    isSaved: false,
    tags: [],
    isFeatured: false,
  },
  {
    id: 'article-3',
    title: 'Mastering Typography in Digital Products',
    description: 'Typography is 95% of web design. Here is how to master it.',
    coverImage:
      'https://images.unsplash.com/photo-1576267620953-102876f21f6d?w=400&h=300&fit=crop',
    author: {
      id: 'author-4',
      name: 'Gary Hustwit',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GaryHustwit',
    },
    publishDate: '',
    readTime: 6,
    likes: 567,
    comments: 28,
    isLiked: false,
    isSaved: false,
    tags: [],
    isFeatured: false,
  },
  {
    id: 'article-4',
    title: 'The Art of Writing Clean Code',
    description:
      'Strategies and principles for writing code that is easy to read and maintain.',
    coverImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    author: {
      id: 'author-5',
      name: 'Sarah Drasner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahDrasner',
    },
    publishDate: '',
    readTime: 10,
    likes: 1024,
    comments: 156,
    isLiked: false,
    isSaved: false,
    tags: [],
    isFeatured: false,
  },
];
