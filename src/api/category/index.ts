/**
 * 分类相关 API 接口
 * @description 热门搜索关键词等分类相关接口
 */
import { api } from '@/api';
import type { RequestConfig } from '@/api/core/types';
import type { HotSearchItem } from '@/pages/Discover/routes/search/constant';

/**
 * 获取热门关键词响应
 */
export interface HotKeywordsResponse {
  keywords: HotSearchItem[];
}

/**
 * 分类 API 模块
 */
export const categoryApi = {
  /**
   * 获取热门搜索关键词
   * @description 获取当前热门搜索列表，启用缓存（5分钟）
   */
  getHotKeywords: async (): Promise<HotSearchItem[]> => {
    // 注意：拦截器会自动解包，返回的是 data.data 而不是整个 response
    const response = (await api.get<HotKeywordsResponse>(
      '/api/v1/category/hot-keywords',
      {
        cache: true,
        cacheTime: 5 * 60 * 1000, // 缓存5分钟
      } as RequestConfig,
    )) as unknown as HotKeywordsResponse;
    // 响应拦截器已解包，直接返回 keywords
    return response.keywords;
  },
};
