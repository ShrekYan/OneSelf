import { ApiProperty } from '@nestjs/swagger';

export class UserLikeListByUserIdResponseDto {
  @ApiProperty({ type: [String], description: '点赞的文章ID列表' })
  articleIds: string[];
}
