/**
 * ArticleList 页面状态管理
 * @description 使用 MobX 管理文章列表、分类标签等状态，包含完整点赞功能
 */

import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';

import api from '@/api';
import { useGlobalStore } from '@/store';
import type { ArticleItem as ApiArticleItem } from '@/types/article';
import type { CategoryItem, ArticleItem } from './constant';

// 文章列表项类型 = API 返回类型 + 本地点赞状态
export type ArticleListItemType = ArticleItem & {
  isLiked?: boolean;
};

export type ArticleListStore = ReturnType<typeof useArticleListStore>;

export function useArticleListStore() {
  const rootStore = useGlobalStore();

  const store = useLocalObservable(() => ({
    /** 当前选中分类 */
    selectedCategoryId: 'all',

    /** 加载状态 */
    loading: false,

    /** 全部分类 */
    categories: [] as CategoryItem[],

    /** 全部文章原始数据 */
    allArticles: [] as ArticleListItemType[],

    /** 分页信息 */
    page: 1,
    pageSize: 5,
    total: 0,
    hasMore: false,
    currentPage: 0,
    loadingMore: false,

    /** 当前用户点赞过的文章ID集合 */
    likedArticleIds: new Set<string>(),

    // Actions
    setSelectedCategoryId(categoryId: string): void {
      this.selectedCategoryId = categoryId;
    },

    setLoading(state: boolean): void {
      this.loading = state;
    },

    setCategories(categories: CategoryItem[]): void {
      this.categories = categories;
    },

    setArticles(articles: ArticleListItemType[]): void {
      this.allArticles = articles;
    },

    /**
     * 切换文章点赞状态
     * @param articleId - 文章ID
     */
    toggleLike(articleId: string): void {
      runInAction(() => {
        const article = this.allArticles.find(item => item.id === articleId);
        if (article) {
          article.isLiked = !article.isLiked;
          article.likes += article.isLiked ? 1 : -1;
          if (article.isLiked) {
            this.likedArticleIds.add(articleId);
          } else {
            this.likedArticleIds.delete(articleId);
          }
        }
      });
    },

    /** 重置分页状态（切换分类时调用） */
    resetPagination(): void {
      this.currentPage = 1;
      this.allArticles = [];
      this.hasMore = false;
    },

    /** 设置加载更多状态 */
    setLoadingMore(loading: boolean): void {
      this.loadingMore = loading;
    },

    /** 设置是否还有更多数据 */
    setHasMore(hasMore: boolean): void {
      this.hasMore = hasMore;
    },

    /**
     * 获取当前用户点赞列表，返回数据不更新状态
     * @returns 点赞的文章ID数组，未登录返回 null
     */
    async fetchUserLikeList(): Promise<string[] | null> {
      const userId = rootStore.app.userInfo?.id;
      if (!userId) return null;

      const response = await api.article.getUserLikeList();
      return response.articleIds;
    },

    /**
     * 将点赞状态批量应用到文章列表
     */
    applyLikeStatusToArticles(): void {
      runInAction(() => {
        this.allArticles = this.allArticles.map(article => ({
          ...article,
          isLiked: this.likedArticleIds.has(article.id),
        }));
        console.log(this.allArticles);
      });
    },

    /** 加载下一页文章 */
    async fetchMoreArticles(): Promise<void> {
      if (!this.hasMore || this.loadingMore) return;
      try {
        this.setLoadingMore(true);
        const nextPage = this.currentPage + 1;
        const params: { page: number; pageSize: number; categoryId?: string } = {
          page: nextPage,
          pageSize: this.pageSize,
        };
        if (this.selectedCategoryId !== 'all') {
          params.categoryId = this.selectedCategoryId;
        }
        const res = await api.article.listArticles(params);

        const adaptedArticles: ArticleListItemType[] = res.list.map(
          (apiArticle: ApiArticleItem) => ({
            id: apiArticle.id,
            title: apiArticle.title,
            summary: apiArticle.summary || '',
            coverUrl: apiArticle.coverUrl,
            categoryId: apiArticle.category.id,
            authorName: apiArticle.authorName || 'Unknown',
            authorAvatar: apiArticle.authorAvatar,
            readTime: apiArticle.readTime ?? undefined,
            likes: apiArticle.likes || 0,
            commentsCount: apiArticle.commentsCount || 0,
            isLiked: false,
          }),
        );

        runInAction(() => {
          this.allArticles = [...this.allArticles, ...adaptedArticles];
          this.currentPage = nextPage;
          this.setHasMore(res.hasMore);
        });

        this.applyLikeStatusToArticles();
      } catch (error) {
        console.error('加载更多文章失败:');
        if (error instanceof Error) {
          console.error(error.message);
        } else if (typeof error === 'string') {
          console.error(error);
        }
      } finally {
        this.setLoadingMore(false);
      }
    },

    /** 获取分类列表 */
    async fetchCategories(): Promise<void> {
      try {
        this.setLoading(true);
        const res = await api.article.listCategories();
        const categoriesWithAll: CategoryItem[] = [
          { id: 'all', name: '全部' },
          ...res.list.map(item => ({
            id: item.id,
            name: item.name,
          })),
        ];
        this.setCategories(categoriesWithAll);
      } catch (error) {
        console.error('获取分类列表失败:');
        if (error instanceof Error) {
          console.error(error.message);
        } else if (typeof error === 'string') {
          console.error(error);
        }
      } finally {
        this.setLoading(false);
      }
    },

    /** 获取文章列表（根据当前选中分类筛选） */
    async fetchArticles(): Promise<void> {
      try {
        this.setLoading(true);
        this.resetPagination();
        const params: { page: number; pageSize: number; categoryId?: string } = {
          page: 1,
          pageSize: this.pageSize,
        };
        if (this.selectedCategoryId !== 'all') {
          params.categoryId = this.selectedCategoryId;
        }
        const res = await api.article.listArticles(params);

        const adaptedArticles: ArticleListItemType[] = res.list.map(
          (apiArticle: ApiArticleItem) => ({
            id: apiArticle.id,
            title: apiArticle.title,
            summary: apiArticle.summary || '',
            coverUrl: apiArticle.coverUrl,
            categoryId: apiArticle.category.id,
            authorName: apiArticle.authorName || 'Unknown',
            authorAvatar: apiArticle.authorAvatar,
            readTime: apiArticle.readTime ?? undefined,
            likes: apiArticle.likes || 0,
            commentsCount: apiArticle.commentsCount || 0,
            isLiked: false,
          }),
        );
        this.setArticles(adaptedArticles);
        this.setHasMore(res.hasMore);
      } catch (error) {
        console.error('获取文章列表失败:');
        if (error instanceof Error) {
          console.error(error.message);
        } else if (typeof error === 'string') {
          console.error(error);
        }
      } finally {
        this.setLoading(false);
      }
    },

    /**
     * 加载页面所有初始化数据（并发请求，统一结果处理）
     */
    async fetchInitialData(): Promise<void> {
      runInAction(() => {
        this.likedArticleIds = new Set();
      });

      const userId = rootStore.app.userInfo?.id;

      const results = await Promise.allSettled([
        this.fetchArticles(),
        this.fetchCategories(),
        ...(userId ? [this.fetchUserLikeList()] : []),
      ]);

      if (userId && results.length >= 3) {
        const likeListResult = results[2];
        if (
          likeListResult.status === 'fulfilled' &&
          likeListResult.value !== null
        ) {
          runInAction(() => {
            this.likedArticleIds = new Set(likeListResult.value);
          });
        } else if (likeListResult.status === 'rejected') {
          console.error('获取用户点赞列表失败:', likeListResult.reason);
        }
      }

      this.applyLikeStatusToArticles();
    },
  }));

  return store;
}
