/**
 * 文章分类实体
 */
export interface ArticleCategory {
  /** 分类唯一ID */
  id: string;
  /** 分类名称 */
  name: string;
  /** 文章数量 */
  articleCount: number;
  /** 分类封面（可选） */
  imageUrl?: string | null;
  /** 分类描述（可选） */
  description?: string | null;
  /** 排序权重 */
  sortOrder?: number;
}
