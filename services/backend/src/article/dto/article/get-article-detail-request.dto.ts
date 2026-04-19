import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetArticleDetailRequestDto {
  @ApiProperty({ description: '文章ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
