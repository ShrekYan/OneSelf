import React from 'react';
import styles from './index.module.scss';

export interface ArticleActionBarProps {
  /** 点赞数 */
  likeCount: number;
  /** 评论数 */
  commentCount: number;
  /** 是否已点赞 */
  isLiked?: boolean;
  /** 是否已收藏 */
  isCollected?: boolean;
  /** 点赞点击回调 */
  onLikeClick?: () => void;
  /** 评论点击回调 */
  onCommentClick?: () => void;
  /** 分享点击回调 */
  onShareClick?: () => void;
  /** 收藏点击回调 */
  onCollectClick?: () => void;
}

/**
 * 文章详情页底部悬浮互动操作栏
 * 包含点赞、评论、分享、收藏功能
 */
export const ArticleActionBar: React.FC<ArticleActionBarProps> = ({
  likeCount,
  commentCount,
  isLiked = false,
  isCollected = false,
  onLikeClick,
  onCommentClick,
  onShareClick,
  onCollectClick,
}) => {
  // 格式化数字显示，超过 1000 显示 k
  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return String(count);
  };

  return (
    <div className={styles.articleActionBarContainer}>
      <div className={styles.leftGroup}>
        <button
          className={`${styles.actionBtn} ${isLiked ? styles.active : ''}`}
          onClick={onLikeClick}
          aria-label={isLiked ? '取消点赞' : '点赞'}
        >
          <svg
            className={styles.icon}
            width={26}
            height={26}
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.1667 2.83333C19.6924 2.35906 19.1311 2.00085 18.5187 1.78677C17.9063 1.57269 17.2621 1.50821 16.625 1.59833C15.7708 1.71667 14.9667 2.10833 14.3333 2.70833L13.1667 3.83333L11.9583 2.66667C10.6667 1.45833 8.91667 1.45833 7.625 2.66667C6.33333 3.875 6.33333 5.66667 7.625 6.91667L8.83333 8.08333L13.1667 12.5L17.5 8.08333C18.6667 6.91667 19 5.66667 18.75 4.33333C18.5 2.99999 17.5 2.16666 16.75 1.83333"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.25 7.75C1.75 9.25 1.75 11.5833 3.25 13.0833L5.25 15.0833C6.75 16.5833 9.25 16.5833 10.75 15.0833"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.count}>{formatCount(likeCount)}</span>
        </button>

        <button
          className={styles.actionBtn}
          onClick={onCommentClick}
          aria-label="评论"
        >
          <svg
            className={styles.icon}
            width={26}
            height={26}
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.33 2.67C19.01 1.35 17.24 0.67 15.42 0.67C13.6 0.67 11.83 1.35 10.51 2.67L9.17 4.01L10.51 5.35C11.83 6.67 13.6 7.35 15.42 7.35C17.24 7.35 19.01 6.67 20.33 5.35C21.65 4.03 22.33 2.26 22.33 0.44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse
              cx="15.42"
              cy="5.33"
              rx="2.75"
              ry="2.75"
              fill="currentColor"
            />
            <path
              d="M11.67 5.33C10.35 4.01 8.58 3.33 6.75 3.33C4.93 3.33 3.16 4.01 1.84 5.33C0.52 6.65 -0.16 8.42 0.16 10.25C0.16 11.25 0.51 12.17 1 13L3 16C4.5 17.5 6 18 7.5 18C8.17 18 9.01 17.67 9.84 17.01L11.18 15.67C12.5 14.35 13.17 12.58 13.17 10.75C13.17 8.93 12.99 7.01 11.67 5.33Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="5.75" cy="5.75" r="1.25" fill="currentColor" />
            <circle cx="11.25" cy="12.75" r="1.25" fill="currentColor" />
            <circle cx="8.5" cy="9.25" r="1.25" fill="currentColor" />
          </svg>
          <span className={styles.count}>{formatCount(commentCount)}</span>
        </button>
      </div>

      <div className={styles.rightGroup}>
        <button
          className={styles.iconBtn}
          onClick={onShareClick}
          aria-label="分享"
        >
          <svg
            className={styles.icon}
            width={22}
            height={22}
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 1.5L11.5 5L6.5 8.5"
              stroke="currentColor"
              strokeWidth="1.83"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.5 4.5C1.5 3.395 2.395 2.5 3.5 2.5H8.5"
              stroke="currentColor"
              strokeWidth="1.83"
              strokeLinecap="round"
            />
            <path
              d="M3.5 8.5H8.5C9.605 8.5 10.5 9.395 10.5 10.5V14.5C10.5 15.605 9.605 16.5 8.5 16.5H3.5C2.395 16.5 1.5 15.605 1.5 14.5V10.5C1.5 9.395 2.395 8.5 3.5 8.5Z"
              stroke="currentColor"
              strokeWidth="1.83"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          className={`${styles.iconBtn} ${isCollected ? styles.active : ''}`}
          onClick={onCollectClick}
          aria-label={isCollected ? '取消收藏' : '收藏'}
        >
          <svg
            className={styles.icon}
            width={22}
            height={22}
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 2L13.33 6.72L18.5 7.46L14.75 11.14L15.67 16.3L11 13.77L6.33 16.3L7.25 11.14L3.5 7.46L8.67 6.72L11 2Z"
              stroke="currentColor"
              strokeWidth="1.83"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

ArticleActionBar.displayName = 'ArticleActionBar';

export default ArticleActionBar;
