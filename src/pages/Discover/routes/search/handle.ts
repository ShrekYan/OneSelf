/**
 * 搜索页面事件处理函数
 * @description 抽离业务逻辑，保持组件简洁
 */

import { useNavigate } from 'react-router-dom';

import type { SearchStoreType } from './useStore';

/**
 * 处理搜索提交
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
 * 处理热门搜索点击
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
 * 处理搜索历史点击
 */
export const useHandleHistoryClick = () => {
  const handleHistoryClick = (keyword: string) => {
    // 点击历史关键词，跳转到搜索结果页面或直接搜索
    console.log('Search from history:', keyword);
    // TODO: 实现搜索结果跳转或直接搜索
  };

  return handleHistoryClick;
};

/**
 * 返回上一页
 */
export const useHandleGoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return handleGoBack;
};
