# 09 - Prisma ORM 开发规范

## 概述

本文档定义项目中使用 Prisma ORM 的开发规范，包括 schema 定义、数据访问、事务处理等最佳实践。

---

## 1. Schema 定义规范

### 文件位置
- Schema 文件: `prisma/schema.prisma` - 所有数据模型定义在同一个文件中
- 数据库文档: `prisma/` 目录下可存放 `README.md` 说明文档

### 模型命名
遵循标准 Prisma 命名约定：

- **模型名**: PascalCase（首字母大写），单数形式表示实体，如 `Article`, `Category`, `User`, `ArticleContentBlock`
- **表名**: 使用 `@@map("table_name")` 指定下划线复数表名
- **字段名**: 数据库字段使用下划线命名 (`article_count`, `created_at`)
- **TypeScript 生成类型**: Prisma 保持 schema 中定义的字段名，需要手动转换到 DTO 驼峰命名

示例：
```prisma
/// 文章内容块
model ArticleContentBlock {
  /// 块ID
  id          String          @id @db.VarChar(36)
  /// 文章ID
  article_id  String          @db.VarChar(36)
  /// 块类型
  block_type  String          @db.VarChar(20)
  /// 块内容
  content     String          @db.Text
  /// 排序
  sort_order  Int             @default(0)
  /// 创建时间戳
  created_at  BigInt
  /// 更新时间戳
  updated_at  BigInt
  /// 关联文章
  articles    ArticleContent @relation(fields: [article_id], references: [id], onDelete: Cascade, onUpdate: Restrict)

  @@index([article_id], map: "idx_article_id")
  @@index([article_id, sort_order], map: "idx_sort_order")
  @@map("article_content_blocks")
}
```

这种方式：
- ✅ TypeScript 可以正确识别 `prisma.articleContentBlock` 属性
- ✅ 不需要 `as any` 绕过类型检查
- ✅ 符合 Prisma 社区标准约定

### 字段规范
- **主键**: 优先使用字符串 `String @id @db.VarChar(36)` (支持 UUID 或语义ID)
- **外键**: 明确定义关系字段，使用 `@db.VarChar(36)` 匹配主键类型
- **必须字段**: 明确标注，不允许不必要的可空
- **可选字段**: 添加 `?`，并添加 `///` 文档注释
- **默认值**: 尽可能使用 `@default()` 设置合理默认值

### 文档注释
- 每个模型必须添加 `///` 文档注释说明用途
- 每个字段必须添加 `///` 文档注释说明含义

示例（参考项目现有 `RefreshTokens` 案例）：
```prisma
/// 刷新令牌
model RefreshTokens {
  /// 令牌ID
  id            String  @id @db.VarChar(36)
  /// 用户ID
  user_id       String  @db.VarChar(36)
  /// 刷新令牌值
  refresh_token String  @unique(map: "uk_refresh_token") @db.VarChar(500)
  /// 客户端IP
  client_ip     String  @db.VarChar(50)
  /// 过期时间戳
  expires_at    BigInt
  /// 是否已撤销
  revoked       Boolean @default(false)
  /// 创建时间戳
  created_at    BigInt
  /// 关联用户
  users         Users   @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: Restrict, map: "refresh_tokens_ibfk_1")

  @@index([expires_at], map: "idx_expires_at")
  @@index([user_id], map: "idx_user_id")
  @@map("refresh_tokens")
}
```

### 关系定义
- 双向关系必须在两端都定义关系字段
- 外键端使用 `@relation` 指定引用
- 一对多：一方用 `[]`，多方用单数
- 级联删除：明确声明 `onDelete: Cascade` 或 `onDelete: Restrict`
- **外键约束名**: `@relation` 末尾必须添加 `map: "table_name_ibfk_n"`，格式：`{table_name}_{ibfk}_{sequence_number}`

```prisma
// ✅ 正确
users Users @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: Restrict, map: "refresh_tokens_ibfk_1")
```

---

## 2. 项目架构与使用方式

### 架构选择：直接在 Service 中使用 PrismaService

**不引入 Repository 模式**，理由：
1. Prisma 本身已经是 Repository 层的抽象，不需要再包装一层
2. 减少了大量重复的样板代码（每个实体都要写 CRUD 接口和实现）
3. NestJS + Prisma 社区主流实践是直接使用
4. 对于小型博客系统，直接使用更简洁高效

### 使用方式

- **PrismaService 已经全局注册**: PrismaModule 是 `@Global()`，所有模块都可以直接注入
- **直接注入使用**: 在 Service 构造函数中注入 `private readonly prisma: PrismaService`
- **类型获取**: 从 `@prisma/client` 导入生成的类型
- **查询构造**: 直接使用 Prisma 强大的查询 API，无需自己编写 SQL

### 增强型 PrismaService

项目的 PrismaService 不仅是基础的数据库连接，还包含以下生产级增强功能：

#### 1. 连接重试机制

数据库连接失败时自动重试，避免临时网络波动导致服务启动失败：

```typescript
private async connectWithRetry(maxRetries: number, delayMs: number): Promise<void> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await this.$connect();
      this.logger.log('数据库连接成功');
      return;
    } catch (error) {
      lastError = error as Error;
      this.logger.warn(`数据库连接失败 (尝试 ${i + 1}/${maxRetries}): ${error.message}`);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  this.logger.error(`数据库连接失败，已达最大重试次数: ${lastError?.message}`);
  throw lastError;
}
```

#### 2. 慢查询检测

自动检测执行时间超过阈值的查询，并记录警告日志：

```typescript
private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 秒

private setupEventLogging(): void {
  this.$on('query' as any, (e: any) => {
    const duration = Number(e.duration);
    if (duration > this.SLOW_QUERY_THRESHOLD) {
      this.logger.warn(
        `慢查询检测: ${e.query} (${duration}ms) ` +
        `Params: ${e.params.substring(0, 200)}${e.params.length > 200 ? '...' : ''}`
      );
    }
  });
}
```

#### 3. 详细错误和警告日志

```typescript
this.$on('error' as any, (e: any) => {
  this.logger.error(`Prisma 错误: ${e.message}`, e.stack);
});

this.$on('warn' as any, (e: any) => {
  this.logger.warn(`Prisma 警告: ${e.message}`);
});
```

#### 4. 完整的 PrismaService 模板

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly SLOW_QUERY_THRESHOLD = 1000; // 1 秒

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    // 带重试的数据库连接（5 次重试，每次间隔 2 秒）
    await this.connectWithRetry(5, 2000);
    // 设置事件日志监听
    this.setupEventLogging();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('数据库连接已关闭');
  }

  private async connectWithRetry(maxRetries: number, delayMs: number): Promise<void> {
    // 连接重试逻辑（见上文）
  }

  private setupEventLogging(): void {
    // 慢查询检测 + 错误/警告日志（见上文）
  }
}
```

### PrismaModule 定义

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

示例：
```typescript
@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async queryList(params: QueryArticleListDto): Promise<ArticleListResponseDto> {
    const { page, pageSize, categoryId } = params;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where: { category_id: categoryId, is_published: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        select: { /* 只查询需要的字段 */ },
      }),
      this.prisma.article.count({ where: { category_id: categoryId } }),
    ]);

    // 下划线命名 → 驼峰命名转换
    const list = articles.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      coverUrl: item.cover_url,
      createdAt: item.created_at,
    }));

    return { list, total, page, pageSize };
  }
}
```

---

## 3. 查询最佳实践

### 只查询需要的字段
使用 `select` 只选择需要的字段，减少数据传输。避免查询全部字段。

```typescript
// ✅ 正确
const categories = await this.prisma.category.findMany({
  select: { id: true, name: true },
  where: { is_active: true },
});

// ❌ 避免
const categories = await this.prisma.category.findMany();
```

### 分页查询
- 使用 `skip` + `take` 分页
- 同时查询总数 `count()` 用于前端分页显示
- 博客系统不需要游标分页，传统分页足够

```typescript
const [list, total] = await Promise.all([
  this.prisma.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { created_at: 'desc' },
  }),
  this.prisma.article.count(),
]);
```

### 排序
- 始终明确指定 `orderBy`，不要依赖数据库默认排序
- 优先使用 `created_at`/`updated_at` 降序

### 计数统计
- 使用 `prisma.model.count()` 获取总数
- 不要查询出所有数据再 `length` 计数

---

## 4. 命名转换规范

✅ **schema.prisma 中**: 数据库字段使用下划线命名（与数据库一致）
✅ **转换到 DTO**: 在 Service 中手动转换为驼峰命名返回

```typescript
// ✅ 正确 - 下划线 → 驼峰转换
return {
  id: category.id,
  name: category.name,
  articleCount: category.article_count,
  imageUrl: category.image_url,
};

// ❌ 错误 - 直接返回，字段名还是下划线
return category;
```

**说明**: 本项目选择手动转换，简单直接，不需要额外依赖。

---

## 5. 事务处理

### 需要事务的场景
- 多个写操作需要原子性
- 级联更新（如删除分类后需要更新文章分类ID）

### 使用方式
```typescript
// 交互式事务
const result = await this.prisma.$transaction(async (tx) => {
  // 1. 创建文章
  const article = await tx.article.create({ data: articleData });

  // 2. 更新分类计数
  await tx.category.update({
    where: { id: categoryId },
    data: { article_count: { increment: 1 } },
  });

  return article;
});
```

### 批量操作
- 使用 `createMany` 批量创建
- 使用 `updateMany` 批量更新
- 使用 `deleteMany` 批量删除

---

## 6. 错误处理

- **唯一约束冲突**: Prisma 抛出 `P2002` 错误代码
- **外键约束冲突**: `P2003` 错误代码
- **记录不存在**: `P2025` 错误代码
- 使用全局异常过滤器统一处理，不需要每个 Service 都捕获
- 业务错误抛出自定义 `HttpException`

---

## 7. 常见模式

### 查询单条记录
```typescript
const item = await this.prisma.model.findUnique({
  where: { id },
});

if (!item) {
  throw new NotFoundException('记录不存在');
}
```

### 更新记录
```typescript
try {
  await this.prisma.model.update({
    where: { id },
    data: updateData,
  });
} catch (error) {
  if (error.code === 'P2025') {
    throw new NotFoundException('记录不存在');
  }
  throw error;
}
```

### 删除记录
```typescript
try {
  await this.prisma.model.delete({ where: { id } });
} catch (error) {
  if (error.code === 'P2025') {
    throw new NotFoundException('记录不存在');
  }
  throw error;
}
```

---

## 8. 性能优化

1. **适当使用 `select`**: 只查询需要的字段
2. **批量操作**: 使用 `createMany`/`updateMany` 减少 round-trip
3. **计数优化**: 使用 `count()` 代替查询所有计数
4. **避免 N+1 查询**: 使用 `include` 一次性加载关联数据
5. **索引**: 常用查询字段添加数据库索引 (`@unique` 或 `@@index`)

示例 - 预加载关联数据：
```typescript
const articles = await this.prisma.article.findMany({
  include: {
    category: true, // 一次性加载分类信息
  },
});
```

---

## 9. 迁移与部署

### 开发流程
1. 修改 `schema.prisma`
2. 生成迁移文件: `npx prisma migrate dev --name description`
3. 生成客户端: `npx prisma generate`
4. 测试验证

### 生产部署
1. `npx prisma migrate deploy` 执行迁移
2. `npx prisma generate` 生成客户端
3. 构建应用

---

## 检查清单
- [ ] Schema 中每个模型和字段都有 `///` 文档注释吗？
- [ ] 模型名 PascalCase，表名使用 `@@map` 指定下划线复数？
- [ ] 表名和字段名是否遵循下划线命名规范？
- [ ] 外键关系 `@relation` 是否添加了 `map` 指定外键约束名？
- [ ] 是否只查询需要的字段（使用 `select`）？
- [ ] 多个写操作是否使用事务保证原子性？
- [ ] 是否处理了记录不存在的情况（404）？
- [ ] 分页查询是否同时返回总数？
- [ ] 从查询结果转换到 DTO 时是否正确完成下划线到驼峰的命名转换？
- [ ] 常用查询字段是否添加了索引？
- [ ] PrismaService 是否实现了连接重试机制？
- [ ] 是否配置了慢查询检测阈值？
- [ ] 是否正确实现了 OnModuleInit 和 OnModuleDestroy 生命周期？
- [ ] 慢查询日志是否截断了过长的参数，避免日志过大？
- [ ] Prisma 错误和警告是否有独立的日志记录？
