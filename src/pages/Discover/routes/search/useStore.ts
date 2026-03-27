/**
 * Search 搜索模块状态管理
 * @description 使用 MobX 管理搜索关键词、搜索历史、搜索结果等状态
 */

import { useLocalObservable } from 'mobx-react';

import type { HotSearchItem } from './constant';

export interface SearchStoreType {
  /** 当前搜索关键词 */
  searchKeyword: string;
  /** 搜索历史记录 */
  searchHistory: string[];
  /** 热门搜索数据 */
  hotSearches: HotSearchItem[];
  /** 搜索结果列表 */
  searchResults: unknown[];
  /** 加载状态 */
  loading: boolean;
  /** 是否已执行搜索 */
  hasSearched: boolean;

  /** 设置搜索关键词 */
  setSearchKeyword: (keyword: string) => void;
  /** 添加搜索历史 */
  addSearchHistory: (keyword: string) => void;
  /** 移除单条搜索历史 */
  removeSearchHistory: (keyword: string) => void;
  /** 清空所有搜索历史 */
  clearSearchHistory: () => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置搜索状态 */
  setHasSearched: (hasSearched: boolean) => void;
  /** 设置搜索结果 */
  setSearchResults: (results: unknown[]) => void;
}

type UseSearchStoreType = (
  initialHotSearches: HotSearchItem[],
) => SearchStoreType;

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
      // 移除重复，添加到最前面，最多保留 10 条
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
