import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * 全局 CORS 中间件
 *
 * 职责：处理跨域资源共享预检请求和响应头设置
 * 保持现有配置不变：允许所有来源，支持所有 HTTP 方法，允许 credentials
 */
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    // 设置 CORS 响应头
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With',
    );

    // 处理 OPTIONS 预检请求：直接返回 204
    if (request.method === 'OPTIONS') {
      response.sendStatus(204);
      return;
    }

    // 其他方法继续处理
    next();
  }
}
