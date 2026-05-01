import {
  Controller,
  Post,
  Body,
  Ip,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { CurrentUserId } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/authorization/guards/jwt-auth.guard';

/**
 * 认证控制器
 * 负责处理用户登录、刷新令牌、登出等认证相关接口
 */
@ApiTags('认证')
@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
  }

  /**
   * 设置 HttpOnly Cookie（XSS 防护）
   */
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken?: string,
  ): void {
    const cookieOptions = {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? ('strict' as const) : ('lax' as const),
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      overwrite: true, // ✅ 覆盖同名 Cookie，避免重复
      // ✅ 不设置 domain：浏览器自动绑定到当前访问的精确域名
      // 访问 127.0.0.1 → Cookie 绑定 127.0.0.1
      // 访问 localhost → Cookie 绑定 localhost
    };

    res.cookie('accessToken', accessToken, cookieOptions);

    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, cookieOptions);
    }
  }

  /**
   * 清除认证 Cookie
   * 注意：清除 Cookie 时，domain、path、secure、sameSite 必须与设置时完全一致
   */
  private clearAuthCookies(res: Response): void {
    const cookieOptions = {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? ('strict' as const) : ('lax' as const),
      path: '/',
      overwrite: true, // ✅ 保持与设置时一致的配置
      // ✅ 清除时同样不设置 domain，与设置时保持一致
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }

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
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto, clientIp);
    // 设置 HttpOnly Cookie 存储 Token（XSS 防护）
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
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
    // ✅ 优先级：Cookie > Body（兼容新旧两种模式）
    @Body('refreshToken') refreshTokenFromBody: string | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    // ✅ 修复：严谨的空值判断，排除空字符串
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshTokenFromCookie = req.cookies?.refreshToken;
    const refreshToken =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      refreshTokenFromCookie && refreshTokenFromCookie.trim() !== ''
        ? (refreshTokenFromCookie as string)
        : refreshTokenFromBody;

    // ✅ 修复：没有有效 Token 时提前返回 410
    if (!refreshToken) {
      throw new UnauthorizedException({
        code: 'MISSING_REFRESH_TOKEN',
        message: '缺少刷新令牌',
      });
    }

    const result = await this.authService.refreshToken(refreshToken);
    // 更新 accessToken Cookie
    this.setAuthCookies(res, result.accessToken);
    return result;
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
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') refreshToken?: string,
  ) {
    console.log('Logout request received for user:', userId);
    console.log('Refresh token:', refreshToken);
    await this.authService.logout(userId, refreshToken);
    // 清除认证 Cookie
    this.clearAuthCookies(res);
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    const result = await this.authService.register(registerDto, clientIp);
    // 设置 HttpOnly Cookie 存储 Token（XSS 防护）
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }
}
