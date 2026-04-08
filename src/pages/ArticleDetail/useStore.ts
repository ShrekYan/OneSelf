import { useLocalObservable } from 'mobx-react';
import api from '@/api';
import { MOCK_ARTICLE_DETAIL } from './mock';
import type { ArticleDetail } from './types';
import type { ToggleLikeResponse } from '@/api/article';

/**
 * Store 接口定义
 */
export interface ArticleDetailStoreType {
  article: ArticleDetail;
  likeLoading: boolean;

  // Actions
  toggleLike: () => Promise<void>;
  toggleCollect: () => void;
}

type UseArticleDetailStoreType = () => ArticleDetailStoreType;

const useArticleDetailStore: UseArticleDetailStoreType = () => {
  const store = useLocalObservable<ArticleDetailStoreType>(() => ({
    article: MOCK_ARTICLE_DETAIL,
    likeLoading: false,

    toggleLike: async (): Promise<void> => {
      if (store.likeLoading) return;
      store.likeLoading = true;
      try {
        const response: ToggleLikeResponse = await api.article.toggleLike({
          articleId: store.article.id,
        });
        // 以后端返回数据为准，保证数据一致性
        store.article.isLiked = response.isLiked;
        store.article.stats.likeCount = response.likes;
      } catch {
        // 错误由 API 拦截器全局处理（Toast 提示）
        // 网络失败时状态保持不变，用户可重试
      } finally {
        store.likeLoading = false;
      }
    },

    toggleCollect: () => {
      store.article.isCollected = !store.article.isCollected;
      if (store.article.isCollected) {
        store.article.stats.collectCount += 1;
      } else {
        store.article.stats.collectCount -= 1;
      }
    },
  }));

  return store;
};

export default useArticleDetailStore;
