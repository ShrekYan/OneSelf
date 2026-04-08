import { ApiProperty } from '@nestjs/swagger';

export class CheckLikeStatusResponseDto {
  @ApiProperty({ description: '文章ID' })
  articleId: string;

  @ApiProperty({ description: '当前用户是否已点赞' })
  isLiked: boolean;
}
