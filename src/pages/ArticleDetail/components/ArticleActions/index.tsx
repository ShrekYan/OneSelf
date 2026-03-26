import React from 'react';
import styles from './index.module.scss';

interface ArticleActionsProps {
  isLiked: boolean;
  isCollected: boolean;
  likeCount: number;
  collectCount: number;
  onToggleLike: () => void;
  onToggleCollect: () => void;
  onCommentClick: () => void;
  onShareClick: () => void;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
  isLiked,
  isCollected,
  likeCount,
  collectCount,
  onToggleLike,
  onToggleCollect,
  onCommentClick,
  onShareClick,
}) => {
  const formatCount = (count: number): string => {
    if (count > 10000) {
      return `${(count / 10000).toFixed(1)}w`;
    }
    return String(count);
  };

  return (
    <div className={styles.articleActionsContainer}>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.actionItem} ${isLiked ? styles.active : ''}`}
          onClick={onToggleLike}
        >
          {isLiked ? (
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              className={styles.icon}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ) : (
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={styles.icon}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
          <span className={styles.label}>{formatCount(likeCount)}</span>
        </button>

        <button
          type="button"
          className={`${styles.actionItem} ${isCollected ? styles.active : ''}`}
          onClick={onToggleCollect}
        >
          {isCollected ? (
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              className={styles.icon}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : (
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={styles.icon}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          <span className={styles.label}>{formatCount(collectCount)}</span>
        </button>

        <button
          type="button"
          className={styles.actionItem}
          onClick={onCommentClick}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.icon}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className={styles.label}>评论</span>
        </button>

        <button
          type="button"
          className={styles.actionItem}
          onClick={onShareClick}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.icon}
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className={styles.label}>分享</span>
        </button>
      </div>
    </div>
  );
};

ArticleActions.displayName = 'ArticleActions';

export default ArticleActions;
