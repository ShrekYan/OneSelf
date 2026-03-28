/**
 * Handle hot search tag click
 */
import type { SearchStoreType } from '../useStore';
import { useHandleSearchSubmit } from './useHandleSearchSubmit';

export const useHandleHotSearchClick = (store: SearchStoreType) => {
  const handleSearchSubmit = useHandleSearchSubmit(store);

  const handleHotSearchClick = (keyword: string) => {
    store.setSearchKeyword(keyword);
    handleSearchSubmit();
  };

  return handleHotSearchClick;
};
