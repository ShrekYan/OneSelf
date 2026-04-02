# 01 - 架构与模块规范

## 核心技术栈
- **NestJS 11** + **TypeScript 5.7**
- **@nestjs/swagger** - API 文档自动生成
- **class-validator** - 数据验证
- **class-transformer** - 类型转换
- **Jest** - 单元测试

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
├── {module}.controller.spec.ts # 单元测试（可选但推荐）
├── dto/                        # 数据传输对象（所有请求/响应DTO）
│   ├── index.ts               # 统一出口，聚合导出所有 DTO
│   ├── {create-item}.dto.ts   # 单个 DTO 文件
│   └── ...
├── guards/                     # 守卫（认证、权限等）
├── decorators/                 # 自定义装饰器
├── interceptors/               # 拦截器
└── mock/                       # Mock 数据（开发测试用）
    └── index.ts                # 统一导出
```

### 职责分层

| 层级 | 职责 | 不应该做 |
|------|------|----------|
| **Controller** | 路由定义、请求参数解析、API 文档装饰、返回响应 | 业务逻辑处理 |
| **Service** | 业务逻辑实现、数据处理、调用其他服务 | 直接处理 HTTP 请求/响应 |
| **DTO** | 定义请求/响应数据结构、验证规则、Swagger 文档 | 业务逻辑 |
| **Module** | 模块注册、依赖注入配置 | 业务逻辑 |

### 导出规则
- 所有 DTO 必须通过 `dto/index.ts` 聚合导出
- Controller 和 Service 在模块中注册，不需要全局导出
- 公共工具/装饰器放在 `src/common/` 对应目录

## 导入规范

- **使用绝对路径**: 从 `src/` 根开始导入，避免过长相对路径 `../../xxx`
- **分组排序**: 按以下顺序导入：
  1. NestJS 官方包 (`@nestjs/*`)
  2. 第三方包
  3. 内部模块 (`src/*`)
  4. 当前模块相对导入
- **DTO 导入**: 统一从 `./dto` 导入，不要直接导入单个文件

```typescript
// ✅ 正确
import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { QueryArticleListDto } from './dto';

// ❌ 错误
import { QueryArticleListDto } from './dto/query-article-list.dto';
```
