//import type { NavigateFunction } from 'react-router-dom';
import type { ArticleListStore } from './useStore';

/**
 * 处理分类标签点击
 */
export const handleTabChange = (
  store: ArticleListStore,
  tabId: string,
  // navigate: NavigateFunction,
): void => {
  store.setSelectedCategoryId(tabId);
  // // 同步更新 URL
  // if (tabId === 'all') {
  //   navigate('/articles');
  // } else {
  //   navigate(`/articles/${tabId}`);
  // }
};

/**
 * 处理文章点赞切换
 */
export const handleLikeClick = (
  store: ArticleListStore,
  articleId: string,
): void => {
  store.toggleLike(articleId);
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
