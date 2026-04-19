import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户信息响应 DTO
 * 返回当前登录用户的详细信息
 */
export class UserInfoDto {
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

  @ApiProperty({
    description: '个人简介',
    example: '热爱写作的程序员',
    required: false,
  })
  bio?: string;
}
