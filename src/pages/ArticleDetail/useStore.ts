import { useLocalObservable } from 'mobx-react';
import { MOCK_ARTICLE_DETAIL } from './mock';
import type { ArticleDetail } from './types';

/**
 * Store 接口定义
 */
export interface ArticleDetailStoreType {
  article: ArticleDetail;

  // Actions
  toggleLike: () => void;
  toggleCollect: () => void;
}

type UseArticleDetailStoreType = () => ArticleDetailStoreType;

const useArticleDetailStore: UseArticleDetailStoreType = () => {
  const store = useLocalObservable<ArticleDetailStoreType>(() => ({
    article: MOCK_ARTICLE_DETAIL,

    toggleLike: () => {
      store.article.isLiked = !store.article.isLiked;
      if (store.article.isLiked) {
        store.article.stats.likeCount += 1;
      } else {
        store.article.stats.likeCount -= 1;
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
