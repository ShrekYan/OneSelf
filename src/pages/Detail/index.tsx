/**
 * Detail1 详情页面
 * @description 根据 Pixso 设计稿生成的详情页面
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import styles from './index.module.scss';
import { useDetail1Store } from './useStore';
import * as handle from './handle';

import type { ArticleSection } from './constant';

/**
 * 格式化数字，超过 1000 显示 k
 */
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return String(num);
};

/**
 * 详情页面组件
 */
const Detail1: React.FC = () => {
  const navigate = useNavigate();
  const store = useDetail1Store();
  const { articleDetail } = store;

  const onBackClick = (): void => {
    navigate(-1);
  };

  const onMoreClick = (): void => {
    handle.handleMoreOptions();
  };

  const onFollowClick = async (): Promise<void> => {
    const confirmed = await handle.confirmFollow();
    if (confirmed) {
      Toast.show({ content: '关注成功' });
    }
  };

  const onLikeClick = (): void => {
    Toast.show({ content: '点赞成功' });
  };

  const onCommentClick = (): void => {
    Toast.show({ content: '评论功能开发中' });
  };

  const onCollectClick = (): void => {
    Toast.show({ content: '收藏成功' });
  };

  const onShareClick = (): void => {
    Toast.show({ content: '分享功能开发中' });
  };

  return useObserver(() => (
    <div className={styles.detail1Container}>
      {/* 顶部导航栏 */}
      <div className={styles.topNav}>
        <div className={styles.navLeft} onClick={onBackClick}>
          <span className={styles.icon}>‹</span>
        </div>
        <div className={styles.navRight} onClick={onMoreClick}>
          <span className={styles.icon}>⋯</span>
        </div>
      </div>

      {/* 封面图 */}
      <div className={styles.coverImage}>
        {/* 如果有图片 URL 可以在这里使用 img 标签 */}
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        {/* 分类标签 */}
        <div className={styles.categoryTag}>{articleDetail.categoryTag}</div>

        {/* 文章标题 */}
        <h1 className={styles.articleTitle}>{articleDetail.title}</h1>

        {/* 作者信息 */}
        <div className={styles.authorBar}>
          <div className={styles.authorAvatar}>{/* 作者头像 */}</div>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>{articleDetail.author.name}</div>
            <div className={styles.meta}>
              {articleDetail.publishDate} • {articleDetail.readTime}
            </div>
          </div>
          <div className={styles.followButton} onClick={onFollowClick}>
            Follow
          </div>
        </div>

        <div className={styles.divider} />

        {/* 文章正文 */}
        {articleDetail.sections.map(
          (section: ArticleSection, index: number) => (
            <React.Fragment key={index}>
              {section.heading && (
                <h2 className={styles.sectionHeading}>{section.heading}</h2>
              )}
              <p className={styles.paragraph}>{section.content}</p>
            </React.Fragment>
          ),
        )}

        {/* 引用块 */}
        <div className={styles.quoteBlock}>
          {/* 悬浮互动栏 */}
          <div className={styles.interactionBar}>
            <div className={styles.interactionItem} onClick={onLikeClick}>
              <span className={styles.icon}>♡</span>
              <span className={styles.count}>
                {formatNumber(articleDetail.interaction.likeCount)}
              </span>
            </div>
            <div className={styles.interactionItem} onClick={onCommentClick}>
              <span className={styles.icon}>💬</span>
              <span className={styles.count}>
                {String(articleDetail.interaction.commentCount)}
              </span>
            </div>
            <div className={styles.divider} />
            <div className={styles.interactionItem} onClick={onCollectClick}>
              <span className={styles.icon}>🗒</span>
            </div>
            <div className={styles.interactionItem} onClick={onShareClick}>
              <span className={styles.icon}>⟲</span>
            </div>
          </div>
          <div className={styles.quoteText}>{articleDetail.quote}</div>
        </div>
      </div>
    </div>
  ));
};

Detail1.displayName = 'Detail1';

export default Detail1;
