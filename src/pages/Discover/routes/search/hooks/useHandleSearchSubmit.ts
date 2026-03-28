/**
 * Handle search form submission
 */
import type { SearchStoreType } from '../useStore';

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
