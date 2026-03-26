/**
 * 文章详情页面类型定义
 */

/**
 * 文章作者信息
 */
export interface ArticleAuthor {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

/**
 * 文章统计信息
 */
export interface ArticleStats {
  readCount: number;
  likeCount: number;
  commentCount: number;
  collectCount: number;
}

/**
 * 文章标签
 */
export interface ArticleTag {
  id: string;
  name: string;
}

/**
 * 文章详情数据结构
 */
export interface ArticleDetail {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  publishTime: string;
  author: ArticleAuthor;
  stats: ArticleStats;
  tags: ArticleTag[];
  isCollected: boolean;
  isLiked: boolean;
}
