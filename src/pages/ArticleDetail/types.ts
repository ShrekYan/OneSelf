/**
 * Article detail page type definitions
 */

/**
 * Article author information
 */
export interface ArticleAuthor {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

/**
 * Article statistics
 */
export interface ArticleStats {
  readCount: number;
  likeCount: number;
  commentCount: number;
  collectCount: number;
}

/**
 * Article tag
 */
export interface ArticleTag {
  id: string;
  name: string;
}

/**
 * Article detail data structure
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
