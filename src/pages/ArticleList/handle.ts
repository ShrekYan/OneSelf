import type { ArticleListStore } from './useStore';

/**
 * 处理分类标签点击
 */
export const handleTabChange = (
  store: ArticleListStore,
  tabId: string,
): void => {
  store.setSelectedCategoryId(tabId);
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
