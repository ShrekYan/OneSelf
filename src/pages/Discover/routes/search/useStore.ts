import { useLocalObservable } from 'mobx-react';

import api from '@/api';
import type { ArticleItem } from '@/types/article';
import type { HotSearchItem } from './constant';

/**
 * Search 页面 Store 类型定义
 */
export interface SearchStoreType {
  /** Current search keyword */
  searchKeyword: string;
  /** Search history records */
  searchHistory: string[];
  /** Trending search data */
  hotSearches: HotSearchItem[];
  /** Hot searches loading state */
  hotSearchesLoading: boolean;
  /** Search result list */
  searchResults: ArticleItem[];
  /** Current category ID for category search, null for keyword search */
  currentCategoryId: string | null;
  /** Total result count */
  total: number;
  /** Whether has more results for pagination */
  hasMore: boolean;
  /** Loading state */
  loading: boolean;
  /** Whether search has been executed */
  hasSearched: boolean;

  /** Set search keyword */
  setSearchKeyword: (keyword: string) => void;
  /** Set current category ID */
  setCurrentCategoryId: (categoryId: string | null) => void;
  /** Add search history */
  addSearchHistory: (keyword: string) => void;
  /** Remove a single search history */
  removeSearchHistory: (keyword: string) => void;
  /** Clear all search history */
  clearSearchHistory: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set search state */
  setHasSearched: (hasSearched: boolean) => void;
  /** Set search results */
  setSearchResults: (results: ArticleItem[]) => void;
  /** Fetch hot keywords from API */
  fetchHotSearches: () => Promise<void>;
  /** Fetch search results from API */
  fetchSearchResults: () => Promise<void>;
}

/**
 * Search 页面 Store Hook
 * @description 使用 MobX 管理搜索关键词、搜索历史、搜索结果等状态
 */
export function useSearchStore(): SearchStoreType {
  const store = useLocalObservable<SearchStoreType>(() => ({
    searchKeyword: '',
    searchHistory: [],
    hotSearches: [],
    hotSearchesLoading: true,
    searchResults: [],
    currentCategoryId: null,
    total: 0,
    hasMore: false,
    loading: false,
    hasSearched: false,

    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword;
    },

    setCurrentCategoryId(categoryId: string | null) {
      this.currentCategoryId = categoryId;
    },

    addSearchHistory(keyword: string) {
      const trimmedKeyword = keyword.trim();
      if (!trimmedKeyword) return;
      // Remove duplicates, add to front, keep max 10 items
      const filtered = this.searchHistory.filter(
        item => item !== trimmedKeyword,
      );
      this.searchHistory = [trimmedKeyword, ...filtered].slice(0, 10);
    },

    removeSearchHistory(keyword: string) {
      this.searchHistory = this.searchHistory.filter(item => item !== keyword);
    },

    clearSearchHistory() {
      this.searchHistory = [];
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setHasSearched(hasSearched: boolean) {
      this.hasSearched = hasSearched;
    },

    setSearchResults(results: ArticleItem[]) {
      this.searchResults = results;
    },

    async fetchHotSearches() {
      this.hotSearchesLoading = true;
      try {
        this.hotSearches = await api.category.getHotKeywords();
      } catch (error) {
        console.error('Failed to fetch hot keywords:', error);
        // Global error toast is handled by API interceptor
      } finally {
        this.hotSearchesLoading = false;
      }
    },

    async fetchSearchResults() {
      this.loading = true;
      try {
        const params = {
          page: 1,
          pageSize: 10,
          ...(this.currentCategoryId
            ? { categoryId: this.currentCategoryId }
            : { keyword: this.searchKeyword.trim() }),
        };
        const response = await api.article.listArticles(params);
        this.searchResults = response.list;
        this.total = response.total;
        this.hasMore = response.hasMore;
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        this.searchResults = [];
        this.total = 0;
        this.hasMore = false;
        // Global error toast is handled by API interceptor
      } finally {
        this.loading = false;
      }
    },
  }));

  return store;
}
