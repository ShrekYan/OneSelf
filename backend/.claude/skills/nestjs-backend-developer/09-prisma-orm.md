# 09 - Prisma ORM 开发规范

## 概述

本文档定义项目中使用 Prisma ORM 的开发规范，包括 schema 定义、数据访问、事务处理等最佳实践。

---

## 1. Schema 定义规范

### 文件位置
- Schema 文件: `prisma/schema.prisma` - 所有数据模型定义在同一个文件中
- 数据库文档: `prisma/` 目录下可存放 `README.md` 说明文档

### 模型命名
- **模型名**: PascalCase 单数形式 (`Category`, `Article`, `User`)
- **表名**: 使用 `@@map()` 指定下划线复数命名 (`@@map("categories")`)
- **字段名**: 数据库字段使用下划线命名 (`article_count`, `created_at`)
- **TypeScript 生成类型**: Prisma 保持 schema 中定义的字段名，需要手动转换到 DTO 驼峰命名

### 字段规范
- **主键**: 优先使用字符串 `String @id @db.VarChar(36)` (支持 UUID 或语义ID)
- **外键**: 明确定义关系字段，使用 `@db.VarChar(36)` 匹配主键类型
- **必须字段**: 明确标注，不允许不必要的可空
- **可选字段**: 添加 `?`，并添加 `///` 文档注释
- **默认值**: 尽可能使用 `@default()` 设置合理默认值

### 文档注释
- 每个模型必须添加 `///` 文档注释说明用途
- 每个字段必须添加 `///` 文档注释说明含义

示例：
```prisma
/// 文章分类
model Category {
  /// 分类ID（字符串ID，如 "frontend"）
  id            String  @id @db.VarChar(36)
  /// 分类名称
  name          String  @db.VarChar(50)
  /// 分类描述（可选）
  description   String? @db.VarChar(500)
  /// 分类图标图片URL
  image_url     String? @db.VarChar(500)
  /// 文章数量统计
  article_count Int     @default(0)
  /// 排序权重
  sort_order    Int?    @default(0)
  /// 是否启用
  is_active     Boolean @default(true)
  /// 创建时间戳（毫秒）
  created_at    BigInt
  /// 更新时间戳（毫秒）
  updated_at    BigInt

  @@map("categories")
}
```

### 关系定义
- 双向关系必须在两端都定义关系字段
- 外键端使用 `@relation` 指定引用
- 一对多：一方用 `[]`，多方用单数
- 级联删除：明确声明 `onDelete: Cascade` 或 `onDelete: SetNull`

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

Prisma schema 中定义的字段名就是 TypeScript 中使用的名称。因此遵循：

- **schema.prisma 中**: 数据库字段使用下划线命名（与数据库一致）
- **转换到 DTO**: 在 Service 中手动转换为驼峰命名返回

```typescript
// 数据库查询结果（字段名与 schema 定义一致，即下划线）
const category: Category = await this.prisma.category.findUnique(...);

// 转换为 DTO 驼峰命名
return {
  id: category.id,
  name: category.name,
  articleCount: category.article_count,  // 下划线 → 驼峰
  imageUrl: category.image_url,          // 下划线 → 驼峰
};
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
- [ ] 表名和字段名是否遵循下划线命名规范？
- [ ] 是否只查询需要的字段（使用 `select`）？
- [ ] 多个写操作是否使用事务保证原子性？
- [ ] 是否处理了记录不存在的情况（404）？
- [ ] 分页查询是否同时返回总数？
- [ ] 从查询结果转换到 DTO 时是否正确完成下划线到驼峰的命名转换？
- [ ] 常用查询字段是否添加了索引？
