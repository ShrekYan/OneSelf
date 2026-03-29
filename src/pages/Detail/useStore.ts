import { useLocalObservable } from 'mobx-react';
import { ARTICLE_DETAIL, type ArticleDetail } from './constant';

export interface Detail1StoreType {
  loading: boolean;
  articleDetail: ArticleDetail;
  setLoading: (state: boolean) => void;
}

export const useDetail1Store = (): Detail1StoreType => {
  const store = useLocalObservable<Detail1StoreType>(() => ({
    loading: false,
    articleDetail: ARTICLE_DETAIL,
    setLoading: function (state: boolean) {
      this.loading = state;
    },
  }));

  return store;
};
