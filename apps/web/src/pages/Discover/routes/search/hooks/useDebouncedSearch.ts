/**
 * Debounced real-time search hook
 * @description When user is typing keywords, trigger search after user stops typing
 */
import { useCallback } from 'react';
import { debounce } from 'es-toolkit';
import type { SearchStoreType } from '../useStore';

export const useDebouncedSearch = (store: SearchStoreType) => {
  // Debounce search: 400ms wait after last keystroke
  // Only execute once after user stops typing
  const debouncedSearch = useCallback(
    debounce((keyword: string) => {
      const trimmed = keyword.trim();
      if (!trimmed || store.currentCategoryId !== null) {
        return;
      }
      // Only trigger real-time search for manual keyword input
      store.setHasSearched(true);
      store.fetchSearchResults();
    }, 400),
    [store],
  );

  return debouncedSearch;
};
