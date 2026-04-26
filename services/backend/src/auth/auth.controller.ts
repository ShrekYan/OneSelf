import {
  Controller,
  Post,
  Body,
  Ip,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
// AuthService has been migrated to auth-service and deleted
// After full migration to remote mode, we don't need it anymore
// import { AuthService } from './auth.service';
import { AuthClientService } from '../shared/auth-client.service';
import { RemoteJwtAuthGuard } from '../shared/remote-jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { BusinessException } from '../common/exceptions/business.exception';
import { BusinessErrorCode } from '../common/constants/business-error-codes';

/**
 * 认证控制器
 * 支持双模式：
 * - 本地模式：使用本地认证服务（兼容旧版本）- code commented out after full migration
 * - 远程模式：转发请求到独立 auth-service（新模式）- DEFAULT NOW
 * 通过环境变量 REMOTE_AUTH_ENABLE 控制开关
 * 负责处理用户登录、刷新令牌、登出等认证相关接口
 */
@ApiTags('认证')
@Controller('auth')
export class AuthController {
  private readonly remoteAuthEnabled: boolean;
  private readonly isProduction: boolean;

  constructor(
    // AuthService migrated to auth-service
    // private readonly authService: AuthService,
    private readonly authClient: AuthClientService,
    private readonly configService: ConfigService,
  ) {
    this.remoteAuthEnabled = this.configService.get<boolean>(
      'REMOTE_AUTH_ENABLE',
      true, // Default to true after full migration
    );
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
  }

  /**
   * 转发 auth-service 返回的 Set-Cookie 到客户端
   */
  private forwardAuthCookies(
    res: Response,
    sourceHeaders: Record<string, string[]>,
  ): void {
    const setCookie =
      sourceHeaders['set-cookie'] || sourceHeaders['Set-Cookie'];
    if (setCookie && Array.isArray(setCookie)) {
      setCookie.forEach(cookie => {
        res.append('Set-Cookie', cookie);
      });
    }
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
    if (this.remoteAuthEnabled) {
      const { data, headers } =
        await this.authClient.forwardRequestWithHeaders<{
          code: number;
          message: string;
          data: LoginResponseDto;
        }>('auth/login', { ...loginDto, clientIp });
      // 转发 auth-service 返回的 HttpOnly Cookie 到前端
      this.forwardAuthCookies(res, headers);
      return data.data;
    }
    // return this.authService.login(loginDto, clientIp);
    throw new Error('Local authentication is disabled');
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
    if (this.remoteAuthEnabled) {
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

      const { data, headers } =
        await this.authClient.forwardRequestWithHeaders<{
          code: number;
          message: string;
          data: RefreshResponseDto;
        }>('auth/refresh', { refreshToken });
      // 转发 auth-service 返回的 HttpOnly Cookie 到前端
      this.forwardAuthCookies(res, headers);

      return data.data;
    }
    // return this.authService.refreshToken(refreshToken);
    throw new Error('Local authentication is disabled');
  }

  @Post('logout')
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({
    status: 200,
    description: '登出成功',
  })
  @UseGuards(RemoteJwtAuthGuard)
  @ApiBody({ schema: { example: { refreshToken: 'string' } } })
  async logout(
    @CurrentUserId() userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') refreshToken?: string,
  ) {
    if (this.remoteAuthEnabled) {
      console.log('Remote authentication enabled');
      console.log('Logout request received for user:', userId);
      console.log('Refresh token:', refreshToken);

      // 提取原请求的 Authorization header，转发给 auth-service
      const authorization = req.headers.authorization;
      const headers = authorization
        ? { Authorization: authorization }
        : undefined;

      try {
        const { headers: responseHeaders } =
          await this.authClient.forwardRequestWithHeaders(
            'auth/logout',
            {
              userId,
              refreshToken,
            },
            headers,
          );

        // 转发 auth-service 的清除 Cookie 响应
        this.forwardAuthCookies(res, responseHeaders);

        return { message: '登出成功' };
      } catch (error: unknown) {
        console.error('Logout request failed:', error);

        // 如果 auth-service 返回了 HTTP 错误响应（如 401）
        // 使用项目标准 BusinessException 抛出，让全局过滤器处理
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        if ((error as any).response) {
          // Type assertion for axios error response structure
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          const errorResponse = (error as any).response as {
            status?: number;
            data?: { message?: string };
          };
          const statusCode =
            errorResponse.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = errorResponse.data?.message || 'Logout failed';

          // 使用 BusinessException 抛出，由 BusinessExceptionFilter 全局处理
          // 业务码使用 AUTH_INVALID_REFRESH_TOKEN（已定义），httpStatus 保持原状态码
          throw new BusinessException(
            BusinessErrorCode.AUTH_INVALID_REFRESH_TOKEN,
            message,
            statusCode,
          );
        }

        // 网络错误等其他异常，也用 BusinessException 抛出
        const message = error instanceof Error ? error.message : String(error);
        throw new BusinessException(
          BusinessErrorCode.AUTH_INVALID_REFRESH_TOKEN,
          message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    throw new BusinessException(
      BusinessErrorCode.AUTH_INVALID_CREDENTIALS,
      'Local authentication is disabled',
      HttpStatus.NOT_IMPLEMENTED,
    );
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
    if (this.remoteAuthEnabled) {
      const { data, headers } =
        await this.authClient.forwardRequestWithHeaders<{
          code: number;
          message: string;
          data: RegisterResponseDto;
        }>('auth/register', { ...registerDto, clientIp });
      // 转发 auth-service 返回的 HttpOnly Cookie 到前端
      this.forwardAuthCookies(res, headers);
      return data.data;
    }
    // return this.authService.register(registerDto, clientIp);
    throw new Error('Local authentication is disabled');
  }
}
