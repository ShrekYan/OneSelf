/**
 * Discover 页面业务处理函数
 */

import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * 格式化阅读时间
 * @param minutes - 阅读分钟数
 * @returns 格式化后的阅读时间文本
 */
export const formatReadTime = (minutes: number): string => {
  return `${minutes} min read`;
};

/**
 * 格式化点赞数
 * @param count - 点赞数量
 * @returns 格式化后的点赞数字符串，超过1万显示为 x.x万+
 */
export const formatCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}k+`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return `${count}`;
};

/**
 * 截断文本
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * 文章点赞处理
 * @param articleId - 文章 ID
 * @param isLiked - 当前点赞状态
 */
export const handleArticleLike = (
  articleId: string,
  isLiked: boolean,
): void => {
  console.log(
    `Toggle like for article: ${articleId}, current state: ${isLiked}`,
  );
  if (!isLiked) {
    Toast.show({
      icon: 'success',
      content: 'Liked!',
      duration: 1000,
    });
  }
};

/**
 * 文章收藏处理
 * @param articleId - 文章 ID
 * @param isSaved - 当前收藏状态
 */
export const handleArticleSave = (
  articleId: string,
  isSaved: boolean,
): void => {
  console.log(
    `Toggle save for article: ${articleId}, current state: ${isSaved}`,
  );
  if (isSaved) {
    Toast.show({
      icon: 'success',
      content: 'Saved to bookmarks',
      duration: 1000,
    });
  } else {
    Toast.show({
      icon: 'success',
      content: 'Removed from bookmarks',
      duration: 1000,
    });
  }
};

/**
 * 导航操作自定义 Hook
 * 返回用于页面跳转的回调函数
 */
export const useNavigationActions = () => {
  const navigate = useNavigate();

  /**
   * 跳转到文章详情页
   * @param articleId - 文章 ID
   */
  const navigateToArticleDetail = useCallback(
    (articleId: string): void => {
      navigate(`/article/${articleId}`);
    },
    [navigate],
  );

  /**
   * 跳转到作者主页
   * @param authorId - 作者 ID
   */
  const navigateToAuthorProfile = useCallback(
    (authorId: string): void => {
      navigate(`/author/${authorId}`);
    },
    [navigate],
  );

  /**
   * 跳转到搜索页面
   */
  const navigateToSearch = useCallback((): void => {
    navigate('/search');
  }, [navigate]);

  /**
   * 跳转到通知页面
   */
  const navigateToNotifications = useCallback((): void => {
    navigate('/notifications');
  }, [navigate]);

  /**
   * 底部导航跳转处理
   * @param navId - 导航项 ID
   */
  const handleBottomNavClick = useCallback(
    (navId: string): void => {
      switch (navId) {
        case 'home':
          navigate('/home');
          break;
        case 'discover':
          navigate('/discover');
          break;
        case 'create':
          navigate('/create');
          break;
        case 'bookmarks':
          navigate('/bookmarks');
          break;
        case 'profile':
          navigate('/profile');
          break;
        default:
          break;
      }
    },
    [navigate],
  );

  return {
    navigateToArticleDetail,
    navigateToAuthorProfile,
    navigateToSearch,
    navigateToNotifications,
    handleBottomNavClick,
  };
};
