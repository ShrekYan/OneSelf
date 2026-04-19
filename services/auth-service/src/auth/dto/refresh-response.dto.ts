import { ApiProperty } from '@nestjs/swagger';

/**
 * 刷新令牌响应 DTO
 */
export class RefreshResponseDto {
  @ApiProperty({
    description: '访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '令牌过期时间（秒）',
    example: 7200,
  })
  expiresIn: number;
}
