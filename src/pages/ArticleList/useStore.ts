import { useLocalObservable } from 'mobx-react';
import { articleApi } from '@/api/article';
import type { ArticleItem } from './constant';
import type { CategoryItem } from './constant';
import type { ArticleItem as ApiArticleItem } from '@/types/article';
export function useArticleListStore() {
  const store = useLocalObservable(() => ({
    /** 当前选中分类 */
    selectedCategoryId: 'all',

    /** 加载状态 */
    loading: false,

    /** 全部分类 */
    categories: [] as CategoryItem[],

    /** 全部文章原始数据 */
    allArticles: [] as ArticleItem[],

    /** 分页信息 */
    page: 1,
    pageSize: 5,
    total: 0,
    hasMore: false,
    currentPage: 0,
    loadingMore: false,

    // Actions
    setSelectedCategoryId: (categoryId: string): void => {
      store.selectedCategoryId = categoryId;
    },

    setLoading: (state: boolean): void => {
      store.loading = state;
    },

    setCategories: (categories: CategoryItem[]): void => {
      store.categories = categories;
    },

    setArticles: (articles: ArticleItem[]): void => {
      store.allArticles = articles;
    },

    toggleLike: (articleId: string): void => {
      const article = store.allArticles.find(item => item.id === articleId);
      if (article) {
        article.isLiked = !article.isLiked;
        article.likes += article.isLiked ? 1 : -1;
      }
    },

    /** 重置分页状态（切换分类时调用） */
    resetPagination: (): void => {
      store.currentPage = 1;
      store.allArticles = [];
      store.hasMore = false;
    },

    /** 设置加载更多状态 */
    setLoadingMore: (loading: boolean): void => {
      store.loadingMore = loading;
    },

    /** 设置是否还有更多数据 */
    setHasMore: (hasMore: boolean): void => {
      store.hasMore = hasMore;
    },

    /** 加载下一页文章 */
    fetchMoreArticles: async (): Promise<void> => {
      if (!store.hasMore || store.loadingMore) return;
      console.log('加载更多文章');
      try {
        store.setLoadingMore(true);
        const nextPage = store.currentPage + 1;
        const params: { page: number; pageSize: number; categoryId?: string } =
          {
            page: nextPage,
            pageSize: store.pageSize,
          };
        if (store.selectedCategoryId !== 'all') {
          params.categoryId = store.selectedCategoryId;
        }
        const res = await articleApi.listArticles(params);

        // 将 API 返回的 ArticleItem 转换为当前组件需要的格式
        const adaptedArticles: ArticleItem[] = res.list.map(
          (apiArticle: ApiArticleItem) => ({
            id: apiArticle.id,
            title: apiArticle.title,
            summary: apiArticle.summary || '',
            coverUrl: apiArticle.coverUrl,
            categoryId: apiArticle.category.id,
            authorName: apiArticle.authorName || 'Unknown',
            authorAvatar: apiArticle.authorAvatar,
            readTime: apiArticle.readTime,
            likes: apiArticle.likes || 0,
            commentsCount: apiArticle.commentsCount || 0,
            isLiked: false,
          }),
        );

        // 追加到已有列表后
        store.allArticles = [...store.allArticles, ...adaptedArticles];
        store.currentPage = nextPage;
        store.setHasMore(res.hasMore);
      } catch (error) {
        console.error('加载更多文章失败:', error);
      } finally {
        store.setLoadingMore(false);
      }
    },

    /** 获取分类列表 */
    fetchCategories: async (): Promise<void> => {
      try {
        store.setLoading(true);
        const res = await articleApi.listCategories();
        // 在接口返回的分类列表前面添加"全部"选项
        const categoriesWithAll: CategoryItem[] = [
          { id: 'all', name: '全部' },
          ...res.list.map(item => ({
            id: item.id,
            name: item.name,
          })),
        ];
        store.setCategories(categoriesWithAll);
      } catch (error) {
        // 错误由 API 拦截器全局处理，这里什么都不做
        console.error('获取分类列表失败:', error);
      } finally {
        store.setLoading(false);
      }
    },

    /** 获取文章列表（根据当前选中分类筛选） */
    fetchArticles: async (): Promise<void> => {
      console.log('获取文章列表');
      try {
        store.setLoading(true);
        // 切换分类，重置分页
        store.resetPagination();
        const params: { page: number; pageSize: number; categoryId?: string } =
          {
            page: 1,
            pageSize: store.pageSize,
          };
        // 只有当选中分类不是"all"时才传递 categoryId 参数（由后端筛选）
        if (store.selectedCategoryId !== 'all') {
          params.categoryId = store.selectedCategoryId;
        }
        const res = await articleApi.listArticles(params);

        // 将 API 返回的 ArticleItem 转换为当前组件需要的格式
        // API: category.id → 需要 categoryId 字段，添加 isLiked 初始状态
        const adaptedArticles: ArticleItem[] = res.list.map(
          (apiArticle: ApiArticleItem) => ({
            id: apiArticle.id,
            title: apiArticle.title,
            summary: apiArticle.summary || '',
            coverUrl: apiArticle.coverUrl,
            categoryId: apiArticle.category.id,
            authorName: apiArticle.authorName || 'Unknown',
            authorAvatar: apiArticle.authorAvatar,
            readTime: apiArticle.readTime,
            likes: apiArticle.likes || 0,
            commentsCount: apiArticle.commentsCount || 0,
            isLiked: false, // 接口不返回点赞状态，初始化为 false
          }),
        );
        store.setArticles(adaptedArticles);
        console.log(res.hasMore);
        store.setHasMore(res.hasMore);
      } catch (error) {
        // 错误由 API 拦截器全局处理，这里什么都不做
        console.error('获取文章列表失败:', error);
      } finally {
        store.setLoading(false);
      }
    },

    // /** 根据当前选中分类过滤后的文章列表 */
    // get filteredArticles(): ArticleItem[] {
    //   console.log(store.selectedCategoryId);
    //   // 后端已经按 categoryId 筛选过了，直接返回即可
    //   // 保留过滤逻辑作为兼容，万一前端需要过滤也可以正常工作
    //   if (store.selectedCategoryId === 'all') {
    //     return store.allArticles;
    //   }
    //   return store.allArticles.filter(
    //     article => article.categoryId === store.selectedCategoryId,
    //   );
    // },
  }));

  return store;
}

export type ArticleListStore = ReturnType<typeof useArticleListStore>;
