import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户信息 DTO
 * 与 auth-service 的 UserDto 保持完全一致，确保前后端字段对齐
 */
export class UserDto {
  @ApiProperty({
    description: '用户 ID',
    example: 'author-1',
  })
  id: string;

  @ApiProperty({
    description: '用户名（手机号）',
    example: '13800138000',
  })
  username: string;

  @ApiProperty({
    description: '邮箱',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: '昵称',
    example: '张三',
    required: false,
  })
  nickname?: string;

  @ApiProperty({
    description: '头像 URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;
}
