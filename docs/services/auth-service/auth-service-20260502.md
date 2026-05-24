# Auth Service 认证服务架构文档

> **文档生成日期**: 2026-05-02
> **模块版本**: 1.0.0
> **技术栈**: NestJS 11 + TypeScript 5.7 + Prisma ORM 6.4 + Redis

---

## 目录

1. [系统概述](#1-系统概述)
2. [架构设计](#2-架构设计)
3. [核心模块详解](#3-核心模块详解)
4. [数据库设计](#4-数据库设计)
5. [缓存策略与性能优化](#5-缓存策略与性能优化)
6. [安全机制](#6-安全机制)
7. [API 接口规范](#7-api-接口规范)
8. [部署与运维](#8-部署与运维)

---

## 1. 系统概述

### 1.1 模块定位

Auth Service 是整个博客系统的**认证与授权中心**，负责处理：

- 用户身份认证（登录/注册）
- Token 签发与刷新
- Token 有效性校验（Introspection）
- 用户会话管理
- 密码安全与迁移

### 1.2 核心特性

| 特性                | 说明                                          |
| ------------------- | --------------------------------------------- |
| **HttpOnly Cookie** | Token 存储采用 HttpOnly Cookie，防御 XSS 攻击 |
| **双 Token 机制**   | Access Token（2h）+ Refresh Token（7d）       |
| **Redis 会话存储**  | 刷新令牌统一存储在 Redis，支持分布式环境      |
| **多级缓存**        | 用户预加载缓存 + 密码哈希缓存，降低 DB 压力   |
| **密码平滑迁移**    | 支持 bcrypt → argon2id 静默迁移，兼容历史用户 |
| **JWT 认证**        | 标准 JWT 签名，支持多服务校验                 |
| **异常统一处理**    | 全局异常过滤器，统一响应格式                  |

### 1.3 技术栈清单

```
┌─────────────────────────────────────────────────────────────┐
│                     Core Framework                           │
├─────────────────────────────────────────────────────────────┤
│  NestJS 11.x         →  Node.js 企业级框架                  │
│  TypeScript 5.7.x    →  类型系统                            │
├─────────────────────────────────────────────────────────────┤
│                      Database                               │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM 6.4.x    →  MySQL 数据库访问                     │
│  MySQL 8.x           →  持久化存储                          │
│  Redis 6.x           →  缓存与会话存储                      │
├─────────────────────────────────────────────────────────────┤
│                      Security                               │
├─────────────────────────────────────────────────────────────┤
│  argon2              →  密码哈希（推荐算法）                 │
│  bcrypt              →  密码哈希（兼容历史）                 │
│  jsonwebtoken 9.x    →  JWT Token 生成/校验                 │
│  cookie-parser       →  Cookie 解析                         │
├─────────────────────────────────────────────────────────────┤
│                      Tools                                  │
├─────────────────────────────────────────────────────────────┤
│  @nestjs/swagger     →  API 文档自动生成                    │
│  compression         →  响应压缩                            │
│  ioredis 5.x         →  Redis 客户端                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 架构设计

### 2.1 整体架构图

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web App<br/>Mobile H5]
        BackendService[Backend Service<br/>主业务服务]
    end

    subgraph "Auth Service"
        Controller[Controller Layer<br/>AuthController<br/>IntrospectController]
        Middleware[Middleware Layer<br/>CorsMiddleware<br/>RequestLogMiddleware]
        Service[Service Layer<br/>AuthService<br/>TokenGeneratorService<br/>UserLoaderService<br/>PasswordValidationService]
        Guard[Guard Layer<br/>JwtAuthGuard]
        Filter[Filter Layer<br/>AllExceptionsFilter<br/>BusinessExceptionFilter<br/>PrismaExceptionFilter]
        Interceptor[Interceptor Layer<br/>TransformInterceptor]
    end

    subgraph "Infrastructure"
        Redis[(Redis<br/>会话 + 缓存)]
        MySQL[(MySQL<br/>用户数据)]
    end

    Web -->|HttpOnly Cookie| Controller
    BackendService -->|Introspect API| Controller

    Controller -->|调用| Service
    Middleware -->|前置处理| Controller
    Controller -->|守卫| Guard
    Controller -->|拦截器| Interceptor
    Controller -->|异常| Filter

    Service -->|查询用户| MySQL
    Service -->|Token/缓存| Redis
    Service -->|用户同步| Redis

    style Controller fill:#e1f5fe
    style Service fill:#f3e5f5
    style Redis fill:#fff3e0
    style MySQL fill:#e8f5e9
```

### 2.2 模块依赖关系

```mermaid
graph TD
    AppModule[AppModule] --> ConfigModule[ConfigModule]
    AppModule --> CommonModule[CommonModule]
    AppModule --> PrismaModule[PrismaModule]
    AppModule --> RedisModule[RedisModule]
    AppModule --> AuthorizationModule[AuthorizationModule]
    AppModule --> UsersModule[UsersModule]
    AppModule --> AuthModule[AuthModule]
    AppModule --> IntrospectModule[IntrospectModule]

    AuthModule --> PrismaModule
    AuthModule --> RedisModule
    AuthModule --> AuthorizationModule
    AuthModule --> UsersModule

    IntrospectModule --> ConfigModule

    RedisModule -->|@Global| AuthModule
    RedisModule -->|@Global| UsersModule

    style AuthModule fill:#f3e5f5,stroke:#7b1fa2
    style IntrospectModule fill:#e8f5e9,stroke:#388e3c
```

### 2.3 目录结构

```
services/auth-service/
├── src/
│   ├── auth/                          # 认证核心模块
│   │   ├── dto/                       # 数据传输对象
│   │   │   ├── login.dto.ts           # 登录请求 DTO
│   │   │   ├── login-response.dto.ts  # 登录响应 DTO
│   │   │   ├── register.dto.ts        # 注册请求 DTO
│   │   │   ├── refresh.dto.ts         # 刷新请求 DTO
│   │   │   └── user.dto.ts            # 用户信息 DTO
│   │   ├── auth.module.ts             # Auth 模块定义
│   │   ├── auth.controller.ts         # 认证接口控制器
│   │   ├── auth.service.ts            # 认证业务逻辑
│   │   ├── token-generator.service.ts # Token 生成服务
│   │   ├── user-loader.service.ts     # 用户加载服务
│   │   ├── password-validation.service.ts # 密码验证服务
│   │   ├── password-cache.service.ts  # 密码哈希缓存服务
│   │   └── refresh-token-redis.service.ts # 刷新令牌 Redis 服务
│   ├── introspect/                    # Token 校验模块
│   │   ├── introspect.module.ts
│   │   ├── introspect.controller.ts
│   │   ├── introspect.service.ts
│   │   └── dto/
│   ├── authorization/                 # 授权模块（JWT 守卫）
│   ├── users/                         # 用户同步模块
│   ├── prisma/                        # Prisma ORM 模块
│   ├── redis/                         # Redis 模块（全局）
│   ├── common/                        # 公共组件
│   │   ├── decorators/                # 装饰器
│   │   ├── dto/                       # 基础 DTO
│   │   ├── exceptions/                # 业务异常
│   │   ├── filters/                   # 异常过滤器
│   │   ├── guards/                    # 守卫
│   │   ├── interceptors/              # 拦截器
│   │   ├── middleware/                # 中间件
│   │   ├── result/                    # 统一响应格式
│   │   └── utils/                     # 工具函数
│   ├── app.module.ts                  # 根模块
│   └── main.ts                        # 应用入口
├── prisma/
│   └── schema.prisma                  # 数据库模型
└── docs/                              # 文档目录（本文件所在）
```

---

## 3. 核心模块详解

### 3.1 AuthModule - 认证核心模块

#### 职责边界

- 用户注册与登录
- Token 签发与刷新
- 用户登出（单设备/全设备）
- 密码验证与迁移

#### 核心类关系图

```mermaid
classDiagram
    class AuthController {
        +login(loginDto, clientIp)
        +refreshToken(refreshToken)
        +logout(userId, refreshToken?)
        +register(registerDto, clientIp)
        -setAuthCookies(res, accessToken, refreshToken?)
        -clearAuthCookies(res)
    }

    class AuthService {
        +register(registerDto, clientIp)
        +login(loginDto, clientIp)
        +refreshToken(refreshToken)
        +logout(userId, refreshToken?)
        -validateRefreshToken(token)
    }

    class TokenGeneratorService {
        +generateAndSaveTokens(userId, clientIp)
        +generateAccessToken(userId, deviceId)
        +buildUserDto(user)
        +getTokenExpiresIn()
        +getJwtRefreshSecret()
        -generateRefreshToken(userId, deviceId)
        -saveRefreshToken(userId, token, clientIp)
    }

    class UserLoaderService {
        +loadUser(username)
        -findUserByUsername(username)
    }

    class PasswordValidationService {
        +validatePassword(password, user)
        +handleLoginFailure(user)
        +processValidPassword(user, userFromDb, clientIp)
        +startSilentMigration(user, password)
    }

    class PasswordCacheService {
        +cachePassword(username, algorithm, hash)
        +getPasswordCache(username)
        +deletePasswordCache(username)
    }

    class RefreshTokenRedisService {
        +saveRefreshToken(token, userId, expiresAt, clientIp)
        +getRefreshToken(token)
        +deleteRefreshToken(userId, token)
        +deleteAllUserRefreshTokens(userId)
    }

    class UserSyncService {
        +syncSingleUserToRedis(username, userData)
        +getUserKey(username)
        +deleteUserFromRedis(username)
    }

    AuthController --> AuthService
    AuthService --> TokenGeneratorService
    AuthService --> UserLoaderService
    AuthService --> PasswordValidationService
    AuthService --> PasswordCacheService
    AuthService --> RefreshTokenRedisService
    AuthService --> UserSyncService
    TokenGeneratorService --> RefreshTokenRedisService
    UserLoaderService --> PasswordCacheService
    UserLoaderService --> UserSyncService
```

### 3.2 登录流程详解

```mermaid
sequenceDiagram
    participant Client as 客户端
    participant Controller as AuthController
    participant AuthService as AuthService
    participant UserLoader as UserLoaderService
    participant PasswordCache as PasswordCacheService
    participant Redis as Redis
    participant MySQL as MySQL
    participant PasswordValidation as PasswordValidationService
    participant TokenGenerator as TokenGeneratorService

    Client->>Controller: POST /auth/login<br/>(username, password)
    Controller->>AuthService: login(loginDto, clientIp)

    Note over AuthService: 1. 加载用户
    AuthService->>UserLoader: loadUser(username)

    UserLoader->>Redis: GET user:{username}:key
    alt 缓存命中
        Redis-->>UserLoader: 返回缓存 Key
        UserLoader->>Redis: GET {cacheKey}
        Redis-->>UserLoader: 用户缓存数据
    else 缓存未命中
        Redis-->>UserLoader: null
        UserLoader->>MySQL: SELECT * FROM users WHERE username = ?
        MySQL-->>UserLoader: 用户数据
        UserLoader->>Redis: SET {cacheKey} = 用户数据<br/>(回填缓存)
    end
    UserLoader-->>AuthService: {user, userFromDb}

    Note over AuthService: 2. 验证密码
    AuthService->>PasswordValidation: validatePassword(password, user)

    PasswordValidation->>PasswordCache: getPasswordCache(username)
    alt 密码缓存命中
        PasswordCache-->>PasswordValidation: 缓存的算法+哈希
    else 缓存未命中
        PasswordCache-->>PasswordValidation: null
    end

    PasswordValidation->>PasswordValidation: argon2.verify() 或 bcrypt.compare()

    alt 密码验证失败
        PasswordValidation->>PasswordValidation: 登录失败计数
        AuthService-->>Controller: throw BusinessException(401)
        Controller-->>Client: 401 Unauthorized
    end

    Note over AuthService: 3. 验证成功处理
    AuthService->>PasswordValidation: processValidPassword()
    PasswordValidation->>PasswordCache: cachePassword(username, algorithm, hash)

    Note over AuthService: 4. 静默密码迁移（如需要）
    AuthService->>PasswordValidation: startSilentMigration(user, password)
    Note right of PasswordValidation: 异步执行 bcrypt → argon2id 迁移

    Note over AuthService: 5. 生成双 Token
    AuthService->>TokenGenerator: generateAndSaveTokens(userId, clientIp)
    TokenGenerator->>TokenGenerator: JWT.sign() → accessToken
    TokenGenerator->>TokenGenerator: JWT.sign() → refreshToken
    TokenGenerator->>Redis: SET refresh_token:{hash}
    TokenGenerator-->>AuthService: {accessToken, refreshToken, expiresIn}

    AuthService-->>Controller: LoginResponseDto
    Controller->>Controller: setAuthCookies(accessToken, refreshToken)
    Controller-->>Client: 200 OK + HttpOnly Cookies
```

### 3.3 IntrospectModule - Token 校验模块

#### 设计目的

- 为其他后端服务提供 Token 有效性校验
- 支持跨服务身份认证
- 无需每个服务都依赖 JWT 密钥

#### 接口定义

```typescript
POST /api/introspect
Request: { accessToken: string }
Response: {
  valid: boolean;       // Token 是否有效
  userId?: string;      // 有效时返回用户 ID
  expiresIn?: number;   // 有效时返回剩余秒数
  error?: 'MISSING' | 'EXPIRED' | 'INVALID_TOKEN';
}
```

#### 使用场景

主业务服务在处理请求时，调用此接口验证 Token 有效性：

```
Backend Service → Auth Service (/introspect) → 校验通过/拒绝
```

---

## 4. 数据库设计

### 4.1 ER 图

```mermaid
erDiagram
    USERS {
        String id PK "用户ID author-xxx"
        String username UK "手机号"
        String password_hash "密码哈希"
        String password_algorithm "argon2id / bcrypt"
        String email "邮箱（可选）"
        String nickname "昵称（可选）"
        String avatar "头像URL（可选）"
        Boolean is_active "是否启用"
        BigInt created_at "创建时间"
        BigInt updated_at "更新时间"
    }

    REFRESH_TOKENS {
        String id PK "UUID"
        String user_id FK "用户ID"
        String refresh_token UK "刷新令牌"
        String client_ip "客户端IP"
        BigInt expires_at "过期时间戳"
        Boolean revoked "是否已撤销"
        BigInt created_at "创建时间"
    }

    USERS ||--o{ REFRESH_TOKENS : "has many"
```

### 4.2 索引设计

| 表名           | 索引名           | 字段          | 类型   | 说明           |
| -------------- | ---------------- | ------------- | ------ | -------------- |
| users          | uk_username      | username      | UNIQUE | 手机号唯一索引 |
| users          | idx_is_active    | is_active     | INDEX  | 启用状态过滤   |
| refresh_tokens | uk_refresh_token | refresh_token | UNIQUE | 刷新令牌唯一   |
| refresh_tokens | idx_user_id      | user_id       | INDEX  | 按用户查询令牌 |
| refresh_tokens | idx_expires_at   | expires_at    | INDEX  | 过期清理       |

### 4.3 数据类型优化

| 字段          | 类型         | 说明                    |
| ------------- | ------------ | ----------------------- |
| id            | VARCHAR(36)  | UUID 或自定义格式       |
| password_hash | VARCHAR(255) | Argon2 哈希约 100+ 字符 |
| is_active     | BOOLEAN      | TINYINT(1) 映射         |
| created_at    | BIGINT       | Unix 毫秒时间戳         |
| refresh_token | VARCHAR(500) | JWT Token 较长          |

---

## 5. 缓存策略与性能优化

### 5.1 缓存层级设计

```mermaid
graph LR
    Request[登录请求] --> L1{预加载用户缓存}
    L1 -->|命中| L2{密码哈希缓存}
    L1 -->|未命中| MySQL[MySQL 查询]
    MySQL -->|回填| L1
    L2 -->|命中| Verify[密码验证]
    L2 -->|未命中| Verify
    Verify -->|成功| L2

    style L1 fill:#e3f2fd
    style L2 fill:#f3e5f5
    style MySQL fill:#e8f5e9
```

### 5.2 Redis Key 设计

| Key 模式                    | 类型        | TTL  | 说明                            |
| --------------------------- | ----------- | ---- | ------------------------------- |
| `auth:user:{username}:key`  | String      | 永久 | 用户缓存 Key 映射（用于预加载） |
| `auth:user:{uuid}:data`     | Hash/String | 7d   | 用户完整数据缓存                |
| `auth:refresh:{token_hash}` | Hash        | 7d   | 刷新令牌存储                    |
| `auth:pwd:{username}`       | Hash        | 24h  | 密码算法+哈希缓存               |

### 5.3 性能优化点

#### 1. 用户预加载缓存

- **机制**: 系统启动时或定时任务预加载活跃用户到 Redis
- **收益**: 登录请求 95%+ 命中缓存，避免 DB 查询
- **降级**: 缓存未命中时自动回源 DB 并回填

#### 2. 密码哈希缓存

- **机制**: 验证成功后缓存算法+哈希值
- **收益**: 避免重复计算 argon2id（CPU 密集型操作）
- **TTL**: 24 小时，自动过期

#### 3. 响应压缩

```typescript
// main.ts 中的压缩配置
compression({
  threshold: 1024, // 大于 1KB 才压缩
  level: 6, // 压缩级别 0-9
  filter: (req, res) => {
    // 跳过图片等已压缩格式
    if (String(res.getHeader('Content-Type')).includes('image/')) {
      return false;
    }
    return compression.filter(req, res);
  },
});
```

#### 4. 数据库连接池

通过 Prisma 配置连接池大小：

```env
DATABASE_URL="mysql://user:pass@localhost:3306/db?connection_limit=20"
```

---

## 6. 安全机制

### 6.1 HttpOnly Cookie 安全策略

```mermaid
graph TD
    A[登录成功] --> B[生成 Access Token + Refresh Token]
    B --> C[设置 HttpOnly Cookie]
    C --> D{环境判断}
    D -->|生产环境| E[Secure: true<br/>SameSite: Strict]
    D -->|开发环境| F[Secure: false<br/>SameSite: Lax]
    E --> G[浏览器存储<br/>JavaScript 无法读取]
    F --> G
    G --> H[后续请求自动携带 Cookie]

    style C fill:#f44336,color:white
    style E fill:#ff9800
```

#### Cookie 配置参数

| 参数     | 开发环境 | 生产环境 | 说明                   |
| -------- | -------- | -------- | ---------------------- |
| httpOnly | ✅ true  | ✅ true  | 禁止 JavaScript 读取   |
| secure   | ❌ false | ✅ true  | 仅 HTTPS 传输          |
| sameSite | 'lax'    | 'strict' | 防止 CSRF 攻击         |
| maxAge   | 7d       | 7d       | 过期时间               |
| path     | '/'      | '/'      | 生效路径               |
| domain   | 不设置   | 不设置   | 浏览器自动绑定当前域名 |

### 6.2 密码安全

#### 算法选型对比

| 算法     | 抗 GPU     | 内存消耗     | 计算时间 | 推荐度      |
| -------- | ---------- | ------------ | -------- | ----------- |
| Argon2id | ⭐⭐⭐⭐⭐ | 高（可配置） | 中等     | ✅ 首选     |
| bcrypt   | ⭐⭐⭐     | 低           | 慢       | ⚠️ 兼容历史 |
| PBKDF2   | ⭐⭐       | 低           | 慢       | ❌ 不推荐   |

#### Argon2 配置参数

```typescript
argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 4096, // 4MB 内存（可根据服务器配置调整）
  timeCost: 2, // 迭代次数
  parallelism: 1, // 并行度
});
```

#### 静默密码迁移流程

1. 用户登录时检测 `password_algorithm` 字段
2. 如为 `bcrypt` 且验证成功，异步重新计算 `argon2id` 哈希
3. 更新数据库 `password_hash` 和 `password_algorithm` 字段
4. 更新缓存，下次登录直接使用 argon2id

### 6.3 JWT 安全配置

| 配置项            | 值           | 说明                   |
| ----------------- | ------------ | ---------------------- |
| Access Token TTL  | 7200s (2h)   | 短期有效，降低泄露风险 |
| Refresh Token TTL | 604800s (7d) | 长期有效，支持无感刷新 |
| JWT Secret        | 环境变量     | 生产环境必须 ≥ 32 字符 |
| 签名算法          | HS256        | 对称加密，性能好       |

### 6.4 输入验证

所有 API 参数通过 `class-validator` 进行校验：

```typescript
// 示例：登录 DTO
export class LoginDto {
  @IsString()
  @IsMobilePhone('zh-CN') // 手机号格式校验
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}
```

---

## 7. API 接口规范

### 7.1 统一响应格式

所有接口返回统一格式：

```typescript
interface ApiResult<T> {
  code: number; // HTTP 状态码
  message: string; // 消息描述
  data: T; // 业务数据
}
```

### 7.2 接口清单

#### 认证接口 (`/api/auth`)

| 方法 | 路径        | 功能              | 认证      |
| ---- | ----------- | ----------------- | --------- |
| POST | `/login`    | 用户登录          | ❌ 不需要 |
| POST | `/register` | 用户注册          | ❌ 不需要 |
| POST | `/refresh`  | 刷新 Access Token | ❌ 不需要 |
| POST | `/logout`   | 用户登出          | ✅ JWT    |

#### 系统接口

| 方法 | 路径          | 功能             | 认证      |
| ---- | ------------- | ---------------- | --------- |
| POST | `/introspect` | Token 有效性校验 | ❌ 内网   |
| GET  | `/health`     | 健康检查         | ❌ 不需要 |

### 7.3 错误码规范

| HTTP 状态码 | 业务错误码                     | 说明                |
| ----------- | ------------------------------ | ------------------- |
| 401         | AUTH_INVALID_CREDENTIALS       | 用户名或密码错误    |
| 401         | AUTH_USER_DISABLED             | 用户已被禁用        |
| 409         | AUTH_MOBILE_ALREADY_REGISTERED | 手机号已注册        |
| 410         | AUTH_INVALID_REFRESH_TOKEN     | 刷新令牌无效/已过期 |
| 500         | INTERNAL_SERVER_ERROR          | 服务器内部错误      |

---

## 8. 部署与运维

### 8.1 环境变量

```env
# 运行环境
NODE_ENV=production

# 服务端口
PORT=8889

# 数据库连接
DATABASE_URL="mysql://user:pass@localhost:3306/auth_db"

# Redis 连接
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT 密钥（生产环境必须强密码）
JWT_SECRET=your-32-char-jwt-secret-key-here
JWT_REFRESH_SECRET=your-32-char-refresh-secret-here

# Token 过期时间（秒）
TOKEN_EXPIRES_IN=7200
REFRESH_EXPIRES_IN=604800

# Argon2 参数
ARGON2_MEMORY_COST=4096
ARGON2_TIME_COST=2
```

### 8.2 健康检查

```bash
# 健康检查接口
curl http://localhost:8889/api/health

# 响应示例
{
  "code": 200,
  "message": "Success",
  "data": {
    "status": "ok",
    "timestamp": 1746182400000
  }
}
```

### 8.3 Swagger 文档

启动服务后访问：

```
http://localhost:8889/docs
```

### 8.4 关键监控指标

| 指标         | 阈值         | 说明                         |
| ------------ | ------------ | ---------------------------- |
| CPU 使用率   | > 80%        | Argon2 计算可能导致 CPU 飙升 |
| Redis 命中率 | < 90%        | 用户缓存命中率过低           |
| 登录响应时间 | > 500ms      | 密码验证耗时过长             |
| 活跃连接数   | > 连接池 80% | 数据库连接耗尽风险           |

---

## 附录

### A. 参考文档

- [NestJS 官方文档](https://docs.nestjs.com/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Argon2 规范](https://github.com/P-H-C/phc-winner-argon2)

### B. 版本历史

| 版本  | 日期       | 变更内容     |
| ----- | ---------- | ------------ |
| 1.0.0 | 2026-05-02 | 初始架构文档 |

---

**文档维护者**: 开发团队
**下次更新时间**: 下次功能迭代后
