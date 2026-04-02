import React from 'react';
import { useObserver } from 'mobx-react';
import { useNavigate } from 'react-router-dom';

import { LazyImage } from '@/components';
import type { ArticleItem } from '@/types/article';
import styles from './index.module.scss';

export interface SearchResultListProps {
  data: ArticleItem[];
  loading: boolean;
  hasSearched: boolean;
}

const SearchResultList: React.FC<SearchResultListProps> = ({
  data,
  loading,
  hasSearched,
}) => {
  const navigate = useNavigate();

  const handleArticleClick = (article: ArticleItem) => {
    navigate(`/article/${article.id}`);
  };

  return useObserver(() => (
    <div className={styles.searchResultListContainer}>
      {!hasSearched ? null : loading ? (
        <div className={styles.loadingText}>Loading...</div>
      ) : data.length === 0 ? (
        <div className={styles.emptyState}>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <line x1="18" y1="18" x2="6" y2="6" />
          </svg>
          <p className={styles.emptyText}>No results found</p>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {data.map(article => (
            <div
              key={article.id}
              className={styles.articleCard}
              onClick={() => handleArticleClick(article)}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
            >
              {article.coverUrl && (
                <div className={styles.coverWrapper}>
                  <LazyImage src={article.coverUrl} alt={article.title} />
                </div>
              )}
              <div className={styles.contentWrapper}>
                <h3 className={styles.title}>{article.title}</h3>
                {article.summary && (
                  <p className={styles.summary}>{article.summary}</p>
                )}
                <div className={styles.meta}>
                  <span className={styles.category}>
                    {article.category.name}
                  </span>
                  <span className={styles.divider}>·</span>
                  <span className={styles.views}>{article.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ));
};

SearchResultList.displayName = 'SearchResultList';

export default SearchResultList;
