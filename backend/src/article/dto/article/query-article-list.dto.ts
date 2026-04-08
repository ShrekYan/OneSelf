import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ArticleSortBy {
  PUBLISHED_AT = 'publishedAt', // 最新发布（默认）
  VIEWS = 'views', // 热门（阅读量降序）
  LIKES = 'likes', // 最多点赞（点赞降序）
}

// 查询文章列表请求参数
export class QueryArticleListDto {
  @ApiProperty({ required: false, default: 1, description: '页码' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, description: '每页数量' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @ApiProperty({ required: false, description: '按分类ID筛选' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    required: false,
    description: '关键词搜索（标题/摘要模糊匹配）',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    required: false,
    enum: ArticleSortBy,
    default: ArticleSortBy.PUBLISHED_AT,
    description: '排序方式',
  })
  @IsOptional()
  @IsEnum(ArticleSortBy)
  sortBy?: ArticleSortBy = ArticleSortBy.PUBLISHED_AT;
}
