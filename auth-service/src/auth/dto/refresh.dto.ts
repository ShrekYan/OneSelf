import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 刷新令牌请求 DTO
 */
export class RefreshDto {
  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;
}
