/**
 * Explore 探索页面业务处理函数
 * @description 存放分类点击、搜索、搜索历史等业务逻辑
 */

import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { MOCK_CATEGORIES } from './constant';
import useExploreStore from './useStore';

/**
 * 处理分类卡片点击事件
 * @description 使用柯里化，在组件顶层获取 navigate
 * 跳转到分类文章列表页面
 */
export const useHandleCategoryClick = () => {
  const navigate = useNavigate();
  return (categoryId: string): void => {
    console.log('Navigate to category articles:', categoryId);
    navigate(`/explore/category/${categoryId}`);
  };
};

/**
 * 处理搜索关键词变化
 * @param store - Explore store 实例
 * @param keyword - 搜索关键词
 */
export const handleSearchInputChange = (
  store: ReturnType<typeof useExploreStore>,
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
  store: ReturnType<typeof useExploreStore>,
  keyword: string,
): void => {
  if (!keyword.trim()) return;

  store.addSearchHistory(keyword);
  console.log('Search for:', keyword);
  // TODO: 执行搜索，跳转到搜索结果页
};

/**
 * 点击搜索历史项
 * @param store - Explore store 实例
 * @param keyword - 搜索关键词
 */
export const handleSearchHistoryClick = (
  store: ReturnType<typeof useExploreStore>,
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
  store: ReturnType<typeof useExploreStore>,
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
export const handleClearSearchHistory = (
  store: ReturnType<typeof useExploreStore>,
): void => {
  store.clearSearchHistory();
  Toast.show({
    icon: 'success',
    content: '已清空搜索历史',
  });
};

/**
 * 加载分类列表数据
 * @param store - Explore store 实例
 */
export const fetchCategories = async (
  store: ReturnType<typeof useExploreStore>,
): Promise<void> => {
  store.setLoading(true);
  try {
    // TODO: 替换为真实 API 调用
    // const response = await categoryApi.getList();
    // store.setCategories(response);

    // 使用 Mock 数据
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
    store.setCategories(MOCK_CATEGORIES);
  } catch (error) {
    console.error('加载分类列表失败:', error);
    Toast.show({
      icon: 'fail',
      content: '加载分类失败，请重试',
    });
  } finally {
    store.setLoading(false);
  }
};
