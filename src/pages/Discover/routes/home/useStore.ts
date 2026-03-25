/**
 * Home 页面状态管理
 * 使用 MobX useLocalObservable 进行页面级状态管理
 */

import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';
import type { ArticleItem } from './constant';
import { MOCK_FEATURED_ARTICLE, MOCK_ARTICLE_LIST } from './constant';

/**
 * Home Store 类型定义
 */
export interface DiscoverStoreType {
  /** 当前激活的分类 ID */
  activeCategoryId: string;
  /** 当前激活的导航 ID */
  activeNavId: string;
  /** 特色文章数据（大图展示） */
  featuredArticle: ArticleItem | null;
  /** 文章列表 */
  articleList: ArticleItem[];
  /** 是否正在初次加载 */
  loading: boolean;
  /** 是否正在下拉刷新 */
  refreshing: boolean;
  /** 是否正在加载更多 */
  loadingMore: boolean;
  /** 是否还有更多数据可加载 */
  hasMore: boolean;
  /** 当前页码 */
  page: number;

  /** 设置当前激活的分类 */
  setActiveCategoryId: (id: string) => void;
  /** 设置当前激活的导航 */
  setActiveNavId: (id: string) => void;
  /** 设置初次加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置下拉刷新状态 */
  setRefreshing: (refreshing: boolean) => void;
  /** 设置加载更多状态 */
  setLoadingMore: (loadingMore: boolean) => void;
  /** 设置是否还有更多数据 */
  setHasMore: (hasMore: boolean) => void;
  /** 设置当前页码 */
  setPage: (page: number) => void;
  /** 设置特色文章 */
  setFeaturedArticle: (article: ArticleItem | null) => void;
  /** 设置文章列表 */
  setArticleList: (list: ArticleItem[]) => void;
  /** 追加文章列表到末尾 */
  addArticleList: (list: ArticleItem[]) => void;
  /** 切换文章点赞状态 */
  toggleLike: (articleId: string) => void;
  /** 切换文章收藏状态 */
  toggleSave: (articleId: string) => void;
  /** 初次获取文章列表 */
  fetchArticles: () => Promise<void>;
  /** 下拉刷新文章列表 */
  refreshArticles: () => Promise<void>;
  /** 加载更多文章 */
  loadMoreArticles: () => Promise<void>;
}

/**
 * Home 模块状态管理 Hook
 * 包含文章列表管理、分类切换、点赞收藏等功能状态
 */
const useDiscoverStore = () => {
  const store = useLocalObservable<DiscoverStoreType>(() => ({
    // 初始状态
    activeCategoryId: 'for-you',
    activeNavId: 'home',
    featuredArticle: MOCK_FEATURED_ARTICLE,
    articleList: [...MOCK_ARTICLE_LIST],
    loading: false,
    refreshing: false,
    loadingMore: false,
    hasMore: true,
    page: 1,

    /**
     * 设置当前激活的分类
     * @param id - 分类 ID
     */
    setActiveCategoryId(id: string) {
      this.activeCategoryId = id;
    },

    /**
     * 设置当前激活的底部导航
     * @param id - 导航 ID
     */
    setActiveNavId(id: string) {
      this.activeNavId = id;
    },

    /**
     * 设置加载状态
     * @param loading - 是否加载中
     */
    setLoading(loading: boolean) {
      this.loading = loading;
    },

    /**
     * 设置刷新状态
     * @param refreshing - 是否刷新中
     */
    setRefreshing(refreshing: boolean) {
      this.refreshing = refreshing;
    },

    /**
     * 设置加载更多状态
     * @param loadingMore - 是否加载更多中
     */
    setLoadingMore(loadingMore: boolean) {
      this.loadingMore = loadingMore;
    },

    /**
     * 设置是否还有更多数据
     * @param hasMore - 是否还有更多
     */
    setHasMore(hasMore: boolean) {
      this.hasMore = hasMore;
    },

    /**
     * 设置当前页码
     * @param page - 页码
     */
    setPage(page: number) {
      this.page = page;
    },

    /**
     * 设置特色文章
     * @param article - 特色文章数据
     */
    setFeaturedArticle(article: ArticleItem | null) {
      this.featuredArticle = article;
    },

    /**
     * 设置文章列表
     * @param list - 文章列表数据
     */
    setArticleList(list: ArticleItem[]) {
      this.articleList = list;
    },

    /**
     * 追加文章列表
     * @param list - 要追加的文章列表
     */
    addArticleList(list: ArticleItem[]) {
      this.articleList.push(...list);
    },

    /**
     * 切换文章点赞状态
     * @param articleId - 文章 ID
     */
    toggleLike(articleId: string) {
      // 检查特色文章
      if (this.featuredArticle?.id === articleId) {
        if (this.featuredArticle.isLiked) {
          this.featuredArticle.likes -= 1;
        } else {
          this.featuredArticle.likes += 1;
        }
        this.featuredArticle.isLiked = !this.featuredArticle.isLiked;
        return;
      }

      // 检查列表文章
      const article = this.articleList.find(
        (item: ArticleItem) => item.id === articleId,
      );
      if (article) {
        if (article.isLiked) {
          article.likes -= 1;
        } else {
          article.likes += 1;
        }
        article.isLiked = !article.isLiked;
      }
    },

    /**
     * 切换文章收藏状态
     * @param articleId - 文章 ID
     */
    toggleSave(articleId: string) {
      // 检查特色文章
      if (this.featuredArticle?.id === articleId) {
        this.featuredArticle.isSaved = !this.featuredArticle.isSaved;
        return;
      }

      // 检查列表文章
      const article = this.articleList.find(
        (item: ArticleItem) => item.id === articleId,
      );
      if (article) {
        article.isSaved = !article.isSaved;
      }
    },

    /**
     * 获取文章列表
     * 模拟异步请求，实际项目中调用 API
     */
    async fetchArticles() {
      this.setLoading(true);

      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        runInAction(() => {
          if (this.page === 1) {
            // 第一页已经有模拟数据了，保持不变
          }
          this.setLoading(false);
          this.refreshing = false;
          this.loadingMore = false;
        });
      } catch (error) {
        console.error('获取文章列表失败:', error);
        runInAction(() => {
          this.setLoading(false);
          this.refreshing = false;
          this.loadingMore = false;
        });
      }
    },

    /**
     * 刷新文章列表
     * 重置页码并重新获取
     */
    async refreshArticles() {
      this.setRefreshing(true);
      this.setPage(1);
      await this.fetchArticles();
    },

    /**
     * 加载更多文章
     * 增加页码并获取下一页数据
     */
    async loadMoreArticles() {
      if (this.loadingMore || !this.hasMore) return;

      this.setLoadingMore(true);
      this.setPage(this.page + 1);

      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        runInAction(() => {
          // 模拟加载更多数据
          const moreArticles: ArticleItem[] = MOCK_ARTICLE_LIST.map(
            article => ({
              ...article,
              id: `${article.id}-${this.page}`,
            }),
          );

          this.addArticleList(moreArticles);
          this.setLoadingMore(false);

          // 模拟最多 3 页
          if (this.page >= 3) {
            this.setHasMore(false);
          }
        });
      } catch (error) {
        console.error('加载更多文章失败:', error);
        runInAction(() => {
          this.setLoadingMore(false);
        });
      }
    },
  }));

  return store;
};

export default useDiscoverStore;
