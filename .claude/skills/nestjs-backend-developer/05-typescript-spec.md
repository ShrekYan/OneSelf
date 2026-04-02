# 05 - TypeScript 规范

遵循项目根目录的 TypeScript 基础规范，同时针对 NestJS 后端补充以下规则：

## 严格模式

- 开启 `strict: true`，必须遵守严格模式
- 禁止使用 `@ts-ignore`，禁止 `// @ts-expect-error`
- 禁止使用 `any`，优先使用 `unknown` 或具体类型

## 类型声明

### 必须显式声明
- 方法参数必须声明类型
- 方法返回值必须声明类型（特别是 async/Promise）
- 类属性必须声明类型

### 可选类型
- 可选属性使用 `?:`，默认值直接赋值
- 可能为 null 使用 `Type | null`
- 禁止用 `undefined` 代替 `null`

## async/await 规范

- Service 方法异步必须返回 `Promise<Type>`，明确声明泛型类型
- Controller 不需要 `async/await`，直接返回 Promise
- Service 中需要等待结果时才使用 `async/await`

```typescript
// ✅ 正确
queryArticleList(query: QueryArticleListDto): Promise<ArticleListResponseDto> {
  return this.articleRepository.find(query);
}

// 不必要的 async/await 在 Controller
// Controller 直接返回 Promise 即可
```

## 导入导出

- 类型导出使用 `export type` 当仅导出类型时
- DTO 类直接 `export class`
- 导入分组排序：NestJS → 第三方 → 内部 → 当前模块

```typescript
// 正确排序示例
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArticleSortBy } from './dto';
```

## 私有只读

- 依赖注入的服务使用 `private readonly`
- 不变的类属性使用 `readonly`
- 尽可能使用私有字段，减少公开暴露

```typescript
@Injectable()
export class ArticleService {
  constructor(
    private readonly configService: ConfigService,
    private readonly categoryService: CategoryService,
  ) {}
}
```

## 错误处理

- catch 块中 `error` 是 `unknown` 类型，必须类型收窄
```typescript
try {
  await this.operation();
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message);
  }
}
```
