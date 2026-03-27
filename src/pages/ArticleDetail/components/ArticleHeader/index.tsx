import React from 'react';
import { Avatar } from 'antd-mobile';
import styles from './index.module.scss';
import type {
  ArticleAuthor,
  ArticleStats,
  ArticleTag,
} from '@/pages/ArticleDetail/types';

interface ArticleHeaderProps {
  title: string;
  publishTime: string;
  author: ArticleAuthor;
  stats: ArticleStats;
  tags: ArticleTag[];
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  publishTime,
  author,
  stats,
  tags,
}) => {
  const formatReadCount = (count: number): string => {
    if (count > 10000) {
      return `${(count / 10000).toFixed(1)}w`;
    }
    return String(count);
  };

  return (
    <div className={styles.articleHeaderContainer}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.meta}>
        <div className={styles.authorInfo}>
          <Avatar src={author.avatar} className={styles.avatar} />
          <div className={styles.authorText}>
            <div className={styles.authorName}>{author.name}</div>
            <div className={styles.time}>{publishTime}</div>
          </div>
        </div>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            {formatReadCount(stats.readCount)} reads
          </span>
          <span className={styles.statItem}>{stats.commentCount} comments</span>
        </div>
      </div>

      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map(tag => (
            <span key={tag.id} className={styles.tag}>
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

ArticleHeader.displayName = 'ArticleHeader';

export default ArticleHeader;
