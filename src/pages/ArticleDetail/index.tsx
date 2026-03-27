/**
 * 文章详情页面
 * @description 展示文章的完整内容，支持点赞、收藏、评论等交互
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import { Toast } from 'antd-mobile';
import styles from './index.module.scss';
import useArticleDetailStore from './useStore';
import {
  ArticleHeader,
  ArticleContent,
  ArticleActions,
  ArticleFooter,
} from './components';

/**
 * 文章详情页面主组件
 */
const ArticleDetail: React.FC = () => {
  const store = useArticleDetailStore();

  const handleToggleLike = (): void => {
    store.toggleLike();
    Toast.show({
      content: store.article.isLiked ? 'Liked' : 'Unliked',
      duration: 1500,
    });
  };

  const handleToggleCollect = (): void => {
    store.toggleCollect();
    Toast.show({
      content: store.article.isCollected ? 'Saved' : 'Unsaved',
      duration: 1500,
    });
  };

  const handleCommentClick = (): void => {
    Toast.show({
      content: 'Comments feature is under development',
      duration: 1500,
    });
  };

  const handleShareClick = (): void => {
    Toast.show({
      content: 'Share feature is under development',
      duration: 1500,
    });
  };

  return useObserver(() => (
    <div className={styles.articleDetailRoot}>
      <ArticleHeader
        title={store.article.title}
        publishTime={store.article.publishTime}
        author={store.article.author}
        stats={store.article.stats}
        tags={store.article.tags}
      />
      <ArticleContent content={store.article.content} />
      <ArticleFooter authorBio={store.article.author.bio} />
      <ArticleActions
        isLiked={store.article.isLiked}
        isCollected={store.article.isCollected}
        likeCount={store.article.stats.likeCount}
        collectCount={store.article.stats.collectCount}
        onToggleLike={handleToggleLike}
        onToggleCollect={handleToggleCollect}
        onCommentClick={handleCommentClick}
        onShareClick={handleShareClick}
      />
    </div>
  ));
};

ArticleDetail.displayName = 'ArticleDetail';

export default ArticleDetail;
