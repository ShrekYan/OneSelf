import { useLocalObservable } from 'mobx-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api';
import { articleApi } from '@/api/article';
import type { ArticleDetail } from './constant';
import { mockArticleDetail } from './constant';
import type { ToggleLikeResponse } from '@/api/article';

export interface DetailStore {
  loading: boolean;
  article: ArticleDetail | null;
  isLiked: boolean;
  isCollected: boolean;
  likeLoading: boolean;
  setLoading: (state: boolean) => void;
  setArticle: (data: ArticleDetail) => void;
  toggleLike: () => Promise<void>;
  toggleCollect: () => void;
  fetchArticleDetail: (id: string) => Promise<void>;
}

export function useDetailStore() {
  const { id } = useParams<{ id: string }>();
  const store = useLocalObservable<DetailStore>(() => ({
    loading: true,
    article: null,
    isLiked: false,
    isCollected: false,
    likeLoading: false,

    setLoading: (state: boolean): void => {
      store.loading = state;
    },

    setArticle: (data: ArticleDetail): void => {
      store.article = data;
      store.isLiked = data.isLiked ?? false;
      store.isCollected = data.isCollected ?? false;
      console.log(store.isLiked);
    },

    toggleLike: async (): Promise<void> => {
      console.log('[toggleLike] enter', {
        hasArticle: !!store.article,
        likeLoading: store.likeLoading,
        loading: store.loading,
      });
      if (!store.article || store.likeLoading) {
        console.log('[toggleLike] return early due to guard check');
        return;
      }
      store.likeLoading = true;
      try {
        const response: ToggleLikeResponse = await api.article.toggleLike({
          articleId: store.article.id,
        });
        console.log('[toggleLike] response', response);
        // 以后端返回数据为准，保证数据一致性
        store.isLiked = response.isLiked;
        if (store.article) {
          store.article.isLiked = response.isLiked;
          store.article.likes = response.likes;
        }
      } catch (error) {
        console.error('[toggleLike] error', error);
        // 错误由 API 拦截器全局处理（Toast 提示）
        // 网络失败时状态保持不变，用户可重试
      } finally {
        console.log('[toggleLike] finally, set likeLoading = false');
        store.likeLoading = false;
      }
    },

    toggleCollect: (): void => {
      store.isCollected = !store.isCollected;
      // TODO: 后续对接收藏接口
      if (store.article) {
        store.article.isCollected = store.isCollected;
      }
    },

    fetchArticleDetail: async (articleId: string): Promise<void> => {
      console.log('[fetchArticleDetail] start', articleId);
      store.setLoading(true);
      try {
        const data = await articleApi.getArticleDetail({ id: articleId });
        console.log('[fetchArticleDetail] success', data);
        store.setArticle(data);
      } catch (error) {
        console.error('[fetchArticleDetail] error', error);
        // 加载失败使用 mock 数据 fallback
        store.setArticle(mockArticleDetail);
      } finally {
        console.log('[fetchArticleDetail] finally, set loading = false');
        store.setLoading(false);
      }
    },
  }));

  useEffect(() => {
    if (id) {
      store.fetchArticleDetail(id);
    } else {
      // 没有 id 时使用 mock 数据
      store.setLoading(false);
      store.setArticle(mockArticleDetail);
    }
  }, [id]);

  return store;
}
