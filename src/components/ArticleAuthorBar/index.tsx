import React from 'react';
import { useObserver } from 'mobx-react';
import classNames from 'classnames';
import styles from './index.module.scss';

export interface ArticleAuthorBarProps {
  /** 作者头像 URL */
  avatar: string;
  /** 作者名称 */
  authorName: string;
  /** 发布日期 */
  publishDate: string;
  /** 阅读时间（分钟）*/
  readingTime: number;
  /** 是否已关注 */
  isFollowed?: boolean;
  /** 关注按钮点击回调 */
  onFollowClick?: () => void;
  /** 自定义 className */
  className?: string;
}

const ArticleAuthorBar: React.FC<ArticleAuthorBarProps> = ({
  avatar,
  authorName,
  publishDate,
  readingTime,
  isFollowed = false,
  onFollowClick,
  className,
}) => {
  return useObserver(() => (
    <div className={classNames(styles.articleAuthorBarContainer, className)}>
      <div className={styles.leftSection}>
        <img src={avatar} alt={authorName} className={styles.avatar} />
        <div className={styles.info}>
          <h3 className={styles.authorName}>{authorName}</h3>
          <p className={styles.meta}>
            {publishDate} • {readingTime} min read
          </p>
        </div>
      </div>
      <button
        className={classNames(
          styles.followButton,
          isFollowed && styles.followed,
        )}
        onClick={onFollowClick}
        type="button"
      >
        {isFollowed ? 'Following' : 'Follow'}
      </button>
    </div>
  ));
};

ArticleAuthorBar.displayName = 'ArticleAuthorBar';

export default ArticleAuthorBar;
