import { ApiProperty } from '@nestjs/swagger';

/**
 * 更新用户信息请求 DTO
 */
export class UpdateProfileDto {
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
