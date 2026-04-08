/**
 * Discover Home 模块状态管理
 * @description 使用 MobX 管理首页文章列表、分类标签等状态
 */

import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';

import api from '@/api';
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
  const store = useLocalObservable<HomeStoreType>(() => ({
    activeCategoryId: '',
    articles: [],
    featuredArticles: [],
    categories: [],
    loading: false,
    categoriesLoading: false,

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
        // 为 API 返回的文章添加本地 isLiked 状态
        const articlesWithLocalState = response.list.map(article => ({
          ...article,
          isLiked: article.isLiked ?? false,
        }));
        this.setArticles(articlesWithLocalState);
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

    async fetchInitialData(): Promise<void> {
      // 使用 Promise.allSettled 并发启动三个请求
      // 即使某个请求失败，其他请求仍然能正常返回数据
      // 每个方法内部已独立处理 try/catch 和 loading 状态更新
      await Promise.allSettled([
        this.fetchArticles(),
        this.fetchFeaturedArticles(),
        this.fetchCategories(),
      ]);
    },
  }));

  return store;
}
