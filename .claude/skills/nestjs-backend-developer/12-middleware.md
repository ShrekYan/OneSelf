# 12 - 中间件开发规范

## 概述

本文档定义 NestJS 后端项目的中间件开发规范，包括中间件分类、实现模板、注册方式以及项目内置中间件的使用说明。

中间件是在路由处理程序 **之前** 调用的函数，可以访问请求和响应对象，以及请求-响应周期中的 `next()` 中间件函数。

---

## 1. 中间件分类与注册方式

### 1.1 分类与适用场景

| 类型 | 注册方式 | 适用场景 | 示例 |
|------|---------|---------|------|
| **全局中间件** | `app.use()` 在 main.ts 中注册 | 所有请求都需要的功能 | CORS 处理、请求日志、Cookie 解析 |
| **模块中间件** | Module 的 `configure` 方法中注册 | 特定模块或路由需要的功能 | JWT 解析、权限检查前置处理 |
| **路由中间件** | Controller 中使用 `@UseGuards` 替代 | 特定路由需要 | （Guard 更适合此类场景） |

### 1.2 注册位置选择原则

- ✅ **全局注册**：如果 90% 以上的请求都需要此中间件
- ✅ **模块注册**：只在特定模块需要，或者需要精确控制路由匹配
- ❌ **不要滥用中间件**：如果只是少数路由需要，考虑使用 Guard 或 Interceptor

---

## 2. 标准中间件实现模板

### 2.1 基础模板

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ExampleMiddleware implements NestMiddleware {
  // ✅ 可以注入依赖
  constructor(private readonly someService: SomeService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // 1. 请求预处理（进入 Controller 之前执行）
    const startTime = Date.now();

    try {
      // 2. 业务逻辑处理
      await this.processRequest(req);
    } catch (error) {
      // ⚠️ 注意：中间件中抛出异常不会被全局异常过滤器捕获！
      // 如需错误处理，应在中间件内部处理或传递给 next(error)
      next(error);
      return;
    }

    // 3. 响应后处理（可选 - 在响应发送后执行）
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logRequest(req, res, duration);
    });

    // ✅ 必须调用 next() 继续处理链
    next();
  }

  private async processRequest(req: Request): Promise<void> {
    // 具体业务逻辑
  }

  private logRequest(req: Request, res: Response, duration: number): void {
    // 请求完成后的日志记录
  }
}
```

### 2.2 中间件开发守则

1.  ✅ **必须调用 `next()`**：否则请求会挂起
2.  ✅ **异步操作要 await**：使用 `async/await` 确保异步操作完成
3.  ✅ **异常要捕获并传递**：中间件异常不会自动被全局过滤器捕获
4.  ✅ **不要修改响应体**：中间件不应该直接发送响应，除非是错误处理
5.  ❌ **不要在中间件做复杂业务逻辑**：复杂逻辑应移到 Service 层
6.  ❌ **不要滥用中间件**：考虑是否 Guard 或 Interceptor 更合适

---

## 3. 项目内置中间件

### 3.1 CorsMiddleware - 跨域请求处理

**功能**：处理跨域资源共享（CORS）请求，支持预检 OPTIONS 请求。

```typescript
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = this.configService
      .getOrThrow<string>('ALLOWED_ORIGINS')
      .split(',');

    const origin = req.headers.origin;

    // 检查是否在允许列表中
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    // 标准 CORS 头
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Max-Age', '86400'); // 24 小时缓存
      res.sendStatus(204);
      return;
    }

    next();
  }
}
```

**注册方式**：全局注册（main.ts）

```typescript
// main.ts
app.use(new CorsMiddleware(configService).use);
```

**安全要点**：
- ✅ 不要使用 `*` 通配符，应该使用明确的 Origin 列表
- ✅ 必须启用 `Access-Control-Allow-Credentials: true` 才能跨域发送 Cookie
- ✅ 预检请求 OPTIONS 直接返回 204，不进入业务逻辑

---

### 3.2 RequestLogMiddleware - 请求日志

**功能**：记录所有 HTTP 请求的详细日志，用于排查问题和性能监控。

```typescript
@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();
    const userAgent = req.get('user-agent') || '';

    // 响应完成后记录日志
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      const logMessage = `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip} - ${userAgent}`;

      // 根据状态码选择日志级别
      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }

      // ⚠️ 安全：慢请求日志（超过 1 秒）
      if (duration > 1000) {
        this.logger.warn(`慢请求检测: ${logMessage}`);
      }
    });

    next();
  }
}
```

**注册方式**：全局注册（main.ts）

**日志内容包含**：
- HTTP 方法和请求路径
- 响应状态码
- 请求处理耗时
- 客户端 IP 地址
- User-Agent 信息

---

### 3.3 JwtParseMiddleware - JWT 解析中间件

**功能**：从请求中提取并解析 JWT Token，但 **不做有效性验证**（留给 Guard 验证）。

```typescript
@Injectable()
export class JwtParseMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtParseMiddleware.name);

  use(req: Request, _res: Response, next: NextFunction) {
    const token = this.extractToken(req);

    if (token) {
      try {
        // 只解析 payload，不验证签名（验证由 Guard 完成）
        const payload = jwt.decode(token) as { userId?: string };
        if (payload?.userId) {
          // 将用户 ID 挂载到 request 对象
          (req as any).userId = payload.userId;
        }
      } catch (error) {
        // Token 格式错误时静默失败，不要影响请求流程
        this.logger.debug(`Token 解析失败: ${error.message}`);
      }
    }

    next();
  }

  private extractToken(request: Request): string | undefined {
    return request.cookies?.accessToken ?? this.extractFromHeader(request);
  }

  private extractFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

**注册方式**：模块级注册（在 Module 中配置路由匹配）

```typescript
@Module({
  // ...
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtParseMiddleware)
      .forRoutes(
        { path: 'auth/*', method: RequestMethod.ALL },
        { path: 'users/*', method: RequestMethod.ALL },
      );
  }
}
```

**设计理念**：
- ✅ **解析和验证分离**：中间件只解析，Guard 负责验证
- ✅ **不影响公开接口**：即使 Token 无效，也能让不需要认证的接口正常工作
- ✅ **便于日志追踪**：所有请求都能关联到用户 ID，即使不需要认证

---

## 4. 中间件、Guard、Interceptor 的选择

经常混淆这三种 NestJS 增强机制，以下是选择指南：

| 场景 | 中间件 | Guard | Interceptor |
|------|--------|-------|-------------|
| **CORS 处理** | ✅ 最佳 | ❌ 不适合 | ❌ 不适合 |
| **请求日志** | ✅ 最佳 | ❌ 太靠后 | ❌ 不适合 |
| **Cookie 解析** | ✅ 最佳 | ❌ 不适合 | ❌ 不适合 |
| **认证/权限检查** | ❌ 不适合 | ✅ 最佳 | ❌ 不适合 |
| **角色权限验证** | ❌ 不适合 | ✅ 最佳 | ❌ 不适合 |
| **响应格式统一包装** | ❌ 不适合 | ❌ 不适合 | ✅ 最佳 |
| **缓存控制** | ❌ 不适合 | ❌ 不适合 | ✅ 最佳 |
| **请求参数转换** | ❌ 不适合 | ❌ 不适合 | ✅ 最佳 |

**执行顺序**：
```
中间件 (Middleware)
    ↓
守卫 (Guard)
    ↓
拦截器 (Interceptor - before)
    ↓
管道 (Pipe)
    ↓
Controller 方法
    ↓
拦截器 (Interceptor - after)
    ↓
异常过滤器 (Exception Filter)
```

---

## 5. 中间件开发检查清单

- [ ] 中间件类是否使用了 `@Injectable()` 装饰器？
- [ ] 是否实现了 `NestMiddleware` 接口？
- [ ] `use` 方法是否正确调用了 `next()`？
- [ ] 异步操作是否使用了 `async/await`？
- [ ] 异常是否被正确捕获并通过 `next(error)` 传递？
- [ ] 是否在正确的层级注册（全局 vs 模块）？
- [ ] 中间件职责是否单一，没有混入复杂业务逻辑？
- [ ] 敏感信息（如 Token、密码）是否不会被完整记录到日志？
- [ ] 慢请求是否有专门的警告日志？
