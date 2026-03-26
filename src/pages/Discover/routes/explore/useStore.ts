/**
 * Explore 探索模块状态管理
 * @description 使用 MobX 管理分类列表、搜索关键词等状态
 */

import { useLocalObservable } from 'mobx-react';

import type { Category } from './constant';

export interface ExploreStoreType {
  /** 分类列表 */
  categories: Category[];
  /** 搜索关键词 */
  searchKeyword: string;
  /** 加载状态 */
  loading: boolean;
  /** 搜索历史 */
  searchHistory: string[];

  /** 设置分类列表 */
  setCategories: (categories: Category[]) => void;
  /** 设置搜索关键词 */
  setSearchKeyword: (keyword: string) => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 添加搜索历史 */
  addSearchHistory: (keyword: string) => void;
  /** 移除搜索历史 */
  removeSearchHistory: (keyword: string) => void;
  /** 清空搜索历史 */
  clearSearchHistory: () => void;
  /** 筛选分类（根据搜索关键词） */
  filteredCategories: () => Category[];
}

type UseExploreStoreType = () => ExploreStoreType;

const useExploreStore: UseExploreStoreType = () => {
  const store = useLocalObservable<ExploreStoreType>(() => ({
    categories: [],
    searchKeyword: '',
    loading: false,
    searchHistory: [],

    setCategories(categories: Category[]) {
      this.categories = categories;
    },

    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword;
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    addSearchHistory(keyword: string) {
      if (!keyword.trim()) return;
      // 移除重复
      const filtered = this.searchHistory.filter(item => item !== keyword);
      // 添加到最前面
      this.searchHistory = [keyword, ...filtered].slice(0, 10);
    },

    removeSearchHistory(keyword: string) {
      this.searchHistory = this.searchHistory.filter(item => item !== keyword);
    },

    clearSearchHistory() {
      this.searchHistory = [];
    },

    filteredCategories() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) return this.categories;
      return this.categories.filter(category =>
        category.name.toLowerCase().includes(keyword),
      );
    },
  }));

  return store;
};

export default useExploreStore;
