/**
 * Discover Home 模块状态管理
 * @description 使用 MobX 管理首页文章列表、分类标签等状态
 */

import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';

import api from '@/api';
import { useGlobalStore } from '@/store';
import type { ArticleItem as ApiArticleItem } from '@/types/article';
import type { FeaturedArticleItem as ApiFeaturedArticleItem } from '@/api/article';
import type { HotSearchItem } from '@/pages/Discover/routes/search/constant';
import type { FeaturedArticleItem } from './constant';

// 文章列表项类型 = API 返回类型 + 本地点赞状态
export type ArticleItem = ApiArticleItem & {
  isLiked?: boolean;
};

export type HomeStoreType = {
  /** 当前选中的分类ID */
  activeCategoryId: string;
  /** 文章列表 */
  articles: ArticleItem[];
  /** 特色文章轮播列表 */
  featuredArticles: FeaturedArticleItem[];
  /** 热门分类标签列表（从 API 获取） */
  categories: HotSearchItem[];
  /** 加载状态 */
  loading: boolean;
  /** 分类加载状态 */
  categoriesLoading: boolean;
  /** 当前用户点赞过的文章ID集合 */
  likedArticleIds: Set<string>;

  /** 设置当前选中分类 */
  setActiveCategory: (categoryId: string) => void;
  /** 设置文章列表 */
  setArticles: (articles: ArticleItem[]) => void;
  /** 设置分类列表 */
  setCategories: (categories: HotSearchItem[]) => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置分类加载状态 */
  setCategoriesLoading: (loading: boolean) => void;
  /** 切换文章点赞状态 */
  toggleLike: (articleId: string) => void;
  /** 获取当前用户点赞列表，返回数据不更新状态 */
  fetchUserLikeList: () => Promise<string[] | null>;
  /** 文章列表获取后，应用点赞状态 */
  applyLikeStatusToArticles: () => void;
  /** 加载首页所有初始化数据（并发请求，统一结果处理，使用 Promise.allSettled 容错） */
  fetchInitialData: () => Promise<void>;
  /** 加载文章列表数据，返回数据不更新状态 */
  fetchArticles: () => Promise<ArticleItem[]>;
  /** 加载特色文章数据，返回数据不更新状态 */
  fetchFeaturedArticles: () => Promise<FeaturedArticleItem[]>;
  /** 加载热门分类数据，返回数据不更新状态 */
  fetchCategories: () => Promise<HotSearchItem[]>;
};

export function useHomeStore(): HomeStoreType {
  const rootStore = useGlobalStore();

  const store = useLocalObservable<HomeStoreType>(() => ({
    activeCategoryId: '',
    articles: [],
    featuredArticles: [],
    categories: [],
    loading: false,
    categoriesLoading: false,
    likedArticleIds: new Set(),

    setActiveCategory(categoryId: string) {
      runInAction(() => {
        this.activeCategoryId = categoryId;
      });
    },

    setCategories(categories: HotSearchItem[]) {
      runInAction(() => {
        this.categories = categories;
      });
    },

    setCategoriesLoading(loading: boolean) {
      runInAction(() => {
        this.categoriesLoading = loading;
      });
    },

    setArticles(articles: ArticleItem[]) {
      runInAction(() => {
        this.articles = articles;
      });
    },

    setLoading(loading: boolean) {
      runInAction(() => {
        this.loading = loading;
      });
    },

    toggleLike(articleId: string) {
      runInAction(() => {
        const article = this.articles.find(item => item.id === articleId);
        if (article) {
          article.isLiked = !article.isLiked;
          article.likes += article.isLiked ? 1 : -1;
          // 同步更新 likedArticleIds 集合
          if (article.isLiked) {
            this.likedArticleIds.add(articleId);
          } else {
            this.likedArticleIds.delete(articleId);
          }
        }
      });
    },

    async fetchArticles(): Promise<ArticleItem[]> {
      this.setLoading(true);
      const response = await api.article.listArticles({
        page: 1,
        pageSize: 10,
        categoryId: this.activeCategoryId || undefined,
      });
      this.setArticles(response.list);
      this.setLoading(false);
      return response.list;
    },

    async fetchFeaturedArticles(): Promise<FeaturedArticleItem[]> {
      const response = await api.article.getFeaturedArticles();
      // 直接映射，只提取组件需要的字段
      return response.list.map((item: ApiFeaturedArticleItem) => ({
        id: item.id,
        category: item.category.name,
        title: item.title,
        authorName: item.authorName ?? 'Unknown',
        authorAvatar: item.authorAvatar ?? '',
        publishedAt: item.publishedAt,
        readTime: item.readTime,
        coverUrl: item.coverUrl ?? '',
      }));
    },

    async fetchCategories(): Promise<HotSearchItem[]> {
      this.setCategoriesLoading(true);
      const data = await api.category.getList();
      return data.list;
    },

    async fetchUserLikeList(): Promise<string[] | null> {
      const userId = rootStore.app.userInfo?.id;
      if (!userId) return null;

      const response = await api.article.getUserLikeList();
      return response.articleIds;
    },

    applyLikeStatusToArticles(): void {
      runInAction(() => {
        this.articles = this.articles.map(article => ({
          ...article,
          isLiked:
            this.likedArticleIds.has(article.id) ?? article.isLiked ?? false,
        }));
        console.log(this.articles);
      });
    },

    async fetchInitialData(): Promise<void> {
      // 修复：在获取数据前先清空旧的点赞状态，避免跨用户残留
      runInAction(() => {
        this.likedArticleIds = new Set();
      });

      const userId = rootStore.app.userInfo?.id;

      // 并发发起所有请求（包括用户点赞列表）
      const results = await Promise.allSettled([
        this.fetchArticles(),
        this.fetchFeaturedArticles(),
        this.fetchCategories(),
        ...(userId ? [this.fetchUserLikeList()] : []),
      ]);

      // 1. 处理文章列表
      const articlesResult = results[0];
      if (articlesResult.status === 'fulfilled') {
        this.setArticles(articlesResult.value);
      } else {
        console.error('加载文章列表失败:', articlesResult.reason);
      }

      // 2. 处理特色文章
      const featuredResult = results[1];
      if (featuredResult.status === 'fulfilled') {
        runInAction(() => {
          this.featuredArticles = featuredResult.value;
        });
      } else {
        console.error('加载特色文章失败:', featuredResult.reason);
      }

      // 3. 处理分类列表
      const categoriesResult = results[2];
      if (categoriesResult.status === 'fulfilled') {
        this.setCategories(categoriesResult.value);
      } else {
        console.error('加载热门分类失败:', categoriesResult.reason);
      }

      // 4. 处理用户点赞列表（如果有）
      if (userId && results.length >= 4) {
        const likeListResult = results[3];
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

      // 所有数据获取完成后，统一应用点赞状态到文章列表
      // 修复：无条件执行，确保空集合时也能清除所有 isLiked 标记
      this.applyLikeStatusToArticles();

      // 统一关闭 loading
      this.setLoading(false);
      this.setCategoriesLoading(false);
    },
  }));

  return store;
}
