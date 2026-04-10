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
```
