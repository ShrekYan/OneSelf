import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户信息 DTO
 */
export class UserDto {
  @ApiProperty({
    description: '用户ID',
    example: 'a1b2c3d4-1234-5678-90ab-cdef01234567',
  })
  id: string;

  @ApiProperty({
    description: '用户名',
    example: 'user123',
  })
  username: string;

  @ApiProperty({
    description: '邮箱',
    required: false,
    example: 'user@example.com',
  })
  email?: string;

  @ApiProperty({
    description: '头像',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: '昵称',
    required: false,
  })
  nickname?: string;
}
