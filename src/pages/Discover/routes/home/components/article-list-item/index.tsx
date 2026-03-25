/**
 * 文章列表项组件
 * 在文章列表中展示单个文章项，包含缩略图、标题、作者信息和操作按钮
 */

import React from 'react';
import { useObserver } from 'mobx-react';
import classNames from 'classnames';
import useStore from '../../useStore';
import type { ArticleItem } from '../../constant';
import {
  formatReadTime,
  formatCount,
  handleArticleLike,
  handleArticleSave,
  useNavigationActions,
} from '../../handle';
import styles from './index.module.scss';

/**
 * 文章列表项属性
 */
interface ArticleListItemProps {
  article: ArticleItem;
}

/**
 * 文章列表项组件
 */
export const ArticleListItem = React.memo(
  ({ article }: ArticleListItemProps) => {
    const store = useStore();
    const { navigateToArticleDetail } = useNavigationActions();

    const handleLikeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      store.toggleLike(article.id);
      handleArticleLike(article.id, article.isLiked);
    };

    const handleSaveClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      store.toggleSave(article.id);
      handleArticleSave(article.id, article.isSaved);
    };

    const handleItemClick = () => {
      navigateToArticleDetail(article.id);
    };

    return useObserver(() => (
      <div className={styles.container} onClick={handleItemClick}>
        <div className={styles.content}>
          {/* 图片在左侧 */}
          <div className={styles.imageContainer}>
            <img
              src={article.coverImage}
              alt={article.title}
              className={styles.coverImage}
              loading="lazy"
            />
            {/* 阅读时间标签放在图片左上角 */}
            <div className={styles.readTimeBadge}>
              {formatReadTime(article.readTime)}
            </div>
          </div>

          {/* 文字内容在右侧 */}
          <div className={styles.textContent}>
            <div>
              <h3 className={styles.title}>{article.title}</h3>
              <p className={styles.description}>{article.description}</p>
            </div>

            {/* 底部：作者信息在左，点赞+收藏+评论按钮在右，同一行 */}
            <div className={styles.footer}>
              <div className={styles.author}>
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className={styles.avatar}
                />
                <span className={styles.authorName}>{article.author.name}</span>
              </div>
              <div className={styles.actions}>
                <button
                  className={classNames(
                    styles.actionButton,
                    article.isLiked && styles.liked,
                  )}
                  onClick={handleLikeClick}
                >
                  <span className={styles.icon}>
                    {article.isLiked ? '❤️' : '🤍'}
                  </span>
                  <span>{formatCount(article.likes)}</span>
                </button>
                <button
                  className={classNames(
                    styles.actionButton,
                    article.isSaved && styles.saved,
                  )}
                  onClick={handleSaveClick}
                >
                  <span className={styles.icon}>
                    {article.isSaved ? '🔖' : '📎'}
                  </span>
                </button>
                <button
                  className={styles.actionButton}
                  onClick={e => e.stopPropagation()}
                >
                  <span className={styles.icon}>💬</span>
                  <span>{formatCount(article.comments)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  },
);

export default ArticleListItem;
