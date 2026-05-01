/**
 * ArticleList 页面业务处理函数
 * @description 存放文章点击、点赞、评论等事件处理逻辑（纯函数）
 */

import { Toast } from 'antd-mobile';
import { runInAction } from 'mobx';

import api from '@/api';
import type { ArticleListStore } from './useStore';

/**
 * 处理分类标签点击
 */
export const handleTabChange = (
  store: ArticleListStore,
  tabId: string,
): void => {
  store.setSelectedCategoryId(tabId);
  store.fetchInitialData();
};

/**
 * 处理文章点赞/取消点赞
 * @param store - ArticleList store 实例
 * @param articleId - 文章ID
 */
export const handleLikeClick = async (
  store: ArticleListStore,
  articleId: string,
): Promise<void> => {
  // 1. 保存原始状态，用于失败回滚
  const article = store.allArticles.find(item => item.id === articleId);
  const originalIsLiked = article?.isLiked;
  const originalLikes = article?.likes;

  // 2. 乐观更新：先更新本地状态，给用户即时反馈
  store.toggleLike(articleId);

  try {
    // 3. 调用后端API
    const response = await api.article.toggleLike({ articleId });

    // 4. 用服务端返回的数据校正本地状态（防止乐观更新和实际不一致）
    runInAction(() => {
      // 重新创建整个 allArticles 数组，确保 MobX 能正确追踪变更
      store.allArticles = store.allArticles.map(article => {
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
      // 重新创建整个 allArticles 数组，确保 MobX 能正确追踪变更
      store.allArticles = store.allArticles.map(article => {
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
 * 处理无限滚动加载更多
 */
export const useHandleLoadMore = (store: ArticleListStore) => {
  const handleLoadMore = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await store.fetchMoreArticles();
  };
  return handleLoadMore;
};
