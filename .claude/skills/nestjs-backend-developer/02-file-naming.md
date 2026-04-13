# 02 - 文件命名规范

所有文件使用 **kebab-case** 命名规则（所有字母小写，单词用短横线分隔）。

## 文件命名对照表

| 文件类型 | 命名规则 | 示例 |
|----------|----------|------|
| 模块文件 | `{module-name}.module.ts` | `article.module.ts` |
| 控制器 | `{module-name}.controller.ts` | `article.controller.ts` |
| 服务 | `{module-name}.service.ts` | `article.service.ts` |
| DTO | `{dto-name}.dto.ts` | `query-article-list.dto.ts` |
| 守卫 | `{guard-name}.guard.ts` | `jwt-auth.guard.ts` |
| 拦截器 | `{interceptor-name}.interceptor.ts` | `transform.interceptor.ts` |
| 过滤器 | `{filter-name}.filter.ts` | `all-exceptions.filter.ts` |
| 装饰器 | `{decorator-name}.decorator.ts` | `current-user.decorator.ts` |
| 自定义异常 | `{exception-name}.exception.ts` | `business.exception.ts` |
| 常量/错误码 | `{name}.ts` | `business-error-codes.ts` |
| 单元测试 | `{module-name}.controller.spec.ts` | `article.controller.spec.ts` |

## DTO 命名规范

- **请求 DTO**: 动词 + 名词 + `Dto`，如 `QueryArticleListDto`, `CreateArticleDto`, `UpdateArticleDto`
- **响应 DTO**: 名词 + 响应描述 + `Dto`，如 `ArticleListResponseDto`, `ArticleDetailDto`
- **列表项 DTO**: `{ItemType}ListItemDto`，如 `ArticleListItemDto`
- **所有 DTO 必须以 `Dto` 结尾**（遵循 NestJS 社区约定）

## 类名命名规范

- **模块类**: `{ModuleName}Module`，PascalCase，如 `ArticleModule`
- **控制器类**: `{ModuleName}Controller`，如 `ArticleController`
- **服务类**: `{ModuleName}Service`，如 `ArticleService`
- **DTO 类**: 与文件名对应，PascalCase，如 `QueryArticleListDto`

## 枚举命名规范

- 枚举名称使用 PascalCase
- 枚举成员使用 UPPER_SNAKE_CASE
- 需要指定字符串值，保证 Swagger 文档可读性

```typescript
// ✅ 正确
export enum ArticleSortBy {
  PUBLISHED_AT = 'publishedAt',
  VIEWS = 'views',
  LIKES = 'likes',
}

// ❌ 错误
export enum articleSortBy {
  publishedAt = 'publishedAt';
}
```
