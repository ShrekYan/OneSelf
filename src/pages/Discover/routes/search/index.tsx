import React, { useCallback } from 'react';
import { useObserver } from 'mobx-react';

import styles from './index.module.scss';
import { HOT_SEARCHES } from './constant';
import useSearchStore from './useStore';
import {
  useHandleSearchSubmit,
  useHandleHotSearchClick,
  useHandleGoBack,
} from './handle';

const SearchPage: React.FC = () => {
  // 在组件顶层调用 Hook 获取 store
  const searchStore = useSearchStore(HOT_SEARCHES);
  // 获取事件处理函数
  const handleSearchSubmit = useHandleSearchSubmit(searchStore);
  const handleHotSearchClick = useHandleHotSearchClick(searchStore);
  const handleGoBack = useHandleGoBack();

  // 处理输入框变化
  const handleInputChange = useCallback(
    (value: string) => {
      searchStore.setSearchKeyword(value);
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

  return useObserver(() => (
    <div className={styles.container}>
      {/* 顶部搜索栏 */}
      <header className={styles.searchBar}>
        <button
          className={styles.backBtn}
          onClick={handleGoBack}
          type="button"
          aria-label="返回"
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
            type="text"
            className={styles.searchInput}
            placeholder="搜索文章、分类..."
            value={searchStore.searchKeyword}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <button
          className={styles.searchBtn}
          onClick={handleSearchSubmit}
          disabled={searchStore.searchKeyword.trim().length === 0}
          type="button"
        >
          搜索
        </button>
      </header>

      {/* 如果还没搜索，显示热门搜索和历史记录 */}
      {!searchStore.hasSearched ? (
        <>
          {/* 热门搜索推荐 */}
          {searchStore.hotSearches.length > 0 && (
            <section className={styles.hotSection}>
              <h2 className={styles.sectionTitle}>热门搜索</h2>
              <div className={styles.hotTags}>
                {searchStore.hotSearches.map(item => (
                  <button
                    key={item.id}
                    className={styles.hotTag}
                    onClick={() => handleHotSearchClick(item.keyword)}
                    type="button"
                  >
                    {item.keyword}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* 搜索历史记录 */}
          {searchStore.searchHistory.length > 0 && (
            <section className={styles.historySection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>搜索历史</h2>
                <button
                  className={styles.clearBtn}
                  onClick={handleClearHistory}
                  type="button"
                >
                  清空
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
                      aria-label="删除"
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
                <p className={styles.emptyText}>还没有搜索记录</p>
              </div>
            )}
        </>
      ) : (
        /* 已搜索，显示结果区域 */
        <section className={styles.resultSection}>
          {searchStore.loading ? (
            <div>加载中...</div>
          ) : searchStore.searchResults.length === 0 ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <line x1="18" y1="18" x2="6" y2="6" />
              </svg>
              <p className={styles.emptyText}>未找到相关结果</p>
            </div>
          ) : (
            <div>
              {/* 搜索结果列表将在这里渲染，占位 */}
              搜索结果展示区域 - 待实现
            </div>
          )}
        </section>
      )}
    </div>
  ));
};

export default SearchPage;
