import React, { useCallback } from 'react';
import styles from './index.module.scss';
import TopBar from './components/top-bar';
import CategoryTabs from './components/category-tabs';
import FeaturedArticle from './components/featured-article';
import ArticleListItem from './components/article-list-item';
import { MOCK_ARTICLES } from './constant';
import { useHandleArticleClick } from './handle';

const HomePage: React.FC = () => {
  // 在组件顶层调用 Hook 获取 navigate，返回实际处理函数
  const onArticleClick = useHandleArticleClick();

  const handleLikeClick = useCallback((_articleId: string) => {
    console.log('Like article:', _articleId);
    // TODO: 点赞文章
  }, []);

  const handleCommentClick = useCallback((_articleId: string) => {
    console.log('Open comments for article:', _articleId);
    // TODO: 打开评论弹窗
  }, []);

  const handleSeeAllClick = useCallback(() => {
    console.log('Navigate to see all articles');
    // TODO: 跳转到全部文章列表
  }, []);

  const handleTabChange = useCallback((_tabId: string) => {
    console.log('Switch to category tab:', _tabId);
    // TODO: 切换分类，加载对应文章
  }, []);

  const handleFeaturedBookmark = useCallback(() => {
    console.log('Bookmark featured article');
    // TODO: 收藏特色文章
  }, []);

  const handleFeaturedClick = useCallback(() => {
    console.log('Navigate to featured article detail');
    // TODO: 跳转到特色文章详情
  }, []);

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <TopBar />

      {/* 分类标签栏 */}
      <CategoryTabs onTabChange={handleTabChange} />

      {/* 特色文章横幅 */}
      <FeaturedArticle
        onBookmarkClick={handleFeaturedBookmark}
        onArticleClick={handleFeaturedClick}
      />

      {/* Latest Articles 标题区域 */}
      <section className={styles.latestSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Articles</h2>
          <button
            className={styles.seeAllLink}
            onClick={handleSeeAllClick}
            type="button"
          >
            See all
          </button>
        </div>

        {/* 文章列表 */}
        <div className={styles.articleList}>
          {MOCK_ARTICLES.map(article => (
            <ArticleListItem
              key={article.id}
              article={article}
              onClick={onArticleClick}
              onLikeClick={handleLikeClick}
              onCommentClick={handleCommentClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
