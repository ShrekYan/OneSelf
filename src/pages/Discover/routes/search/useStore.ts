import { useLocalObservable } from 'mobx-react';

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
  /** Search result list */
  searchResults: unknown[];
  /** Loading state */
  loading: boolean;
  /** Whether search has been executed */
  hasSearched: boolean;

  /** Set search keyword */
  setSearchKeyword: (keyword: string) => void;
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
  setSearchResults: (results: unknown[]) => void;
}

type UseSearchStoreType = (
  initialHotSearches: HotSearchItem[],
) => SearchStoreType;

/**
 * Search 页面 Store Hook
 * @description 使用 MobX 管理搜索关键词、搜索历史、搜索结果等状态
 */
const useSearchStore: UseSearchStoreType = initialHotSearches => {
  const store = useLocalObservable<SearchStoreType>(() => ({
    searchKeyword: '',
    searchHistory: [],
    hotSearches: initialHotSearches,
    searchResults: [],
    loading: false,
    hasSearched: false,

    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword;
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

    setSearchResults(results: unknown[]) {
      this.searchResults = results;
    },
  }));

  return store;
};

export default useSearchStore;
