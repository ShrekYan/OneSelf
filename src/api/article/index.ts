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
};
