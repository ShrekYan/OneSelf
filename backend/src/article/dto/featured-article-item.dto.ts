import { ApiProperty } from '@nestjs/swagger';
import { ArticleListItemDto } from './article-list-item.dto';

export class FeaturedArticleItemDto extends ArticleListItemDto {
  @ApiProperty({ description: '阅读时间（分钟）' })
  declare readTime: number;
}
