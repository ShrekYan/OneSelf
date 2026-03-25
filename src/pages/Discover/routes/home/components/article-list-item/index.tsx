import React from 'react';
import styles from './index.module.scss';

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  readTime: string;
  likes: number;
  comments: number;
  coverImage?: string;
  hasCover?: boolean;
}

interface ArticleListItemProps {
  article: ArticleItem;
  onClick?: (articleId: string) => void;
  onLikeClick?: (articleId: string) => void;
  onCommentClick?: (articleId: string) => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return String(num);
};

const ArticleListItem: React.FC<ArticleListItemProps> = ({
  article,
  onClick,
  onLikeClick,
  onCommentClick,
}) => {
  const {
    id,
    title,
    description,
    authorName,
    authorAvatar,
    readTime,
    likes,
    comments,
    coverImage,
    hasCover = true,
  } = article;

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeClick) {
      onLikeClick(id);
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCommentClick) {
      onCommentClick(id);
    }
  };

  if (!hasCover) {
    return (
      <div
        className={styles.container}
        onClick={handleClick}
        role="article"
        tabIndex={0}
      >
        <div className={styles.contentFull}>
          <div className={styles.infoFull}>
            <span className={styles.readTimeBadge}>{readTime}</span>
            <h3 className={styles.titleFull}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <div className={styles.footer}>
              <div className={styles.authorInfo}>
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className={styles.authorAvatar}
                />
                <span className={styles.authorName}>{authorName}</span>
              </div>
              <div className={styles.stats}>
                <div
                  className={styles.statBtn}
                  onClick={handleLike}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      onLikeClick?.(id);
                    }
                  }}
                  aria-label={`${likes} 点赞`}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>{formatNumber(likes)}</span>
                </div>
                <div
                  className={styles.statBtn}
                  onClick={handleComment}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      onCommentClick?.(id);
                    }
                  }}
                  aria-label={`${comments} 评论`}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                  <span>{formatNumber(comments)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      onClick={handleClick}
      role="article"
      tabIndex={0}
    >
      <div className={styles.content}>
        <div className={styles.info}>
          <span className={styles.readTimeBadge}>{readTime}</span>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <div className={styles.footer}>
            <div className={styles.authorInfo}>
              <img
                src={authorAvatar}
                alt={authorName}
                className={styles.authorAvatar}
              />
              <span className={styles.authorName}>{authorName}</span>
            </div>
            <div className={styles.stats}>
              <div
                className={styles.statBtn}
                onClick={handleLike}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onLikeClick?.(id);
                  }
                }}
                aria-label={`${likes} 点赞`}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>{formatNumber(likes)}</span>
              </div>
              <div
                className={styles.statBtn}
                onClick={handleComment}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onCommentClick?.(id);
                  }
                }}
                aria-label={`${comments} 评论`}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                <span>{formatNumber(comments)}</span>
              </div>
            </div>
          </div>
        </div>
        {coverImage && hasCover && (
          <div className={styles.coverContainer}>
            <img
              src={coverImage}
              alt={title}
              className={styles.coverImage}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ArticleListItem);
