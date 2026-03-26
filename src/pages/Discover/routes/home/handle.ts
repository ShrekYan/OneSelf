/**
 * Discover Home 页面业务处理函数
 * @description 存放文章点击、点赞、评论等事件处理逻辑
 */

import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import useHomeStore from './useStore';

/**
 * 处理文章点击事件
 * @description 使用柯里化，在组件顶层获取 navigate
 * 跳转到文章详情页
 */
export const useHandleArticleClick = () => {
  const navigate = useNavigate();
  return (articleId: string): void => {
    console.log('Navigate to article detail:', articleId);
    navigate(`/article/${articleId}`);
  };
};

/**
 * 处理文章点赞/取消点赞
 * @param store - Home store 实例
 * @param articleId - 文章ID
 */
export const handleLikeClick = (
  store: ReturnType<typeof useHomeStore>,
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
  store: ReturnType<typeof useHomeStore>,
  categoryId: string,
): void => {
  store.setActiveCategory(categoryId);
  console.log('Switch to category tab:', categoryId);
  // TODO: 加载对应分类的文章
};

/**
 * 处理特色文章收藏点击
 * @description 使用柯里化，在组件顶层获取 navigate
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
 * @description 使用柯里化，在组件顶层获取 navigate
 * 跳转到特色文章详情页
 */
export const handleFeaturedClick = (): void => {
  console.log('Navigate to featured article detail');
  // TODO: 跳转到特色文章详情
};

/**
 * 加载文章列表数据
 * @param store - Home store 实例
 */
export const fetchArticles = (store: ReturnType<typeof useHomeStore>): void => {
  store.setLoading(true);
  try {
    // TODO: 调用 API 获取文章列表
    // const response = await articleApi.getList({
    //   page: store.currentPage,
    //   pageSize: store.pageSize,
    //   categoryId: store.activeCategoryId,
    // });
    // store.setArticles(response.list);
    // store.setHasMore(response.hasMore);
  } catch (error) {
    console.error('加载文章列表失败:', error);
    Toast.show({
      icon: 'fail',
      content: '加载失败，请重试',
    });
  } finally {
    store.setLoading(false);
  }
};

/**
 * 加载更多文章
 * @param store - Home store 实例
 */
export const loadMoreArticles = (
  store: ReturnType<typeof useHomeStore>,
): void => {
  if (store.loading || !store.hasMore) return;

  try {
    // TODO: 调用 API 加载更多文章
    // const response = await articleApi.getList({
    //   page: store.currentPage + 1,
    //   pageSize: store.pageSize,
    //   categoryId: store.activeCategoryId,
    // });
    // store.appendArticles(response.list);
    // store.setHasMore(response.hasMore);
  } catch (error) {
    console.error('加载更多文章失败:', error);
    Toast.show({
      icon: 'fail',
      content: '加载更多失败，请重试',
    });
  }
};
