import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 登录请求 DTO
 * 对应前端 Zod Schema: loginSchema
 */
export class LoginDto {
  @ApiProperty({
    description: '用户名',
    minLength: 2,
    maxLength: 20,
    example: 'user123',
  })
  @IsString()
  @MinLength(2, {
    message: '用户名至少需要2个字符',
  })
  @MaxLength(20, {
    message: '用户名不能超过20个字符',
  })
  username: string;

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

  // @ApiProperty({
  //   description: '记住我',
  //   default: false,
  //   example: false,
  // })
  // @IsBoolean()
  // rememberMe: boolean;
}
