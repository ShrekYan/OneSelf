/**
 * 文章实体
 */
export interface ArticleItem {
  /** 文章唯一ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  summary?: string;
  /** 封面图片URL */
  coverUrl?: string;
  /** 分类信息 */
  category: {
    id: string;
    name: string;
  };
  /** 作者ID */
  authorId: string;
  /** 作者名称 */
  authorName?: string;
  /** 作者头像URL */
  authorAvatar?: string;
  /** 标签列表 */
  tags: string[];
  /** 阅读量 */
  views: number;
  /** 点赞数 */
  likes: number;
  /** 评论数 */
  commentsCount: number;
  /** 发布时间 */
  publishedAt: string;
  /** 是否置顶 */
  isTop?: boolean;
  /** 阅读时间（分钟） */
  readTime?: number;
}
