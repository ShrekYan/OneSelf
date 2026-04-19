/**
 * Handle search form submission
 */
import { useCallback } from 'react';
import { debounce } from 'es-toolkit';
import type { SearchStoreType } from '../useStore';

export const useHandleSearchSubmit = (store: SearchStoreType) => {
  const handleSearchSubmit = useCallback(
    debounce(async () => {
      const keyword = store.searchKeyword.trim();

      // If there's no categoryId selected (this is a manual keyword search),
      // and keyword is empty, don't proceed
      if (store.currentCategoryId === null && !keyword) {
        return;
      }

      // If this is a manual keyword search (no category selected),
      // add to search history
      if (store.currentCategoryId === null) {
        store.addSearchHistory(keyword);
      }

      store.setHasSearched(true);
      await store.fetchSearchResults();
    }, 300),
    [store],
  );

  return handleSearchSubmit;
};
