# 05 - TypeScript 规范

遵循项目根目录的 TypeScript 基础规范，同时针对 NestJS 后端补充以下规则：

## 严格模式

✅ 开启 `strict: true`，必须遵守严格模式
❌ 禁止使用 `@ts-ignore`，除非特殊必要

### any 使用规则
- `no-explicit-any` = warning（允许必要时使用）
- ✅ **尽量避免** `any`，优先使用 `unknown` 或具体类型
- ✅ 只在和 Prisma 类型系统冲突等特殊场景使用 any

```typescript
// ✅ 正确 - 具体类型
async findOne(id: string): Promise<Article> { ... }

// ❌ 避免 - 除非真的需要
async findOne(id: any): Promise<any> { ... }
```

## 类型声明

✅ **必须显式声明**：
- 方法参数必须声明类型
- 方法返回值必须声明类型（特别是 async/Promise）
- 类属性必须声明类型

✅ 可选类型规则：
- 可选属性：`field?: Type` + 默认值直接赋值
- 可能为空：`field: Type | null`
- ❌ 禁止用 `undefined` 代替 `null`

## async/await 规范

✅ **Service**: 异步必须返回 `Promise<Type>`，明确声明泛型
✅ **Controller**: 不需要 `async/await`，直接返回 Promise
✅ **只有需要等待结果**的 Service 方法才使用 `async/await`

```typescript
// ✅ 正确 - Controller 直接返回 Promise
queryArticleList(
  @Query() query: QueryArticleListDto,
): Promise<ArticleListResponseDto> {
  return this.articleService.queryArticleList(query);
}

// ❌ 错误 - Controller 不必要的 async/await
async queryArticleList(
  @Query() query: QueryArticleListDto,
): Promise<ArticleListResponseDto> {
  return await this.articleService.queryArticleList(query);
}
```

## 导入导出

✅ 仅导出类型用 `export type`
✅ DTO 类直接 `export class`
✅ 导入分组排序：NestJS → 第三方 → 内部 → 当前模块

```typescript
// ✅ 正确排序
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Article } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { QueryArticleListDto } from './dto';
```

## 私有只读

✅ 依赖注入必须 `private readonly`
✅ 不变属性使用 `readonly`
✅ 尽可能私有，减少公开暴露

```typescript
// ✅ 正确
@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
}
```

## 错误处理

✅ catch 块中 `error` 是 `unknown` 类型，必须类型收窄

```typescript
// ✅ 正确 - 类型收窄
try {
  await this.operation();
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message);
  }
}

// ❌ 错误 - 直接访问 error.message
try {
  await this.operation();
} catch (error) {
  logger.error(error.message); // error: unknown -> 编译错误
}
```
