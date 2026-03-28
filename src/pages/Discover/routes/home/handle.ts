/**
 * Discover Home 页面业务处理函数
 * @description 存放文章点击、点赞、评论等事件处理逻辑（纯函数）
 */

import { Toast } from 'antd-mobile';

import type { HomeStoreType } from '../home/useStore';

/**
 * 处理文章点赞/取消点赞
 * @param store - Home store 实例
 * @param articleId - 文章ID
 */
export const handleLikeClick = (
  store: HomeStoreType,
  articleId: string,
): void => {
  store.toggleLike(articleId);
  const article = store.articles.find(item => item.id === articleId);
  if (article) {
    const message = article.isLiked ? '点赞成功' : '取消点赞';
    Toast.show({
      icon: 'success',
      content: message,
    });
  }
  console.log('Like article:', articleId);
};

/**
 * 处理文章评论点击事件
 * 打开评论弹窗或跳转到评论页面
 * @param articleId - 文章ID
 */
export const handleCommentClick = (articleId: string): void => {
  console.log('Open comments for article:', articleId);
  // TODO: 打开评论弹窗或跳转到评论页面
};

/**
 * 处理查看全部点击事件
 * 跳转到全部文章列表页面
 */
export const handleSeeAllClick = (): void => {
  console.log('Navigate to see all articles');
  // TODO: 跳转到全部文章列表
};

/**
 * 处理分类标签切换
 * @param store - Home store 实例
 * @param categoryId - 分类ID
 */
export const handleTabChange = (
  store: HomeStoreType,
  categoryId: string,
): void => {
  store.setActiveCategory(categoryId);
  console.log('Switch to category tab:', categoryId);
};

/**
 * 处理特色文章收藏点击
 */
export const handleFeaturedBookmark = (articleId: string): void => {
  console.log('Bookmark featured article:', articleId);
  Toast.show({
    icon: 'success',
    content: '收藏成功',
  });
  // TODO: 收藏特色文章
};

/**
 * 处理特色文章点击
 * 跳转到特色文章详情页
 */
export const handleFeaturedClick = (articleId: string): void => {
  console.log('Navigate to featured article detail:', articleId);
  // TODO: 跳转到特色文章详情
};
