/**
 * 文章 / 分类相关 API 接口
 * @description 文章分类、文章列表相关接口
 */
import type { ArticleCategory } from '@/types/article-category';
import type { ArticleItem } from '@/types/article';
import { api } from '@/api';

/**
 * 获取分类列表响应
 */
export interface CategoryListResponse {
  list: ArticleCategory[];
}

/**
 * 获取文章列表请求参数
 */
export interface ArticleListParams {
  page: number;
  pageSize: number;
  authorId?: string;
  categoryId?: string;
  keyword?: string;
}

/**
 * 获取文章列表响应
 */
export interface ArticleListResponse {
  list: ArticleItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 特色文章项（与后端 FeaturedArticleItemDto 完全对应）
 */
export interface FeaturedArticleItem {
  id: string;
  title: string;
  summary?: string;
  coverUrl?: string;
  category: {
    id: string;
    name: string;
  };
  authorId: string;
  authorName?: string;
  authorAvatar?: string;
  tags: string[];
  views: number;
  likes: number;
  commentsCount: number;
  publishedAt: string;
  isTop?: boolean;
  readTime: number; // 必填，特色文章特有
}

/**
 * 获取特色文章列表响应
 */
export interface FeaturedArticleListResponse {
  list: FeaturedArticleItem[];
}

/**
 * 获取文章详情请求参数
 */
export interface GetArticleDetailRequest {
  id: string;
}

/**
 * 文章详情内容块（与后端 ArticleDetailDto 完全对应）
 */
export interface ArticleContentBlock {
  type: 'heading' | 'paragraph' | 'quote' | 'image' | 'list';
  level?: number;
  text?: string;
  imageUrl?: string;
  items?: string[];
}

/**
 * 作者信息（与后端 ArticleDetailDto 完全对应）
 */
export interface ArticleAuthorInfo {
  name: string;
  avatar: string;
}

/**
 * 获取文章详情响应（与后端 ArticleDetailDto 完全对应）
 */
export interface ArticleDetailResponse {
  id: string;
  title: string;
  summary?: string;
  coverUrl?: string;
  category: {
    id: string;
    name: string;
  };
  author: ArticleAuthorInfo;
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

/**
 * 文章 / 分类 API 模块
 */
export const articleApi = {
  /**
   * 获取全部分类列表
   */
  listCategories: async (): Promise<CategoryListResponse> => {
    return await api.get('/api/v1/category/list');
  },

  /**
   * 获取文章列表（支持分页、作者筛选、分类筛选）
   */
  listArticles: async (
    params: ArticleListParams,
  ): Promise<ArticleListResponse> => {
    return await api.get('/api/v1/article/list', { params });
  },

  /**
   * 获取特色文章轮播列表（置顶文章）
   */
  getFeaturedArticles: async (): Promise<FeaturedArticleListResponse> => {
    return await api.get('/api/v1/article/featured');
  },

  /**
   * 获取文章详情
   */
  getArticleDetail: async (
    params: GetArticleDetailRequest,
  ): Promise<ArticleDetailResponse> => {
    return await api.get('/api/v1/article/detail', { params });
  },
};
