/**
 * Discover Home 模块状态管理
 * @description 使用 MobX 管理首页文章列表、分类标签等状态
 */

import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';

import { MOCK_ARTICLES } from './constant';
import type { ArticleItem } from './components/article-list-item/index';

export type HomeStoreType = {
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
  /** 加载文章列表数据 */
  fetchArticles: () => Promise<void>;
  /** 加载更多文章 */
  loadMoreArticles: () => Promise<void>;
};

export function useHomeStore(): HomeStoreType {
  const store = useLocalObservable<HomeStoreType>(() => ({
    activeCategoryId: 'all',
    articles: MOCK_ARTICLES,
    loading: false,
    hasMore: true,
    currentPage: 1,
    pageSize: 10,

    setActiveCategory(categoryId: string) {
      runInAction(() => {
        this.activeCategoryId = categoryId;
        this.resetPagination();
      });
    },

    setArticles(articles: ArticleItem[]) {
      runInAction(() => {
        this.articles = articles;
      });
    },

    appendArticles(articles: ArticleItem[]) {
      runInAction(() => {
        this.articles.push(...articles);
        this.currentPage += 1;
      });
    },

    setLoading(loading: boolean) {
      runInAction(() => {
        this.loading = loading;
      });
    },

    setHasMore(hasMore: boolean) {
      runInAction(() => {
        this.hasMore = hasMore;
      });
    },

    resetPagination() {
      runInAction(() => {
        this.currentPage = 1;
        this.hasMore = true;
      });
    },

    toggleLike(articleId: string) {
      runInAction(() => {
        const article = this.articles.find(item => item.id === articleId);
        if (article) {
          article.isLiked = !article.isLiked;
          article.likes += article.isLiked ? 1 : -1;
        }
      });
    },

    async fetchArticles(): Promise<void> {
      this.setLoading(true);
      try {
        // TODO: 调用 API 获取文章列表
        // const response = await articleApi.getList({
        //   page: this.currentPage,
        //   pageSize: this.pageSize,
        //   categoryId: this.activeCategoryId,
        // });
        // this.setArticles(response.list);
        // this.setHasMore(response.hasMore);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('加载文章列表失败:', error);
      } finally {
        this.setLoading(false);
      }
    },

    async loadMoreArticles(): Promise<void> {
      if (this.loading || !this.hasMore) return;

      try {
        // TODO: 调用 API 加载更多文章
        // const response = await articleApi.getList({
        //   page: this.currentPage + 1,
        //   pageSize: this.pageSize,
        //   categoryId: this.activeCategoryId,
        // });
        // this.appendArticles(response.list);
        // this.setHasMore(response.hasMore);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('加载更多文章失败:', error);
      }
    },
  }));

  return store;
}
