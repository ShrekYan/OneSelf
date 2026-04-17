import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogServiceClientService } from '../log-service';

/**
 * 统一请求日志中间件
 *
 * 职责：
 * - 对所有请求（包括成功和失败）在响应完成后统一记录日志
 * - 发送到独立 log-service 服务集中收集
 * - 错误发送失败不影响主流程，自动降级
 */
@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  constructor(private readonly logServiceClient: LogServiceClientService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    // 记录请求开始时间，用于计算响应时间
    request.startTime = Date.now();

    // 响应完成后统一记录日志（无论成功失败都会触发）
    response.on('finish', () => {
      this.logRequest(request, response);
    });

    next();
  }

  /**
   * 记录请求日志
   */
  private logRequest(request: Request, response: Response): void {
    const startTime = request.startTime || Date.now();
    const responseTime = Date.now() - startTime;

    // 构建日志数据

    const logData: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level: request.error ? 'error' : 'access',
      method: request.method,
      url: request.originalUrl,
      statusCode: response.statusCode,
      responseTime,
      ip: this.getClientIp(request),
      userAgent: request.get('User-Agent'),
      userId: request.user?.id,
      env: process.env.NODE_ENV || 'development',
    };

    // 如果有错误，附加错误信息
    if (request.error && request.error instanceof Error) {
      logData.errorName = request.error.name;
      logData.errorMessage = request.error.message;
      logData.stack = request.error.stack;
    }

    // 发送日志到 log-service
    this.logServiceClient.logJsonLog(logData);
  }

  /**
   * 获取客户端真实 IP
   */
  private getClientIp(request: Request): string {
    return (
      request.ip ||
      request.socket.remoteAddress ||
      request.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      'unknown'
    );
  }
}
