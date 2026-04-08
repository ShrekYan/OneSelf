/**
 * Discover Home 页面业务处理函数
 * @description 存放文章点击、点赞、评论等事件处理逻辑（纯函数）
 */

import { Toast } from 'antd-mobile';
import { runInAction } from 'mobx';

import api from '@/api';
import type { HomeStoreType } from './useStore';

/**
 * 处理文章点赞/取消点赞
 * @param store - Home store 实例
 * @param articleId - 文章ID
 */
export const handleLikeClick = async (
  store: HomeStoreType,
  articleId: string,
): Promise<void> => {
  // 1. 保存原始状态，用于失败回滚
  const article = store.articles.find(item => item.id === articleId);
  const originalIsLiked = article?.isLiked;
  const originalLikes = article?.likes;

  // 2. 乐观更新：先更新本地状态，给用户即时反馈
  store.toggleLike(articleId);

  try {
    // 3. 调用后端API
    const response = await api.article.toggleLike({ articleId });

    // 4. 用服务端返回的数据校正本地状态（防止乐观更新和实际不一致）
    runInAction(() => {
      // 重新创建整个 articles 数组，确保 MobX 能正确追踪变更
      store.articles = store.articles.map(article => {
        if (article.id === articleId) {
          return {
            ...article,
            isLiked: response.isLiked,
            likes: response.likes,
          };
        }
        return article;
      });

      // 同步更新 likedArticleIds
      if (response.isLiked) {
        store.likedArticleIds.add(articleId);
      } else {
        store.likedArticleIds.delete(articleId);
      }
    });

    // 5. 显示成功提示
    const message = response.isLiked ? '点赞成功' : '取消点赞';
    Toast.show({
      icon: 'success',
      content: message,
    });
  } catch (error) {
    // 6. 请求失败：回滚到原始状态
    console.error('点赞操作失败:', error);
    runInAction(() => {
      // 重新创建整个 articles 数组，确保 MobX 能正确追踪变更
      store.articles = store.articles.map(article => {
        if (
          article.id === articleId &&
          originalIsLiked !== undefined &&
          originalLikes !== undefined
        ) {
          return {
            ...article,
            isLiked: originalIsLiked,
            likes: originalLikes,
          };
        }
        return article;
      });

      // 回滚 likedArticleIds
      if (originalIsLiked) {
        store.likedArticleIds.add(articleId);
      } else {
        store.likedArticleIds.delete(articleId);
      }
    });
    Toast.show({
      icon: 'error',
      content: '操作失败，请重试',
    });
  }
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

import type { NavigateFunction } from 'react-router-dom';

/**
 * 处理查看全部点击事件
 * 跳转到全部文章列表页面，带入当前选中的分类ID
 */
export const handleSeeAllClick = (
  navigate: NavigateFunction,
  categoryId: string,
): void => {
  console.log('Navigate to article list with category:', categoryId);
  // 如果没有选中分类，跳转到全部文章列表
  if (!categoryId) {
    navigate('/articles');
  } else {
    navigate(`/articles/${categoryId}`);
  }
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
  store.fetchArticles();
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
 * 跳转到特色文章详情页，带入文章ID
 */
export const handleFeaturedClick = (
  navigate: NavigateFunction,
  articleId: string,
): void => {
  console.log('Navigate to featured article detail:', articleId);
  navigate(`/article/${articleId}`);
};
