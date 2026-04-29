# 01 - 架构与模块规范

## 核心技术栈
- **NestJS 11.0** + **TypeScript 5.7**
- **Prisma ORM 6.4** - 数据库访问（带连接重试、慢查询检测）
- **@nestjs/config** - 环境配置管理
- **@nestjs/swagger** - API 文档自动生成
- **class-validator** - 数据验证
- **class-transformer** - 类型转换
- **jsonwebtoken** - JWT 认证
- **argon2** - 密码加密（Argon2id，目前最安全的密码哈希算法）
- **ioredis** - Redis 客户端（会话管理、缓存、分布式锁）
- **@nestjs/axios** + **axios** - HTTP 客户端（跨服务调用）
- **cookie-parser** - Cookie 解析（HttpOnly Cookie 安全）
- **Jest** - 单元测试

## 统一响应格式

项目采用统一的 `ApiResult<T>` 响应格式，由 `TransformInterceptor` 自动包装：

```typescript
// 最终输出结构
{
  code: number;    // 业务错误码，200 = 成功
  message: string; // 响应消息
  data: T;         // 响应数据
  timestamp: number;
}
```

## 模块化架构原则

✅ **一个业务领域一个模块**，按业务功能拆分
✅ **单一职责**，每个模块只负责一个明确领域
✅ **高内聚低耦合**，通过依赖注入解耦

### 标准模块目录结构

```
src/{module}/
├── {module}.module.ts          # 模块定义
├── {module}.controller.ts      # 控制器（处理 HTTP 请求）
├── {module}.service.ts         # 服务（业务逻辑）
├── dto/                        # 数据传输对象（所有请求/响应DTO）
│   ├── index.ts               # 统一出口，聚合导出
│   ├── {query-xxx-list}.dto.ts   # 单个 DTO 一个文件
│   └── ...
├── guards/                     # 守卫（认证、权限，可选）
├── decorators/                 # 自定义装饰器（可选）
└── interceptors/               # 拦截器（可选）
```

### 职责分层

| 层级 | ✅ 职责 | ❌ 不应该做 |
|------|------|----------|
| **Controller** | 路由定义、请求参数解析、API 文档装饰、返回响应 | 业务逻辑处理 |
| **Service** | 业务逻辑实现、数据处理、调用 Prisma | 直接处理 HTTP 请求/响应 |
| **DTO** | 定义请求/响应结构、验证规则、Swagger 文档 | 业务逻辑 |
| **Module** | 模块注册、依赖注入配置 | 业务逻辑 |

## 导入规范

✅ **分组排序**（按以下顺序）：
1. NestJS 官方包 (`@nestjs/*`)
2. 第三方包
3. Prisma 类型 (`@prisma/client`)
4. 内部模块 (`src/*`)
5. 当前模块相对导入

✅ **DTO 统一导入**：从 `./dto` 导入，不直接导入单个文件
✅ **绝对路径优先**：从 `src/` 根开始，避免 `../../`

```typescript
// ✅ 正确
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryArticleListDto } from './dto';

// ❌ 错误 - 直接导入单个 DTO 文件
import { QueryArticleListDto } from './dto/query-article-list.dto';
```

## Prisma ORM 集成

- **全局注册**: `PrismaModule` 是 `@Global()`，所有模块直接注入
- **注入方式**: `constructor(private readonly prisma: PrismaService) {}`
- **不使用 Repository 模式**: Prisma 已经是数据访问抽象，不需要额外包装
- **增强功能**: 连接重试机制、慢查询检测、详细错误日志

---

## 微服务架构说明

项目采用**独立认证服务**的微服务架构：

```
┌─────────────────────────────────────────────────────────────┐
│                     auth-service (认证中心)                  │
│  - 登录/注册/刷新 Token                                     │
│  - Token 验证接口 (/auth/introspect)                        │
│  - 用户信息管理                                              │
│  - 本地 JWT 验证 (JwtAuthGuard)                              │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                      backend (主业务服务)                     │
│  - 文章/分类/评论等业务模块                                  │
│  - 通过 RemoteJwtAuthGuard 调用 auth-service 验证 Token      │
│  - 所有业务接口统一的认证机制                                │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     log-service (日志服务)                    │
│  - 集中接收和存储所有服务的日志                              │
│  - 日志查询和分析                                            │
└─────────────────────────────────────────────────────────────┘
```

### 架构优势

1.  **认证逻辑集中**：认证逻辑只在 auth-service 维护，避免重复开发
2.  **安全边界清晰**：JWT 密钥只在 auth-service 中，其他服务不需要知道密钥
3.  **可独立扩展**：auth-service 可以独立部署和扩展
4.  **统一安全策略**：所有服务使用相同的 HttpOnly Cookie 安全策略
