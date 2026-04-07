import React from 'react';
import { useObserver } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { useDetailStore } from './useStore';
import { ArticleActionBar } from '@/components/ArticleActionBar';
import { LazyImage } from '@/components/LazyImage';
import styles from './index.module.scss';

const Detail2Page: React.FC = () => {
  const navigate = useNavigate();
  const store = useDetailStore();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleMore = () => {
    Toast.show({ content: '更多功能开发中' });
  };

  const handleFollow = () => {
    Toast.show({ content: '关注成功' });
  };

  const handleToggleLike = () => {
    store.toggleLike();
  };

  const handleToggleCollect = () => {
    store.toggleCollect();
  };

  return useObserver(() => (
    <div className={styles.detail2Container}>
      {/* 顶部导航栏 - 匹配设计稿顺序：返回左，更多+分享右 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.navButton} onClick={handleGoBack}>
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
          <div className={styles.rightActions}>
            <button className={styles.navButton} onClick={handleMore}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="19" cy="12" r="2" fill="currentColor" />
                <circle cx="5" cy="12" r="2" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {store.article && (
        <main className={styles.main}>
          {/* 封面图片 */}
          <div className={styles.coverWrapper}>
            <LazyImage
              className={styles.coverImage}
              src={store.article.coverUrl || ''}
              alt={store.article.title}
            />
          </div>

          {/* 文章元信息 - 需要吸顶：分类+标题+作者信息 */}
          <div className={styles.articleMetaWrapper}>
            {/* 分类标签 */}
            {store.article.category && (
              <span className={styles.categoryTag}>
                {store.article.category.name}
              </span>
            )}

            {/* 文章标题 */}
            <h1 className={styles.articleTitle}>{store.article.title}</h1>

            {/* 作者信息 - 设计稿顺序：[文字信息 + 头像] 左，Follow 按钮右 */}
            <div className={styles.authorBar}>
              <div className={styles.authorInfo}>
                <div className={styles.authorMeta}>
                  <span className={styles.authorName}>
                    {store.article.author.name}
                  </span>
                  <span
                    className={styles.publishMeta}
                  >{`${store.article.publishAt ? new Date(store.article.publishAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} • ${store.article.readTime || 1} min read`}</span>
                </div>
                <LazyImage
                  className={styles.avatar}
                  src={store.article.author.avatar}
                  alt={store.article.author.name}
                />
              </div>
              <button className={styles.followButton} onClick={handleFollow}>
                Follow
              </button>
            </div>

            <hr className={styles.divider} />
          </div>

          {/* 文章正文 - 独立容器，继续滚动 */}
          <div className={styles.articleContent}>
            {store.article.content.map((block, index) => {
              if (block.type === 'heading' && block.level === 2) {
                return (
                  <h2 key={index} className={`${styles.heading} ${styles.h2}`}>
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'heading' && block.level === 3) {
                return (
                  <h3 key={index} className={`${styles.heading} ${styles.h3}`}>
                    {block.text}
                  </h3>
                );
              }
              if (block.type === 'paragraph') {
                return (
                  <p key={index} className={styles.paragraph}>
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'quote') {
                return (
                  <blockquote key={index} className={styles.quote}>
                    {block.text}
                  </blockquote>
                );
              }
              if (block.type === 'image' && block.imageUrl) {
                return (
                  <LazyImage
                    key={index}
                    className={styles.contentImage}
                    src={block.imageUrl}
                    alt=""
                  />
                );
              }
              if (
                block.type === 'list' &&
                block.items &&
                block.items.length > 0
              ) {
                return (
                  <ul key={index} className={styles.listBlock}>
                    {block.items.map((item, idx) => (
                      <li key={idx} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>
        </main>
      )}

      {/* 底部互动栏 - 严格匹配设计稿结构：[点赞+收藏] 左，分隔线，[更多+分享] 右 */}
      {store.article && (
        <footer className={styles.actionBar}>
          <ArticleActionBar
            likeCount={store.article.likes || 0}
            commentCount={store.article.commentsCount || 0}
            isLiked={store.isLiked}
            onLikeClick={handleToggleLike}
            isCollected={store.isCollected}
            onCollectClick={handleToggleCollect}
          />
        </footer>
      )}
    </div>
  ));
};

Detail2Page.displayName = 'Detail2Page';

export default Detail2Page;
