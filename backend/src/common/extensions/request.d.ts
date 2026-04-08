/**
 * 扩展 Express Request 类型
 * 添加用于统一日志的自定义属性
 */

import type { Error } from 'nestjs/common';

declare global {
  namespace Express {
    interface Request {
      /** 请求开始时间戳，用于计算响应时间 */
      startTime?: number;
      /** 捕获到的异常对象，供统一日志中间件记录 */
      error?: Error;
      /** JWT 解析后的用户信息，由 JwtParseMiddleware 添加 */
      user?: {
        id: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
    }
  }
}

export {};
