/**
 * Explore 探索页面业务处理函数
 * @description 存放分类点击、搜索、搜索历史等纯业务逻辑
 */

import { Toast } from 'antd-mobile';

import type { ExploreStoreType } from './useStore';

/**
 * 处理搜索关键词变化
 * @param store - Explore store 实例
 * @param keyword - 搜索关键词
 */
export const handleSearchInputChange = (
  store: ExploreStoreType,
  keyword: string,
): void => {
  store.setSearchKeyword(keyword);
};

/**
 * 处理搜索提交
 * @param store - Explore store 实例
 * @param keyword - 搜索关键词
 */
export const handleSearchSubmit = (
  store: ExploreStoreType,
  keyword: string,
): void => {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) return;

  store.addSearchHistory(trimmedKeyword);
  console.log('Search for:', trimmedKeyword);
  // TODO: 执行搜索，跳转到搜索结果页
};

/**
 * 点击搜索历史项
 * @param store - Explore store 实例
 * @param keyword - 搜索关键词
 */
export const handleSearchHistoryClick = (
  store: ExploreStoreType,
  keyword: string,
): void => {
  store.setSearchKeyword(keyword);
  handleSearchSubmit(store, keyword);
};

/**
 * 删除搜索历史项
 * @param store - Explore store 实例
 * @param keyword - 要删除的关键词
 * @param e - 鼠标事件
 */
export const handleSearchHistoryDelete = (
  store: ExploreStoreType,
  keyword: string,
  e: React.MouseEvent,
): void => {
  e.stopPropagation();
  store.removeSearchHistory(keyword);
  Toast.show({
    icon: 'success',
    content: '已删除',
  });
};

/**
 * 清空所有搜索历史
 * @param store - Explore store 实例
 */
export const handleClearSearchHistory = (store: ExploreStoreType): void => {
  store.clearSearchHistory();
  Toast.show({
    icon: 'success',
    content: '已清空搜索历史',
  });
};
