/**
 * Handle hot search tag click
 */
import type { SearchStoreType } from '../useStore';
import type { HotSearchItem } from '../constant';
import { useHandleSearchSubmit } from './useHandleSearchSubmit';

export const useHandleHotSearchClick = (store: SearchStoreType) => {
  const handleSearchSubmit = useHandleSearchSubmit(store);

  const handleHotSearchClick = (item: HotSearchItem) => {
    store.setSearchKeyword(item.name);
    store.setCurrentCategoryId(item.id);
    handleSearchSubmit();
  };

  return handleHotSearchClick;
};
