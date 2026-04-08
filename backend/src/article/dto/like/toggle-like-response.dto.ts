import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeResponseDto {
  @ApiProperty({ description: '文章ID' })
  articleId: string;

  @ApiProperty({ description: '当前点赞数' })
  likes: number;

  @ApiProperty({ description: '当前是否已点赞' })
  isLiked: boolean;
}
