import { IsString, Length, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户注册请求 DTO
 */
export class RegisterDto {
  @ApiProperty({
    description: '手机号（11位）',
    minLength: 11,
    maxLength: 11,
    example: '13800138000',
  })
  @IsString()
  @Length(11, 11, {
    message: '手机号必须是11位',
  })
  mobile: string;

  @ApiProperty({
    description: '密码',
    minLength: 6,
    maxLength: 20,
    example: 'password123',
  })
  @IsString()
  @MinLength(6, {
    message: '密码至少需要6个字符',
  })
  @MaxLength(20, {
    message: '密码不能超过20个字符',
  })
  password: string;
}
