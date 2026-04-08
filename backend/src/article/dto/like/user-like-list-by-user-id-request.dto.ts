import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserLikeListByUserIdRequestDto {
  @ApiProperty({ description: '目标用户ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
