import { useLocalObservable } from 'mobx-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articleApi } from '@/api/article';
import type { ArticleDetail } from './constant';
import { mockArticleDetail } from './constant';

export interface DetailStore {
  loading: boolean;
  article: ArticleDetail | null;
  isLiked: boolean;
  isCollected: boolean;
  setLoading: (state: boolean) => void;
  setArticle: (data: ArticleDetail) => void;
  toggleLike: () => void;
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

    setLoading: (state: boolean): void => {
      store.loading = state;
    },

    setArticle: (data: ArticleDetail): void => {
      store.article = data;
      store.isLiked = data.isLiked ?? false;
      store.isCollected = data.isCollected ?? false;
    },

    toggleLike: (): void => {
      store.isLiked = !store.isLiked;
      // TODO: 后续对接点赞接口
      if (store.article) {
        store.article.isLiked = store.isLiked;
        store.article.likes += store.isLiked ? 1 : -1;
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
      store.setLoading(true);
      try {
        const data = await articleApi.getArticleDetail({ id: articleId });
        store.setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article detail:', error);
        // 加载失败使用 mock 数据 fallback
        store.setArticle(mockArticleDetail);
      } finally {
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
