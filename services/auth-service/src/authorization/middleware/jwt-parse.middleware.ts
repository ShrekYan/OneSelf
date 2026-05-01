import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * 全局 JWT 解析中间件
 *
 * 功能：所有请求自动尝试解析 JWT token
 * - 如果有有效 token：解析 userId 并挂载到 request.user
 * - 如果没有 token 或 token 无效：直接放行，不抛出异常
 *
 * 使用场景：公开接口（如文章详情、文章列表需要获取当前用户信息用于判断点赞状态
 * 兼容现有强制认证接口：仍然使用 JwtAuthGuard 进行强制验证，不受影响
 */
@Injectable()
export class JwtParseMiddleware implements NestMiddleware {
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
  }

  use(request: Request, response: Response, next: NextFunction): void {
    // 优先级：Cookie > Header
    const token =
      this.extractTokenFromCookie(request) ??
      this.extractTokenFromHeader(request);

    // 没有 token：直接跳过
    if (!token) {
      return next();
    }

    try {
      // 有 token：尝试验证解析
      const payload = jwt.verify(token, this.jwtSecret) as {
        userId: string;
      };
      // 验证成功：挂载用户信息到 request 对象，供 @CurrentUserId() 使用
      request['user'] = { id: payload.userId };
    } catch {
      // 验证失败（过期/无效签名）：直接跳过，不抛出异常
      // 当作未登录处理
    }

    // 无论如何都放行
    next();
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
