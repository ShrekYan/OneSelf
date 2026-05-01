import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

/**
 * JWT 认证守卫
 * 用于验证请求头中的 Access Token，验证通过后将 userId 挂载到 request 对象
 * 配合 @CurrentUserId() 装饰器获取当前登录用户 ID
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    // 优先级：Cookie > Header
    const token =
      this.extractTokenFromCookie(request) ??
      this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        code: 'MISSING_TOKEN',
        message: '缺少访问令牌',
      });
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret) as {
        userId: string;
      };
      // 将用户信息挂载到 request 对象上，供 @CurrentUserId() 装饰器使用
      request['user'] = { id: payload.userId };
    } catch {
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN',
        message: '访问令牌无效或已过期',
      });
    }

    return true;
  }

  /**
   * 从请求头提取 Bearer token
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * 从 Cookie 提取 accessToken
   */
  private extractTokenFromCookie(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request.cookies?.accessToken;
  }
}
