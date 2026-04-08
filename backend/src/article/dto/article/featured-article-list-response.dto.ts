import { ApiProperty } from '@nestjs/swagger';
import { FeaturedArticleItemDto } from './featured-article-item.dto';

export class FeaturedArticleListResponseDto {
  @ApiProperty({ type: [FeaturedArticleItemDto], description: '特色文章列表' })
  list: FeaturedArticleItemDto[];
}
