/**
 * 文章实体
 */
export interface ArticleItem {
  /** 文章唯一ID */
  id: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  summary: string;
  /** 封面图片URL */
  coverUrl?: string;
  /** 发布时间 */
  publishAt: string;
  /** 作者ID */
  authorId: string;
  /** 作者名称 */
  authorName: string;
  /** 分类ID */
  categoryId: string;
  /** 分类名称 */
  categoryName: string;
  /** 阅读量 */
  views: number;
  /** 点赞数 */
  likes: number;
}
