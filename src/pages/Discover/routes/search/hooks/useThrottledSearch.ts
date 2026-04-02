/**
 * Throttled real-time search hook
 * @description When user is typing keywords, trigger search with throttling
 */
import { useEffect, useCallback } from 'react';
import { throttle } from 'es-toolkit';
import type { SearchStoreType } from '../useStore';

export const useThrottledSearch = (store: SearchStoreType) => {
  // Throttle search: 400ms interval
  const throttledSearch = useCallback(
    throttle((keyword: string) => {
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

  // Watch keyword changes and trigger throttled search
  useEffect(() => {
    const trimmed = store.searchKeyword.trim();
    if (!trimmed) {
      return;
    }

    // Only trigger when it's a manual keyword search (no category selected)
    if (store.currentCategoryId === null) {
      throttledSearch(store.searchKeyword);
    }

    // Cleanup on unmount or dependency change
    return () => {
      throttledSearch.cancel();
    };
  }, [store.searchKeyword, store.currentCategoryId, throttledSearch]);
};
