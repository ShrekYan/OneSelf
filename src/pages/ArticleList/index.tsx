import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useObserver } from 'mobx-react';
import { DotLoading } from 'antd-mobile';
import styles from './index.module.scss';
import CategoryTabs from './components/category-tabs';
import ArticleListItem from './components/article-list-item';
import { useArticleListStore } from './useStore';
import * as handle from './handle';

const ArticleListPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useArticleListStore();

  const handleBack = () => {
    navigate(-1);
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  return useObserver(() => (
    <div className={styles.articleListContainer}>
      {/* 顶部导航栏 - 毛玻璃效果，和详情页保持一致 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.navButton} onClick={handleBack}>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className={styles.title}>{'文章列表'}</div>
          <div className={styles.rightActions}></div>
        </div>
      </header>

      {/* 分类标签栏 + 文章列表区域 */}
      <div className={styles.contentContainer}>
        {/* 分类标签栏 */}
        <CategoryTabs
          tabs={store.categories}
          defaultSelectedId={store.selectedCategoryId}
          onTabChange={tabId => handle.handleTabChange(store, tabId)}
        />

        {/* 文章列表区域 */}
        <div className={styles.listContainer}>
          {store.loading && store.filteredArticles.length === 0 && (
            <div className={styles.loadingContainer}>
              <DotLoading color="primary" />
            </div>
          )}
          {!store.loading && store.filteredArticles.length === 0 && (
            <div className={styles.emptyContainer}>
              <svg
                viewBox="0 0 24 24"
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <line x1="18" y1="18" x2="6" y2="6" />
              </svg>
              <p className={styles.emptyText}>暂无文章</p>
            </div>
          )}
          {store.filteredArticles.map(article => (
            <ArticleListItem
              key={article.id}
              article={article}
              onClick={handleArticleClick}
              onLikeClick={() => handle.handleLikeClick(store, article.id)}
            />
          ))}
        </div>
      </div>
    </div>
  ));
};

ArticleListPage.displayName = 'ArticleListPage';

export default ArticleListPage;
