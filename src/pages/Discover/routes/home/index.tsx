/**
 * Home 首页
 * 包含顶部导航栏、分类标签、特色文章卡片、文章列表
 * 支持下拉刷新和无限加载
 */

import React from 'react';
import { useObserver } from 'mobx-react';
import { PullToRefresh, InfiniteScroll, Toast } from 'antd-mobile';
import { useEffectOnce } from 'react-use';
import useStore from './useStore';
import { TopBar } from './components/top-bar';
import { CategoryTabs } from './components/category-tabs';
import { FeaturedArticle } from './components/featured-article';
import { ArticleListItem } from './components/article-list-item';
import styles from './index.module.scss';

/**
 * Home 首页组件
 */
const Home: React.FC = () => {
  const store = useStore();

  useEffectOnce(() => {
    store.fetchArticles();
  });

  const handleRefresh = async () => {
    await store.refreshArticles();
    Toast.show({
      icon: 'success',
      content: 'Refresh successful',
    });
  };

  const handleLoadMore = async () => {
    await store.loadMoreArticles();
  };

  return useObserver(() => (
    <div className={styles.container}>
      <TopBar />
      <CategoryTabs />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className={styles.content}>
          {/* 特色文章 */}
          {store.featuredArticle && (
            <FeaturedArticle article={store.featuredArticle} />
          )}

          {/* Latest Articles 标题 */}
          <div className={styles.latestHeader}>
            <h2 className={styles.latestTitle}>Latest Articles</h2>
            <a className={styles.seeAllLink}>See all</a>
          </div>

          {/* 文章列表 */}
          {store.articleList.map(article => (
            <ArticleListItem key={article.id} article={article} />
          ))}

          {/* 无限加载指示器 */}
          <InfiniteScroll
            loadMore={handleLoadMore}
            hasMore={store.hasMore}
            threshold={100}
          >
            {store.loadingMore && (
              <div className={styles.loadMoreText}>Loading more...</div>
            )}
            {!store.hasMore && (
              <div className={styles.noMoreText}>You've reached the end 👋</div>
            )}
          </InfiniteScroll>
        </div>
      </PullToRefresh>
    </div>
  ));
};

export default Home;
