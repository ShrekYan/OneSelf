# 14 - 跨服务 HTTP 客户端规范

## 概述

本文档定义 NestJS 后端项目的跨服务 HTTP 客户端开发规范，特别是 backend 服务调用 auth-service 进行 Token 验证的场景。

---

## 1. 技术选型

### 1.1 @nestjs/axios + axios

项目使用 `@nestjs/axios` 作为 HTTP 客户端，原因：

- ✅ 与 NestJS 生态深度集成
- ✅ 支持拦截器、超时配置
- ✅ RxJS 响应式编程支持
- ✅ 类型完善

### 1.2 安装依赖

```bash
npm install @nestjs/axios axios
```

---

## 2. 核心场景：Auth Client 认证客户端

### 2.1 模块定义

```typescript
// src/shared/auth-client.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthClientService } from './auth-client.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.getOrThrow<string>('AUTH_SERVICE_URL'),
        timeout: 5000, // 5 秒超时
        maxRedirects: 3,
        // 不携带 Cookie（避免循环认证）
        withCredentials: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthClientService],
  exports: [AuthClientService],
})
export class AuthClientModule {}
```

### 2.2 Auth Client Service 实现

```typescript
// src/shared/auth-client.service.ts
import { Injectable, Logger, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface IntrospectResult {
  valid: boolean;
  userId: string;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthClientService {
  private readonly logger = new Logger(AuthClientService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * 验证 Token 有效性
   * @param token JWT Token
   */
  async introspect(token: string): Promise<IntrospectResult> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/auth/introspect', { token }),
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Token 验证失败');
    }
  }

  /**
   * 使用 Refresh Token 刷新 Access Token
   * @param refreshToken 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/auth/refresh', { refreshToken }),
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Token 刷新失败');
    }
  }

  /**
   * 获取用户信息
   * @param userId 用户 ID
   */
  async getUserInfo(userId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`/users/${userId}`),
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, '获取用户信息失败');
    }
  }

  /**
   * 统一错误处理
   */
  private handleError(error: unknown, message: string): never {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // 服务端返回了错误响应
      const { status, data } = axiosError.response;

      this.logger.warn(`${message}: HTTP ${status} - ${JSON.stringify(data)}`);

      if (status === 401) {
        throw new UnauthorizedException('认证凭证无效或已过期');
      }

      if (status === 400) {
        throw new UnauthorizedException((data as any)?.message || '请求参数无效');
      }

      throw new InternalServerErrorException('认证服务暂时不可用');
    } else if (axiosError.request) {
      // 请求已发出但没有收到响应（网络超时、连接失败等）
      this.logger.error(`${message}: 无响应（${axiosError.code}）`);
      throw new InternalServerErrorException('认证服务暂时不可用');
    } else {
      // 请求配置出错
      this.logger.error(`${message}: ${axiosError.message}`);
      throw new InternalServerErrorException('认证服务配置错误');
    }
  }
}
```

---

## 3. RemoteJwtAuthGuard 远程认证守卫

### 3.1 完整实现

```typescript
// src/shared/guards/remote-jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthClientService } from '../auth-client.service';

@Injectable()
export class RemoteJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(RemoteJwtAuthGuard.name);

  constructor(private readonly authClientService: AuthClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 从请求中提取 Token
    const token = this.extractToken(request);

    if (!token) {
      this.logger.debug('未提供认证凭证');
      throw new UnauthorizedException('未提供认证凭证');
    }

    try {
      // 调用 auth-service 验证 Token
      const result = await this.authClientService.introspect(token);

      if (!result.valid) {
        this.logger.debug('认证凭证无效');
        throw new UnauthorizedException('认证凭证无效或已过期');
      }

      // 将用户信息挂载到 request 对象
      request.userId = result.userId;
      request.user = { id: result.userId };

      this.logger.debug(`用户 ${result.userId} 认证成功`);
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(`远程认证失败: ${(error as Error).message}`);
      throw new UnauthorizedException('认证服务暂时不可用');
    }
  }

  /**
   * 从请求中提取 Token（Cookie 优先，Header 备用）
   */
  private extractToken(request: Request): string | undefined {
    // 优先级 1: 从 HttpOnly Cookie 提取
    const cookieToken = request.cookies?.accessToken;
    if (cookieToken) {
      return cookieToken;
    }

    // 优先级 2: 从 Authorization Header 提取
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return undefined;
  }
}
```

### 3.2 使用方式

```typescript
// 在 Controller 中使用
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RemoteJwtAuthGuard } from '../shared/guards/remote-jwt-auth.guard';

@Controller('articles')
export class ArticleController {
  @Get('my')
  @UseGuards(RemoteJwtAuthGuard)
  async getMyArticles() {
    // 只有认证通过的用户才能访问
    // request.userId 已被 Guard 设置
  }
}
```

---

## 4. 通用 HTTP 客户端规范

### 4.1 客户端创建原则

1.  **按服务拆分**：每个外部服务有独立的 Client Service
2.  **超时配置**：必须设置合理的超时时间（建议 3-10 秒）
3.  **错误处理**：统一封装错误，不把原始 axios 错误暴露给前端
4.  **降级策略**：关键服务调用失败时应有降级方案
5.  **日志记录**：记录请求和响应，便于排查问题

### 4.2 重试机制

对于幂等操作（GET、PUT、DELETE），可以配置重试：

```typescript
import { HttpService } from '@nestjs/axios';
import { retry } from 'rxjs/operators';

// 在请求中使用重试
const response = await firstValueFrom(
  this.httpService
    .get('/some-api')
    .pipe(
      retry({
        count: 3,           // 最多重试 3 次
        delay: 1000,        // 每次重试间隔 1 秒
      }),
    ),
);
```

### 4.3 断路器模式（Circuit Breaker）

对于高并发场景，建议使用 `opossum` 实现断路器：

```bash
npm install opossum @types/opossum
```

```typescript
import CircuitBreaker from 'opossum';

// 创建断路器
const breaker = new CircuitBreaker(this.authClient.introspect.bind(this.authClient), {
  timeout: 5000,           // 超时时间
  errorThresholdPercentage: 50,  // 错误率达到 50% 时熔断
  resetTimeout: 30000,     // 30 秒后尝试恢复
  volumeThreshold: 10,     // 至少 10 个请求才计算错误率
});

// 熔断事件监听
breaker.on('open', () => {
  this.logger.warn('认证服务断路器已打开，暂时停止请求');
});

breaker.on('halfOpen', () => {
  this.logger.log('认证服务断路器半开，尝试恢复');
});

breaker.on('close', () => {
  this.logger.log('认证服务断路器已关闭，服务恢复正常');
});

// 使用断路器
const result = await breaker.fire(token);
```

---

## 5. 性能与可观测性

### 5.1 请求日志中间件

```typescript
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpClientLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HttpClient');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      const logMessage = `${method} ${originalUrl} ${statusCode} ${duration}ms`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else if (duration > 1000) {
        this.logger.warn(`慢请求: ${logMessage}`);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
```

---

## 6. 检查清单

- [ ] 是否使用 `@nestjs/axios` 作为 HTTP 客户端？
- [ ] 是否为每个外部服务创建了独立的 Client Service？
- [ ] HTTP 请求是否设置了合理的超时时间？
- [ ] Token 提取是否优先从 Cookie 提取？
- [ ] 跨服务调用是否有统一的错误处理？
- [ ] 认证失败时是否不暴露服务内部细节？
- [ ] 是否有请求日志记录？
- [ ] 慢请求是否有单独的警告日志？
- [ ] 高并发场景是否配置了断路器？
- [ ] 幂等操作是否有重试机制？
- [ ] 是否正确处理了网络超时和连接失败的情况？
- [ ] AuthClientModule 是否正确导出了 AuthClientService？
- [ ] RemoteJwtAuthGuard 是否将用户信息挂载到 request 对象？
