# 07 - 异常处理规范

## 抛出异常

- 使用 NestJS 内置 `HttpException` 或其子类
- 不要吞掉异常，抛出后由全局异常过滤器统一处理
- 业务异常使用 `HttpException` 并指定正确的 HTTP 状态码

```typescript
// ✅ 正确
if (!article) {
  throw new NotFoundException('文章不存在');
}

// ❌ 错误
return null; // 不告知前端错误原因
```

## 常用异常类型

| 场景 | 异常类型 | 状态码 |
|------|----------|--------|
| 资源不存在 | `NotFoundException('message')` | 404 |
| 参数错误 | `BadRequestException('message')` | 400 |
| 未认证 | `UnauthorizedException('message')` | 401 |
| 无权限 | `ForbiddenException('message')` | 500 |
| 服务器错误 | `InternalServerErrorException('message')` | 500 |

## 全局异常处理

- 项目已经配置全局异常过滤器
- 异常会被统一格式化输出
- 异常信息会被日志记录
- 不需要 Controller/Service 自己抓异常再包装

## 最佳实践

- 早抛出：检查到错误立即抛出
- 异常信息清晰易懂，对用户友好
- 不要把敏感信息放在异常信息中
- 在 Service 中抛出异常，Controller 不需要 try-catch

```typescript
// Service 中直接抛出
getArticleDetail(id: string): Promise<ArticleDetailDto> {
  const article = this.articles.find(a => a.id === id);
  if (!article) {
    throw new NotFoundException(`文章不存在: ${id}`);
  }
  return article;
}

// Controller 不需要处理
@Get('detail')
getArticleDetail(...) {
  // 直接返回，异常自动处理
  return this.articleService.getArticleDetail(...);
}
```
