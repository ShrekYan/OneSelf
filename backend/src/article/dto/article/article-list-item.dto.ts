import { ApiProperty } from '@nestjs/swagger';

export class ArticleCategoryInfoDto {
  @ApiProperty({ description: '分类ID' })
  id: string;

  @ApiProperty({ description: '分类名称' })
  name: string;
}

export class ArticleListItemDto {
  @ApiProperty({ description: '文章ID' })
  id: string;

  @ApiProperty({ description: '文章标题' })
  title: string;

  @ApiProperty({ description: '文章摘要', required: false })
  summary?: string;

  @ApiProperty({ description: '封面图片URL', required: false })
  coverUrl?: string;

  @ApiProperty({ type: ArticleCategoryInfoDto, description: '分类信息' })
  category: ArticleCategoryInfoDto;

  @ApiProperty({ description: '作者ID' })
  authorId: string;

  @ApiProperty({ description: '作者名称', required: false })
  authorName?: string;

  @ApiProperty({ description: '作者头像URL', required: false })
  authorAvatar?: string;

  @ApiProperty({ type: [String], description: '标签' })
  tags: string[];

  @ApiProperty({ description: '阅读量' })
  views: number;

  @ApiProperty({ description: '点赞数' })
  likes: number;

  @ApiProperty({ description: '评论数' })
  commentsCount: number;

  @ApiProperty({ description: '发布时间' })
  publishedAt: string;

  @ApiProperty({ description: '是否置顶（特色文章）', required: false })
  isTop?: boolean;

  @ApiProperty({ description: '阅读时间（分钟）', required: false })
  readTime?: number;
}
