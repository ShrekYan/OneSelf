import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

/**
 * 全局 CORS 中间件
 *
 * 职责：处理跨域资源共享预检请求和响应头设置
 * - 开发环境：ALLOWED_ORIGINS 为空 → 允许所有来源
 * - 生产环境：ALLOWED_ORIGINS 配置域名 → 只允许白名单内的来源
 */
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const allowedOrigins = this.configService.get<string>(
      'ALLOWED_ORIGINS',
      '',
    );
    const origin = request.get('Origin');

    // 情况一：ALLOWED_ORIGINS 为空 → 允许所有来源（开发环境）
    if (
      !allowedOrigins ||
      allowedOrigins.trim() === '' ||
      allowedOrigins === '*'
    ) {
      response.setHeader('Access-Control-Allow-Origin', '*');
    } else if (origin) {
      // 情况二：生产环境模式，检查 origin 是否在白名单中
      const allowedOriginList = allowedOrigins
        .split(',')
        .map((o) => o.trim())
        .filter((o) => o);

      if (allowedOriginList.includes(origin)) {
        // Origin 在白名单中，允许该具体来源
        response.setHeader('Access-Control-Allow-Origin', origin);
      }
      // Origin 不在白名单中，不设置 CORS 头 → 浏览器会拦截请求
    }

    // 保留原有其他头部配置
    response.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With',
    );

    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      const hasAllowOrigin = response.getHeader('Access-Control-Allow-Origin');
      response.sendStatus(hasAllowOrigin ? 204 : 403);
      return;
    }

    next();
  }
}
