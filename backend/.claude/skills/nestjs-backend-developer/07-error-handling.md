# 07 - 异常处理规范

## 异常体系分层

项目实现了完整的分层异常处理体系：

| 异常类型 | 使用场景 | 处理方式 |
|----------|----------|----------|
| **参数验证失败** | 请求参数不符合 DTO 验证规则 | 由全局 `ValidationPipe` 自动处理 |
| **NestJS 内置异常** | `NotFoundException`, `BadRequestException` 等 | 由 `AllExceptionsFilter` 统一包装为 `ApiResult` |
| **业务异常** | 业务逻辑错误（如用户名密码错误、手机号已注册）| 使用 `BusinessException` + 业务错误码 |
| **Prisma 错误** | 数据库操作错误（唯一约束冲突、记录不存在）| 可捕获后转换为业务异常 |
| **其他异常** | 未预料的系统异常 | 由 `AllExceptionsFilter` 捕获返回 500 |

---

## 抛出异常的原则

- **早抛出**: 检查到错误立即抛出
- **不吞异常**: 不要用 `return null` 隐藏错误，让上层知道发生了错误
- **统一处理**: 抛出后由全局异常过滤器统一处理为标准格式，不需要自己 try-catch

```typescript
// ✅ 正确
if (!article) {
  throw new NotFoundException('文章不存在');
}

// ❌ 错误
return null; // 不告知前端错误原因
```

---

## 常用内置异常类型

使用 NestJS 内置异常处理 HTTP 层面错误：

| 场景 | 异常类型 | HTTP 状态码 |
|------|----------|-------------|
| 资源不存在 | `NotFoundException('message')` | 404 |
| 参数错误 | `BadRequestException('message')` | 400 |
| 未认证 | `UnauthorizedException('message')` | 401 |
| 无权限 | `ForbiddenException('message')` | 403 |
| 服务器错误 | `InternalServerErrorException('message')` | 500 |

---

## 业务异常使用规范

### 什么是业务异常

业务异常是指业务逻辑层面的错误（如"用户名或密码错误"、"手机号已被注册"），这类错误：
- HTTP 状态码仍然是 **200**（因为请求本身格式正确）
- 通过**业务错误码**区分不同错误
- 前端可以根据业务错误码进行差异化处理

### 业务错误码分段规范

业务错误码按模块分段管理，在 `src/common/constants/business-error-codes.ts` 中定义：

| 段 | 模块 |
|----|------|
| 1xxx | 认证授权模块 (auth) |
| 2xxx | 用户模块 (user) |
| 3xxx | 文章模块 (article) |
| 4xxx | 分类模块 (category) |

### 使用方式

```typescript
import { BusinessException } from 'src/common/exceptions/business.exception';
import { BusinessErrorCode } from 'src/common/constants/business-error-codes';

// 直接使用预定义错误码
if (existingUser) {
  throw new BusinessException(BusinessErrorCode.AUTH_MOBILE_ALREADY_REGISTERED);
}

// 自定义错误消息
throw new BusinessException(
  BusinessErrorCode.AUTH_INVALID_CREDENTIALS,
  `手机号 ${mobile} 未注册`,
);
```

### 添加新业务错误码

在 `business-error-codes.ts` 中两步完成：

1. 在 `BusinessErrorCode` 枚举中添加错误码：
```typescript
export enum BusinessErrorCode {
  // ... 已有错误
  /** 文章不存在 */
  ARTICLE_NOT_FOUND = 3001,
}
```

2. 在 `BusinessErrorMessage` 中添加默认错误消息：
```typescript
export const BusinessErrorMessage: Record<BusinessErrorCode, string> = {
  // ... 已有消息
  [BusinessErrorCode.ARTICLE_NOT_FOUND]: '文章不存在',
};
```

---

## 全局异常处理流程

1. **Controller** → 抛出异常（不捕获）
2. **全局异常过滤器 `AllExceptionsFilter`** → 捕获异常
3. 包装为标准 `ApiResult` 格式响应返回给前端

```typescript
// Service 中直接抛出
getArticleDetail(id: string): Promise<ArticleDetailDto> {
  const article = await this.prisma.articles.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundException('文章不存在');
  }
  return convertToDto(article);
}

// Controller 不需要处理
@Get('detail')
getArticleDetail(@Param('id') id: string): Promise<ArticleDetailDto> {
  // 直接返回，异常自动被全局过滤器处理
  return this.articleService.getArticleDetail(id);
}
```

---

## Prisma 错误处理

常见 Prisma 错误代码：

| 错误码 | 含义 | 处理方式 |
|--------|------|----------|
| `P2002` | 唯一约束冲突 | 转换为业务异常提示"XXX已存在" |
| `P2003` | 外键约束冲突 | 删除时存在关联数据无法删除 |
| `P2025` | 更新/删除记录不存在 | 转换为 NotFoundException |

### 处理示例

```typescript
try {
  await this.prisma.articles.delete({ where: { id } });
} catch (error) {
  if (error.code === 'P2025') {
    throw new NotFoundException('文章不存在');
  }
  throw error;
}
```

---

## 最佳实践

1. **清晰的错误消息**: 错误信息对用户友好，能让人明白问题出在哪里
2. **不泄露敏感信息**: 不要把堆栈、数据库详细错误返回给前端
3. **业务错误优先使用业务错误码**: 便于前端统一处理和国际化
4. **HTTP 状态码和业务错误码分工**:
   - HTTP 状态码表示**请求是否成功到达并处理**
   - 业务错误码表示**业务逻辑上的错误**

---

## 检查清单

- [ ] 是否没有吞掉异常，正确抛出了？
- [ ] 业务错误是否使用了 `BusinessException` + 业务错误码？
- [ ] 新增业务错误是否添加了错误消息？
- [ ] Prisma 操作是否处理了常见错误（如记录不存在）？
- [ ] 错误消息是否清晰易懂？
