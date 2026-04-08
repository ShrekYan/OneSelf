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
import type { CategoryItem } from '@/api/category';

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
  setCategories: (categories: CategoryItem[]) => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置分类加载状态 */
  setCategoriesLoading: (loading: boolean) => void;
  /** 切换文章点赞状态 */
  toggleLike: (articleId: string) => void;
  /** 获取当前用户点赞列表 */
  fetchUserLikeList: () => Promise<void>;
  /** 文章列表获取后，应用点赞状态 */
  applyLikeStatusToArticles: () => void;
  /** 加载首页所有初始化数据（并发请求，使用 Promise.allSettled 容错） */
  fetchInitialData: () => Promise<void>;
  /** 加载文章列表数据 */
  fetchArticles: () => Promise<void>;
  /** 加载特色文章数据 */
  fetchFeaturedArticles: () => Promise<void>;
  /** 加载热门分类数据 */
  fetchCategories: () => Promise<void>;
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

    async fetchArticles(): Promise<void> {
      this.setLoading(true);
      try {
        const response = await api.article.listArticles({
          page: 1,
          pageSize: 10,
          categoryId: this.activeCategoryId || undefined,
        });
        // 先设置文章列表
        this.setArticles(response.list);

        // 获取完文章列表后，自动应用点赞状态
        const userId = rootStore.app.userInfo?.id;
        if (userId) {
          // 如果已经有点赞列表，直接应用
          if (this.likedArticleIds.size > 0) {
            this.applyLikeStatusToArticles();
          } else {
            // 如果没有点赞列表，先获取再应用
            await this.fetchUserLikeList();
            this.applyLikeStatusToArticles();
          }
        }
      } catch (error) {
        console.error('加载文章列表失败:', error);
      } finally {
        this.setLoading(false);
      }
    },

    async fetchFeaturedArticles(): Promise<void> {
      try {
        const response = await api.article.getFeaturedArticles();
        runInAction(() => {
          // 直接映射，只提取组件需要的字段
          this.featuredArticles = response.list.map(
            (item: ApiFeaturedArticleItem) => ({
              id: item.id,
              category: item.category.name,
              title: item.title,
              authorName: item.authorName ?? 'Unknown',
              authorAvatar: item.authorAvatar ?? '',
              publishedAt: item.publishedAt,
              readTime: item.readTime,
              coverUrl: item.coverUrl ?? '',
            }),
          );
        });
      } catch (error) {
        console.error('加载特色文章失败:', error);
      }
    },

    async fetchCategories(): Promise<void> {
      this.setCategoriesLoading(true);
      try {
        const data = await api.category.getList();
        this.setCategories(data.list);
      } catch (error) {
        console.error('加载热门分类失败:', error);
      } finally {
        this.setCategoriesLoading(false);
      }
    },

    async fetchUserLikeList(): Promise<void> {
      const userId = rootStore.app.userInfo?.id;
      if (!userId) return;

      try {
        const response = await api.article.getUserLikeList({ userId });
        runInAction(() => {
          this.likedArticleIds = new Set(response.articleIds);
        });
      } catch (error) {
        console.error('获取用户点赞列表失败:', error);
      }
    },

    applyLikeStatusToArticles(): void {
      runInAction(() => {
        this.articles = this.articles.map(article => ({
          ...article,
          isLiked:
            this.likedArticleIds.has(article.id) ?? article.isLiked ?? false,
        }));
      });
    },

    async fetchInitialData(): Promise<void> {
      // 并发获取基础数据
      // fetchArticles 内部会自动处理点赞状态
      await Promise.allSettled([
        this.fetchArticles(),
        this.fetchFeaturedArticles(),
        this.fetchCategories(),
      ]);
    },
  }));

  return store;
}
