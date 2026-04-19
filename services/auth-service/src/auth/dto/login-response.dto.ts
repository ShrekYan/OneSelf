import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

/**
 * 登录响应 DTO
 */
export class LoginResponseDto {
  @ApiProperty({
    description: '访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: '令牌过期时间（秒）',
    example: 7200,
  })
  expiresIn: number;

  @ApiProperty({
    description: '用户信息',
    type: UserDto,
  })
  user: UserDto;
}
