import React from 'react';
import styles from './index.module.scss';

interface FeaturedArticleProps {
  category?: string;
  title?: string;
  authorName?: string;
  authorAvatar?: string;
  publishDate?: string;
  readTime?: string;
  coverImage?: string;
  onBookmarkClick?: () => void;
  onArticleClick?: () => void;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  category = 'DESIGN',
  title = 'The Future of Mobile Interface Design in 2024',
  authorName = 'Sarah Drasner',
  authorAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  publishDate = 'Oct 24',
  readTime = '5 min read',
  coverImage = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=750&h=400&fit=crop',
  onBookmarkClick,
  onArticleClick,
}) => {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmarkClick) {
      onBookmarkClick();
    }
  };

  return (
    <div
      className={styles.container}
      onClick={onArticleClick}
      role="article"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onArticleClick?.();
        }
      }}
    >
      <div className={styles.coverContainer}>
        <img
          src={coverImage}
          alt={title}
          className={styles.coverImage}
          loading="lazy"
        />
        <div className={styles.categoryTag}>{category}</div>
        <div
          className={styles.bookmarkBtn}
          onClick={handleBookmarkClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onBookmarkClick?.();
            }
          }}
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
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.footer}>
            <div className={styles.authorInfo}>
              <img
                src={authorAvatar}
                alt={authorName}
                className={styles.authorAvatar}
              />
              <span className={styles.authorName}>{authorName}</span>
            </div>
            <div className={styles.meta}>
              <span className={styles.metaItem}>{publishDate}</span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.metaItem}>{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
