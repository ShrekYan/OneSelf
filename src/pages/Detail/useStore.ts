import { useLocalObservable } from 'mobx-react';
import { useEffect } from 'react';
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
}

export function useDetailStore() {
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
      store.isLiked = data.stats.isLiked;
      store.isCollected = data.stats.isFavorited;
    },

    toggleLike: (): void => {
      store.isLiked = !store.isLiked;
    },

    toggleCollect: (): void => {
      store.isCollected = !store.isCollected;
    },
  }));

  useEffect(() => {
    // 模拟加载数据
    store.setLoading(false);
    store.setArticle(mockArticleDetail);
  }, []);

  return store;
}
