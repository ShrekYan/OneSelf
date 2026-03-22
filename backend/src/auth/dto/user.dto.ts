import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户信息 DTO
 */
export class UserDto {
  @ApiProperty({
    description: '用户ID',
    example: 1,
  })
  id: number;

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
