import React, { useCallback, useEffect, useRef } from 'react';
import { useObserver } from 'mobx-react';

import styles from './index.module.scss';
import { useSearchStore } from './useStore';
import { useHandleSearchSubmit } from './hooks/useHandleSearchSubmit';
import { useHandleHotSearchClick } from './hooks/useHandleHotSearchClick';
import { useHandleGoBack } from './hooks/useHandleGoBack';
import { useThrottledSearch } from './hooks/useThrottledSearch';
import SearchResultList from './components/SearchResultList';

const SearchPage: React.FC = () => {
  // 在组件顶层调用 Hook 获取 store
  const searchStore = useSearchStore();
  // 获取事件处理函数
  const handleSearchSubmit = useHandleSearchSubmit(searchStore);
  const handleHotSearchClick = useHandleHotSearchClick(searchStore);
  const handleGoBack = useHandleGoBack();
  // 实时搜索节流
  useThrottledSearch(searchStore);

  // 搜索框 ref 用于清空后自动聚焦
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 组件挂载时获取热门搜索数据
  useEffect(() => {
    searchStore.fetchHotSearches();
  }, [searchStore]);

  // 处理输入框变化
  const handleInputChange = useCallback(
    (value: string) => {
      searchStore.setSearchKeyword(value);
      // If search content is cleared and currently showing results,
      // automatically go back to trending searches view
      if (value === '' && searchStore.hasSearched) {
        searchStore.setHasSearched(false);
      }
    },
    [searchStore],
  );

  // 处理清空历史
  const handleClearHistory = useCallback(() => {
    searchStore.clearSearchHistory();
  }, [searchStore]);

  // 处理删除单条历史
  const handleDeleteHistory = useCallback(
    (keyword: string, e: React.MouseEvent) => {
      e.stopPropagation();
      searchStore.removeSearchHistory(keyword);
    },
    [searchStore],
  );

  // 处理回车搜索
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit],
  );

  // 处理清空搜索
  const handleClearSearch = useCallback(() => {
    searchStore.setSearchKeyword('');
    searchStore.setHasSearched(false);
    searchStore.setCurrentCategoryId(null);
    searchInputRef.current?.focus();
  }, [searchStore]);

  return useObserver(() => (
    <div className={styles.searchRoot}>
      {/* 顶部搜索栏 */}
      <header className={styles.searchBar}>
        <button
          className={styles.backBtn}
          onClick={handleGoBack}
          type="button"
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={styles.searchInputWrapper}>
          <div className={styles.searchIcon}>
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search articles, categories..."
            value={searchStore.searchKeyword}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {searchStore.searchKeyword.trim().length > 0 && (
            <button
              className={styles.clearBtn}
              onClick={handleClearSearch}
              type="button"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <button
          className={styles.searchBtn}
          onClick={handleSearchSubmit}
          disabled={searchStore.searchKeyword.trim().length === 0}
          type="button"
        >
          Search
        </button>
      </header>

      {/* 如果还没搜索，显示热门搜索和历史记录 */}
      {!searchStore.hasSearched ? (
        <>
          {/* 热门搜索推荐 */}
          {searchStore.hotSearchesLoading ? (
            <section className={styles.hotSection}>
              <h2 className={styles.sectionTitle}>Trending Searches</h2>
              <div className={styles.loadingText}>Loading...</div>
            </section>
          ) : searchStore.hotSearches.length > 0 ? (
            <section className={styles.hotSection}>
              <h2 className={styles.sectionTitle}>Trending Searches</h2>
              <div className={styles.hotTags}>
                {searchStore.hotSearches.map(item => (
                  <button
                    key={item.id}
                    className={styles.hotTag}
                    onClick={() => handleHotSearchClick(item)}
                    type="button"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {/* 搜索历史记录 */}
          {searchStore.searchHistory.length > 0 && (
            <section className={styles.historySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Search History</h2>
                <button
                  className={styles.clearBtn}
                  onClick={handleClearHistory}
                  type="button"
                >
                  Clear All
                </button>
              </div>

              <div className={styles.historyList}>
                {searchStore.searchHistory.map(keyword => (
                  <div
                    key={keyword}
                    className={styles.historyItem}
                    onClick={() => handleInputChange(keyword)}
                  >
                    <div className={styles.historyLeft}>
                      <div className={styles.historyIcon}>
                        <svg viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <span className={styles.historyKeyword}>{keyword}</span>
                    </div>
                    <div
                      className={styles.deleteIcon}
                      onClick={e => handleDeleteHistory(keyword, e)}
                      aria-label="Delete"
                    >
                      <svg viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 没有热门搜索也没有历史，显示空状态 */}
          {searchStore.hotSearches.length === 0 &&
            searchStore.searchHistory.length === 0 && (
              <div className={styles.emptyState}>
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <p className={styles.emptyText}>No search history yet</p>
              </div>
            )}
        </>
      ) : (
        /* 已搜索，显示结果区域 */
        <section className={styles.resultSection}>
          <SearchResultList
            data={searchStore.searchResults}
            loading={searchStore.loading}
            hasSearched={searchStore.hasSearched}
          />
        </section>
      )}
    </div>
  ));
};

export default SearchPage;
