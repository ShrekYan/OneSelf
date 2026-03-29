import React from 'react';
import { useObserver } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { useDetailStore } from './useStore';
import { ArticleActionBar } from '@/components/ArticleActionBar';
import styles from './index.module.scss';

const Detail2Page: React.FC = () => {
  const navigate = useNavigate();
  const store = useDetailStore();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    Toast.show({ content: '分享功能开发中' });
  };

  const handleMore = () => {
    Toast.show({ content: '更多功能开发中' });
  };

  const handleFollow = () => {
    Toast.show({ content: '关注成功' });
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
            <button className={styles.navButton} onClick={handleShare}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="18" cy="5" r="2" fill="currentColor" />
                <circle cx="6" cy="12" r="2" fill="currentColor" />
                <circle cx="18" cy="19" r="2" fill="currentColor" />
                <line
                  x1="8.59"
                  y1="13.51"
                  x2="15.42"
                  y2="17.49"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="15.41"
                  y1="6.51"
                  x2="8.59"
                  y2="10.49"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
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
            <img
              className={styles.coverImage}
              src={store.article.coverUrl}
              alt={store.article.title}
            />
          </div>

          {/* 内容区域 */}
          <div className={styles.contentWrapper}>
            {/* 分类标签 */}
            {store.article.category && (
              <span className={styles.categoryTag}>
                {store.article.category}
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
                  >{`${store.article.publishAt} • ${store.article.readTime} min read`}</span>
                </div>
                <img
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

            {/* 文章正文 */}
            <div className={styles.articleContent}>
              {store.article.content.map((block, index) => {
                if (block.type === 'heading' && block.level === 2) {
                  return (
                    <h2
                      key={index}
                      className={`${styles.heading} ${styles.h2}`}
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === 'heading' && block.level === 3) {
                  return (
                    <h3
                      key={index}
                      className={`${styles.heading} ${styles.h3}`}
                    >
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
                    <img
                      key={index}
                      className={styles.contentImage}
                      src={block.imageUrl}
                      alt=""
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        </main>
      )}

      {/* 底部互动栏 - 严格匹配设计稿结构：[点赞+收藏] 左，分隔线，[更多+分享] 右 */}
      {store.article && (
        <footer className={styles.actionBar}>
          <ArticleActionBar likeCount={10} commentCount={10} />
        </footer>
      )}
    </div>
  ));
};

Detail2Page.displayName = 'Detail2Page';

export default Detail2Page;
