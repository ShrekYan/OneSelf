# 01 - 架构与模块规范

## 核心技术栈
- **NestJS 11.0** + **TypeScript 5.7**
- **Prisma ORM 6.4** - 数据库访问
- **@nestjs/config** - 环境配置管理
- **@nestjs/swagger** - API 文档自动生成
- **class-validator** - 数据验证
- **class-transformer** - 类型转换
- **jsonwebtoken** - JWT 认证
- **bcrypt** - 密码加密
- **Jest** - 单元测试

## 统一响应格式

项目采用统一的 `ApiResult<T>` 响应格式，所有接口返回结构：

```typescript
{
  code: number;    // 业务错误码，200 表示成功
  message: string; // 响应消息
  data: T;         // 响应数据
}
```

- 成功时：`code = 200`，data 携带返回数据
- 失败时：`code` = 业务错误码，message = 错误描述，data = null
- 业务错误使用业务错误码表示，HTTP 状态码仍为 200

## 模块化架构原则

### 模块拆分
- **一个业务领域一个模块**: 按业务功能拆分模块，放在 `src/{module}/` 目录
- **单一职责**: 每个模块只负责一个明确的业务领域
- **高内聚低耦合**: 模块内部紧密相关，模块之间通过依赖注入解耦

### 标准模块目录结构

```
src/{module}/
├── {module}.module.ts          # 模块定义
├── {module}.controller.ts      # 控制器（处理 HTTP 请求）
├── {module}.service.ts         # 服务（业务逻辑）
├── dto/                        # 数据传输对象（所有请求/响应DTO）
│   ├── index.ts               # 统一出口，聚合导出所有 DTO
│   ├── {query-xxx-list}.dto.ts   # 单个 DTO 文件
│   └── ...
├── guards/                     # 守卫（认证、权限等，可选）
├── decorators/                 # 自定义装饰器（可选）
└── interceptors/               # 拦截器（可选）
```

### 公共基础设施目录

```
src/common/
├── constants/            # 常量定义（业务错误码等）
├── decorators/           # 全局自定义装饰器（如 @CurrentUser()）
├── dto/                  # 全局通用 DTO（分页请求等）
├── exceptions/           # 自定义异常（BusinessException）
├── filters/              # 全局异常过滤器
├── interceptors/         # 全局拦截器（响应转换）
└── result/               # 统一响应结果（ApiResult）
```

### Prisma ORM 集成

- **Schema 定义**: `prisma/schema.prisma` - 所有数据模型定义
- **Prisma 服务**: `src/prisma/prisma.service.ts` - 继承 `PrismaClient`
- **全局模块**: `PrismaModule` 是 `@Global()`，所有模块可直接注入
- **使用方式**: 在 Service 构造函数注入 `private readonly prisma: PrismaService`

### 职责分层

| 层级 | 职责 | 不应该做 |
|------|------|----------|
| **Controller** | 路由定义、请求参数解析、API 文档装饰、返回响应 | 业务逻辑处理 |
| **Service** | 业务逻辑实现、数据处理、调用 Prisma、调用其他服务 | 直接处理 HTTP 请求/响应 |
| **DTO** | 定义请求/响应数据结构、验证规则、Swagger 文档 | 业务逻辑 |
| **Module** | 模块注册、依赖注入配置 | 业务逻辑 |
| **Prisma** | 数据库访问、查询构造 | 业务逻辑 |

### 导出规则
- 所有 DTO 必须通过 `dto/index.ts` 聚合导出
- Controller 和 Service 在模块中注册，不需要全局导出
- 公共工具/装饰器放在 `src/common/` 对应目录
- 业务错误码在 `src/common/constants/business-error-codes.ts` 统一管理

## 导入规范

- **使用绝对路径**: 从 `src/` 根开始导入，避免过长相对路径 `../../xxx`
- **分组排序**: 按以下顺序导入：
  1. NestJS 官方包 (`@nestjs/*`)
  2. 第三方包
  3. Prisma 类型 (`@prisma/client`)
  4. 内部模块 (`src/*` / `@common/*`)
  5. 当前模块相对导入
- **DTO 导入**: 统一从 `./dto` 导入，不要直接导入单个文件

```typescript
// ✅ 正确
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { QueryArticleListDto } from './dto';

// ❌ 错误
import { QueryArticleListDto } from './dto/query-article-list.dto';
```
