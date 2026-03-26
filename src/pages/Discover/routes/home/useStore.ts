/**
 * Discover Home 模块状态管理
 * @description 使用 MobX 管理首页文章列表、分类标签等状态
 */

import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';

import type { ArticleItem } from './components/article-list-item/index';

export interface HomeStoreType {
  /** 当前选中的分类ID */
  activeCategoryId: string;
  /** 文章列表 */
  articles: ArticleItem[];
  /** 加载状态 */
  loading: boolean;
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 当前页码 */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;

  /** 设置当前选中分类 */
  setActiveCategory: (categoryId: string) => void;
  /** 设置文章列表 */
  setArticles: (articles: ArticleItem[]) => void;
  /** 追加文章到列表（加载更多） */
  appendArticles: (articles: ArticleItem[]) => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置是否还有更多 */
  setHasMore: (hasMore: boolean) => void;
  /** 重置分页 */
  resetPagination: () => void;
  /** 切换文章点赞状态 */
  toggleLike: (articleId: string) => void;
}

type UseHomeStoreType = () => HomeStoreType;

const useHomeStore: UseHomeStoreType = () => {
  const store = useLocalObservable<HomeStoreType>(() => ({
    activeCategoryId: 'all',
    articles: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
    pageSize: 10,

    setActiveCategory(categoryId: string) {
      runInAction(() => {
        store.activeCategoryId = categoryId;
        store.resetPagination();
      });
    },

    setArticles(articles: ArticleItem[]) {
      runInAction(() => {
        store.articles = articles;
      });
    },

    appendArticles(articles: ArticleItem[]) {
      runInAction(() => {
        store.articles.push(...articles);
        store.currentPage += 1;
      });
    },

    setLoading(loading: boolean) {
      runInAction(() => {
        store.loading = loading;
      });
    },

    setHasMore(hasMore: boolean) {
      runInAction(() => {
        store.hasMore = hasMore;
      });
    },

    resetPagination() {
      runInAction(() => {
        store.currentPage = 1;
        store.hasMore = true;
      });
    },

    toggleLike(articleId: string) {
      runInAction(() => {
        const article = store.articles.find(item => item.id === articleId);
        if (article) {
          article.isLiked = !article.isLiked;
          article.likes += article.isLiked ? 1 : -1;
        }
      });
    },
  }));

  return store;
};

export default useHomeStore;
