# 11 - 安全认证规范（NestJS 后端特有）

> **通用安全规范**：已抽离至 `.claude/rules/security-common.md`，本文件仅定义后端特有规范。

---

## 概述

本文档定义 NestJS 后端项目的安全认证开发规范，包括 HttpOnly Cookie 安全策略、JWT 认证机制、Auth Guard 实现、密码加密等核心安全功能。

**安全第一原则**：所有安全相关规范为"必须"遵守，而非"推荐"。

---

## 1. HttpOnly Cookie 安全策略（后端特有）

**通用安全规范**：见 `.claude/rules/security-common.md`

### 1.1 启用 Cookie Parser

所有服务必须在 `main.ts` 中启用 cookie-parser：

```typescript
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ 必须 - 启用 Cookie 解析
  app.use(cookieParser());

  // ... 其他配置
}
```

### 1.2 Cookie 安全配置标准

设置 Token Cookie 时必须使用以下安全配置：

```typescript
// ✅ 标准安全配置
res.cookie('accessToken', token, {
  httpOnly: true,                    // 🔴 必须 - 防止 XSS 读取
  secure: process.env.NODE_ENV === 'production',  // 🔴 生产环境必须
  sameSite: 'strict',                // ✅ 推荐 - 防止 CSRF
  maxAge: 2 * 60 * 60 * 1000,       // 2 小时过期
  path: '/',
});

// 清除 Cookie
res.clearCookie('accessToken', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
});
```

| 属性 | 说明 | 要求 |
|------|------|------|
| `httpOnly` | 禁止 JavaScript 读取 Cookie | 🔴 必须 |
| `secure` | 仅通过 HTTPS 传输 | 🔴 生产环境必须 |
| `sameSite` | 防止跨站请求携带 Cookie | ✅ 推荐使用 `strict` |
| `maxAge` | Cookie 过期时间 | ✅ 必须设置合理值 |
| `path` | Cookie 生效路径 | ✅ 建议设置为 `/` |

---

## 2. JWT Token 提取机制

### 2.1 提取优先级

**Cookie 优先，Authorization Header 作为备用**：

```typescript
// ✅ 标准实现
private extractToken(request: Request): string | undefined {
  // 优先级 1: 从 HttpOnly Cookie 提取（安全）
  const cookieToken = request.cookies?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }

  // 优先级 2: 从 Authorization Header 提取（兼容）
  return this.extractFromHeader(request);
}

private extractFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
```

⚠️ **注意**：不要在日志中记录完整的 Token 值，必要时只记录前几位或后几位用于排查。

---

## 3. 两种 Auth Guard 模式

### 3.1 模式对比

| 模式 | 适用服务 | 验证方式 | 性能 | 适用场景 |
|------|---------|---------|------|---------|
| **本地 JWT 验证** | auth-service | 使用 `jsonwebtoken` 本地验证签名 | 高 | 认证服务自身使用 |
| **远程 Token 验证** | backend、其他服务 | HTTP 调用 auth-service `/auth/introspect` 接口 | 中 | 所有其他业务服务 |

### 3.2 本地 JWT Auth Guard（auth-service）

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret: string;
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(configService: ConfigService) {
    this.jwtSecret = configService.getOrThrow('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('未提供认证凭证');
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret) as { userId: string };
      request['user'] = { id: payload.userId };
      return true;
    } catch (error) {
      this.logger.warn(`Token 验证失败: ${error.message}`);
      throw new UnauthorizedException('认证凭证无效或已过期');
    }
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

### 3.3 远程 Token Auth Guard（其他服务）

```typescript
@Injectable()
export class RemoteJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(RemoteJwtAuthGuard.name);

  constructor(private readonly authClientService: AuthClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('未提供认证凭证');
    }

    try {
      const result = await this.authClientService.introspect(token);
      if (!result.valid) {
        throw new UnauthorizedException('认证凭证无效或已过期');
      }

      // 将用户信息挂载到 request
      request.userId = result.userId;
      request.user = { id: result.userId };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`远程认证服务调用失败: ${error.message}`);
      throw new InternalServerErrorException('认证服务暂时不可用');
    }
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

---

## 4. 密码加密规范

**通用安全规范**：见 `.claude/rules/security-common.md`

### 4.1 算法选择

| 算法 | 状态 | 说明 |
|------|------|------|
| **Argon2id** | ✅ **必须使用** | 目前最安全的密码哈希算法，抗 GPU/ASIC 攻击 |
| bcrypt | ❌ 不再推荐 | 已过时，抗 GPU 攻击能力弱 |
| PBKDF2 | ❌ 不推荐 | 安全性不如 Argon2 |

### 4.2 标准实现

```typescript
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  /**
   * 哈希密码 - 使用 Argon2id 算法
   */
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,      // ✅ 必须使用 argon2id 变体
      memoryCost: 1 << 16,        // 64MB 内存消耗
      timeCost: 3,                 // 迭代次数
      parallelism: 1,              // 并行度
      hashLength: 32,              // 哈希长度
    });
  }

  /**
   * 验证密码
   */
  async verify(hash: string, password: string): Promise<boolean> {
    try {
      return argon2.verify(hash, password);
    } catch (error) {
      // 验证失败（格式错误等），返回 false 而非抛出异常
      return false;
    }
  }
}
```

### 4.3 安全注意事项

- ✅ 密码哈希只能单向，不能解密
- ✅ 数据库中只存储哈希值，**绝不存储明文密码**
- ✅ 登录失败时不要提示"用户名不存在"或"密码错误"的具体差异
- ✅ 应使用统一错误提示："用户名或密码错误"（防止账户枚举攻击）

---

## 5. Refresh Token 管理规范

### 5.1 存储方案

| 存储方式 | 推荐度 | 说明 |
|---------|--------|------|
| **Redis** | ✅ **必须** | 支持自动过期、高性能、支持黑名单机制 |
| 数据库 | ❌ 不推荐 | 查询慢，清理过期 Token 困难 |

### 5.2 Redis 存储结构

```
Key: refresh_token:{token_value}
Value: {
  "userId": "user-uuid",
  "deviceInfo": "Chrome / Windows",
  "clientIp": "192.168.1.1",
  "createdAt": 1234567890
}
TTL: 7天 (Refresh Token 过期时间)

Key: user_refresh_tokens:{user_id}
Value: Set of token values (用户所有有效 Refresh Token)
TTL: 7天 (与最长的 Token 过期时间一致)
```

### 5.3 核心功能实现

```typescript
@Injectable()
export class RefreshTokenService {
  constructor(private readonly redis: Redis) {}

  /**
   * 存储 Refresh Token
   */
  async store(token: string, userId: string, deviceInfo: string, clientIp: string): Promise<void> {
    const key = `refresh_token:${token}`;
    const userKey = `user_refresh_tokens:${userId}`;

    // 存储 Token 详情
    await this.redis.setEx(
      key,
      7 * 24 * 60 * 60,  // 7 天过期
      JSON.stringify({ userId, deviceInfo, clientIp, createdAt: Date.now() }),
    );

    // 添加到用户 Token 集合
    await this.redis.sAdd(userKey, token);
    await this.redis.expire(userKey, 7 * 24 * 60 * 60);
  }

  /**
   * 单设备登出 - 撤销单个 Token
   */
  async revoke(token: string, userId: string): Promise<void> {
    const key = `refresh_token:${token}`;
    const userKey = `user_refresh_tokens:${userId}`;

    await this.redis.del(key);
    await this.redis.sRem(userKey, token);
  }

  /**
   * 全部设备登出 - 撤销用户所有 Token
   */
  async revokeAll(userId: string): Promise<void> {
    const userKey = `user_refresh_tokens:${userId}`;
    const tokens = await this.redis.sMembers(userKey);

    // 删除所有 Token
    if (tokens.length > 0) {
      const keys = tokens.map(t => `refresh_token:${t}`);
      await this.redis.del(...keys);
    }

    await this.redis.del(userKey);
  }
}
```

### 5.4 安全特性

- ✅ 支持多设备同时登录
- ✅ 支持单设备登出和全部设备登出
- ✅ Redis 自动过期，无需手动清理
- ✅ Token 与用户关联，便于安全审计

---

## 6. 认证装饰器

### 6.1 @CurrentUserId

获取当前登录用户 ID，用于 Controller 中：

```typescript
// 装饰器定义
export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.userId || request.user?.id;

    if (!userId) {
      throw new InternalServerErrorException('无法获取当前用户 ID');
    }

    return userId;
  },
);

// Controller 使用示例
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@CurrentUserId() userId: string) {
  return this.userService.getProfile(userId);
}
```

---

## 7. 安全检查清单

- [ ] 是否在 `main.ts` 中启用了 `cookie-parser`？
- [ ] 设置 Cookie 时是否启用了 `httpOnly: true`？
- [ ] 生产环境是否启用了 `secure: true`？
- [ ] Token 提取是否优先从 Cookie 获取？
- [ ] 密码加密是否使用了 Argon2id 算法？
- [ ] Refresh Token 是否存储在 Redis 中？
- [ ] 是否支持多设备登出和全部设备登出？
- [ ] 登录失败提示是否统一，不暴露具体错误原因？
- [ ] 敏感信息（密码、Token）是否不会记录到日志？
- [ ] Auth Guard 是否正确处理了 Token 无效和过期的情况？
- [ ] 远程认证失败时是否返回适当的错误信息，不暴露服务细节？
- [ ] 所有需要认证的接口是否正确使用了 Auth Guard？
