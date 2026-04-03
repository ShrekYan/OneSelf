import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useObserver } from 'mobx-react';
import { DotLoading } from 'antd-mobile';
import styles from './index.module.scss';
import TopBar from './components/top-bar';
import CategoryTabs from './components/category-tabs';
import FeaturedArticle from './components/featured-article';
import ArticleListItem from './components/article-list-item';
import { useHomeStore } from './useStore';
import { useHandleArticleClick } from './hooks/useHandleArticleClick';
//import { useActivate, useUnactivate } from "react-activation";
import * as handle from './handle';

const HomePage: React.FC = () => {
  const store = useHomeStore();
  const navigate = useNavigate();
  const onArticleClick = useHandleArticleClick();

  //  useActivate(() => {
  //       console.log("HomePage: didActivate");
  //   });

  //   useUnactivate(() => {
  //       console.log("HomePage: willUnactivate");
  //   });

  useEffect(() => {
    store.fetchArticles();
    store.fetchFeaturedArticles();
    store.fetchCategories();
  }, [store]);

  return useObserver(() => (
    <div className={styles.homeRoot}>
      {/* 顶部导航栏 */}
      <TopBar />

      {/* 分类标签栏 */}
      <CategoryTabs
        tabs={store.categories}
        defaultSelectedId={store.activeCategoryId}
        onTabChange={tabId => handle.handleTabChange(store, tabId)}
      />

      {/* 特色文章横幅 */}
      <FeaturedArticle
        articles={store.featuredArticles}
        onBookmarkClick={handle.handleFeaturedBookmark}
        onArticleClick={articleId =>
          handle.handleFeaturedClick(navigate, articleId)
        }
      />

      {/* Latest Articles 标题区域 */}
      <section className={styles.latestSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          <button
            className={styles.seeAllLink}
            onClick={() =>
              handle.handleSeeAllClick(navigate, store.activeCategoryId)
            }
            type="button"
          >
            See all
          </button>
        </div>

        {/* 文章列表 */}
        {store.loading && store.articles.length === 0 && (
          <div className={styles.loadingContainer}>
            <DotLoading color="primary" />
          </div>
        )}
        {!store.loading && store.articles.length === 0 && (
          <div className={styles.emptyContainer}>
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <line x1="18" y1="18" x2="6" y2="6" strokeWidth="2" />
            </svg>
            <p className={styles.emptyText}>No articles found</p>
          </div>
        )}
        <div className={styles.articleList}>
          {store.articles.map(article => (
            <ArticleListItem
              key={article.id}
              article={article}
              onClick={onArticleClick}
              onLikeClick={() => handle.handleLikeClick(store, article.id)}
              onCommentClick={handle.handleCommentClick}
            />
          ))}
        </div>
      </section>
    </div>
  ));
};

HomePage.displayName = 'HomePage';

export default HomePage;
