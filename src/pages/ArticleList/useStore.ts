import { useLocalObservable } from 'mobx-react';
import { categoryList, mockArticleList } from './constant';
import type { ArticleItem } from './constant';

export function useArticleListStore() {
  const store = useLocalObservable(() => ({
    /** 当前选中分类 */
    selectedCategoryId: 'all',

    /** 加载状态 */
    loading: false,

    /** 全部分类 */
    categories: categoryList,

    /** 全部文章原始数据 */
    allArticles: mockArticleList,

    // Actions
    setSelectedCategoryId: (categoryId: string): void => {
      store.selectedCategoryId = categoryId;
    },

    setLoading: (state: boolean): void => {
      store.loading = state;
    },

    toggleLike: (articleId: string): void => {
      const article = store.allArticles.find(item => item.id === articleId);
      if (article) {
        article.isLiked = !article.isLiked;
        article.likes += article.isLiked ? 1 : -1;
      }
    },

    /** 根据当前选中分类过滤后的文章列表 */
    get filteredArticles(): ArticleItem[] {
      if (store.selectedCategoryId === 'all') {
        return store.allArticles;
      }
      return store.allArticles.filter(
        article => article.categoryId === store.selectedCategoryId,
      );
    },
  }));

  return store;
}

export type ArticleListStore = ReturnType<typeof useArticleListStore>;
