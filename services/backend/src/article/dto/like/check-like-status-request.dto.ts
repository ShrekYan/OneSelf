import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CheckLikeStatusRequestDto {
  @ApiProperty({ description: '文章ID' })
  @IsString()
  @IsNotEmpty()
  articleId: string;
}
