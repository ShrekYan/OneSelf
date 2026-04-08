import { ApiProperty } from '@nestjs/swagger';
import { ArticleListItemDto } from '../article/article-list-item.dto';

export class UserLikeListResponseDto {
  @ApiProperty({ type: [ArticleListItemDto], description: '点赞文章列表' })
  list: ArticleListItemDto[];

  @ApiProperty({ description: '符合条件的点赞总数' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页数量' })
  pageSize: number;

  @ApiProperty({ description: '是否还有更多数据' })
  hasMore: boolean;
}
