import React from 'react';
import { Swiper } from 'antd-mobile';
import { LazyImage } from '@/components';
import styles from './index.module.scss';
import type { FeaturedArticleItem } from '../../constant';

interface FeaturedArticleProps {
  articles: FeaturedArticleItem[];
  onBookmarkClick: (articleId: string) => void;
  onArticleClick: (articleId: string) => void;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  articles,
  onBookmarkClick,
  onArticleClick,
}) => {
  const handleBookmarkClick = (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    onBookmarkClick(articleId);
  };

  const handleKeyDownBookmark = (e: React.KeyboardEvent, articleId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      onBookmarkClick(articleId);
    }
  };

  const handleArticleKeyDown = (e: React.KeyboardEvent, articleId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onArticleClick(articleId);
    }
  };

  return (
    <div className={styles.featuredArticleRoot}>
      <div className={styles.swiperContainer}>
        <Swiper
          className={styles.swiper}
          autoplay={true}
          autoplayInterval={5000}
          loop={true}
          direction="horizontal"
          indicatorProps={{
            className: styles.indicator,
          }}
        >
          {articles.map(item => (
            <Swiper.Item key={item.id}>
              <div
                className={styles.coverContainer}
                onClick={() => onArticleClick(item.id)}
                role="article"
                tabIndex={0}
                onKeyDown={e => handleArticleKeyDown(e, item.id)}
              >
                <LazyImage
                  src={item.coverImage}
                  alt={item.title}
                  className={styles.coverImage}
                />
                <div className={styles.categoryTag}>{item.category}</div>
                <div
                  className={styles.bookmarkBtn}
                  onClick={e => handleBookmarkClick(e, item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => handleKeyDownBookmark(e, item.id)}
                  aria-label="收藏"
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className={styles.overlay}>
                  <h2 className={styles.title}>{item.title}</h2>
                  <div className={styles.footer}>
                    <div className={styles.authorInfo}>
                      <LazyImage
                        src={item.authorAvatar}
                        alt={item.authorName}
                        className={styles.authorAvatar}
                      />
                      <span className={styles.authorName}>
                        {item.authorName}
                      </span>
                    </div>
                    <div className={styles.meta}>
                      <span className={styles.metaItem}>
                        {item.publishDate}
                      </span>
                      <span className={styles.metaDivider}>•</span>
                      <span className={styles.metaItem}>{item.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedArticle;
