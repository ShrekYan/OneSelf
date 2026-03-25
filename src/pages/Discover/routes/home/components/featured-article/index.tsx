/**
 * 特色文章大图卡片组件
 * 展示置顶/推荐文章的大图卡片，包含封面、标题、描述、作者信息和操作按钮
 */

import React from 'react';
import { useObserver } from 'mobx-react';
import classNames from 'classnames';
import useStore from '../../useStore';
import type { ArticleItem } from '../../constant';
import {
  formatReadTime,
  handleArticleSave,
  useNavigationActions,
} from '../../handle';
import styles from './index.module.scss';

/**
 * 特色文章卡片属性
 */
interface FeaturedArticleProps {
  article: ArticleItem;
}

/**
 * 特色文章大图卡片组件
 */
export const FeaturedArticle = React.memo(
  ({ article }: FeaturedArticleProps) => {
    const store = useStore();
    const { navigateToArticleDetail } = useNavigationActions();

    const handleSaveClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      store.toggleSave(article.id);
      handleArticleSave(article.id, article.isSaved);
    };

    const handleCardClick = () => {
      navigateToArticleDetail(article.id);
    };

    return useObserver(() => (
      <div className={styles.container} onClick={handleCardClick}>
        <div className={styles.imageContainer}>
          <img
            src={article.coverImage}
            alt={article.title}
            className={styles.coverImage}
            loading="lazy"
          />
          {/* 渐变遮罩，让文字更清晰可读 */}
          <div className={styles.overlay}></div>

          {/* 左上角分类标签 */}
          {article.tags.length > 0 && (
            <div className={styles.tags}>
              {article.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 右侧保存按钮 */}
          <button
            className={classNames(
              styles.saveButton,
              article.isSaved && styles.saved,
            )}
            onClick={handleSaveClick}
            title="Save"
          >
            {article.isSaved ? '🔖' : '📎'}
          </button>

          {/* 底部文字内容 - 叠加在图片上 */}
          <div className={styles.content}>
            <h2 className={styles.title}>{article.title}</h2>
            <div className={styles.author}>
              <div className={styles.authorInfo}>
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className={styles.avatar}
                />
                <div>
                  <div className={styles.authorName}>{article.author.name}</div>
                  <div className={styles.meta}>
                    {article.publishDate} · {formatReadTime(article.readTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  },
);

export default FeaturedArticle;
