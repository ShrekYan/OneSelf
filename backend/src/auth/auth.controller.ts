import { Controller, Post, Body, Ip, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards';

/**
 * 认证控制器
 * 负责处理用户登录、刷新令牌、登出等认证相关接口
 */
@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '用户名或密码错误',
    schema: {
      example: {
        statusCode: 401,
        message: '用户名或密码错误',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '用户已被禁用或锁定',
    schema: {
      example: {
        statusCode: 403,
        message: '用户已被禁用',
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Ip() clientIp: string,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, clientIp);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiBody({ type: RefreshDto })
  @ApiResponse({
    status: 200,
    description: '刷新成功',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 410,
    description: '刷新令牌无效或已过期',
  })
  async refreshToken(
    //@Body('refreshToken')
    @Body('refreshToken') refreshToken: string,
  ): Promise<RefreshResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({
    status: 200,
    description: '登出成功',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ schema: { example: { refreshToken: 'string' } } })
  async logout(
    @CurrentUserId() userId: string,
    @Body('refreshToken') refreshToken?: string,
  ) {
    await this.authService.logout(userId, refreshToken);
    return { message: '登出成功' };
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '手机号已注册',
    schema: {
      example: {
        statusCode: 409,
        code: 'MOBILE_ALREADY_REGISTERED',
        message: '手机号已注册',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '参数校验失败',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Ip() clientIp: string,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto, clientIp);
  }
}
