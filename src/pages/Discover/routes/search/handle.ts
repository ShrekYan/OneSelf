/**
 * Search page event handlers
 * @description Extract business logic to keep component clean
 */

import { useNavigate } from 'react-router-dom';

import type { SearchStoreType } from './useStore';

/**
 * Handle search submission
 */
export const useHandleSearchSubmit = (store: SearchStoreType) => {
  const handleSearchSubmit = () => {
    const keyword = store.searchKeyword.trim();
    if (!keyword) return;

    // 添加到搜索历史
    store.addSearchHistory(keyword);
    store.setHasSearched(true);

    // TODO: 调用搜索接口获取结果
    console.log('Search for:', keyword);
    store.setLoading(true);

    // 模拟加载
    setTimeout(() => {
      store.setLoading(false);
      store.setSearchResults([]);
    }, 500);
  };

  return handleSearchSubmit;
};

/**
 * Handle trending search click
 */
export const useHandleHotSearchClick = (store: SearchStoreType) => {
  const handleSearchSubmit = useHandleSearchSubmit(store);

  const handleHotSearchClick = (keyword: string) => {
    store.setSearchKeyword(keyword);
    handleSearchSubmit();
  };

  return handleHotSearchClick;
};

/**
 * Handle search history click
 */
export const useHandleHistoryClick = () => {
  const handleHistoryClick = (keyword: string) => {
    // Click on history keyword, navigate to search results or search directly
    console.log('Search from history:', keyword);
    // TODO: Implement search result navigation or direct search
  };

  return handleHistoryClick;
};

/**
 * Go back to previous page
 */
export const useHandleGoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return handleGoBack;
};
