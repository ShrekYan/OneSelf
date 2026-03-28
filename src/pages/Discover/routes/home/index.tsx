import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';
import TopBar from './components/top-bar';
import CategoryTabs from './components/category-tabs';
import FeaturedArticle from './components/featured-article';
import ArticleListItem from './components/article-list-item';
import { MOCK_FEATURED_ARTICLES } from './constant';
import { useHomeStore } from './useStore';
import { useHandleArticleClick } from './hooks/useHandleArticleClick';
import * as handle from './handle';

const HomePage: React.FC = () => {
  const store = useHomeStore();
  const onArticleClick = useHandleArticleClick();

  useEffect(() => {
    store.fetchArticles();
  }, [store]);

  return useObserver(() => (
    <div className={styles.homeRoot}>
      {/* 顶部导航栏 */}
      <TopBar />

      {/* 分类标签栏 */}
      <CategoryTabs
        onTabChange={tabId => handle.handleTabChange(store, tabId)}
      />

      {/* 特色文章横幅 */}
      <FeaturedArticle
        articles={MOCK_FEATURED_ARTICLES}
        onBookmarkClick={handle.handleFeaturedBookmark}
        onArticleClick={handle.handleFeaturedClick}
      />

      {/* Latest Articles 标题区域 */}
      <section className={styles.latestSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          <button
            className={styles.seeAllLink}
            onClick={handle.handleSeeAllClick}
            type="button"
          >
            See all
          </button>
        </div>

        {/* 文章列表 */}
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
