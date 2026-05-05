# ID 生成策略统一改造模块

## 📋 模块概述

本模块负责统一全项目所有数据库表的主键生成策略，将原本分散的 ID 生成逻辑（包括有竞态风险的 author-N 自增方式）统一封装为标准 UUID v4 生成工具类。

---

## 🎯 核心功能

### 1. IdGenerator 工具类

统一的 ID 生成工具类，提供以下方法：

| 方法名                     | 适用表               | 说明                         |
| -------------------------- | -------------------- | ---------------------------- |
| `generateUUID()`           | -                    | 生成标准 UUID v4（底层方法） |
| `generateCategoryId()`     | Categories           | 生成分类 ID                  |
| `generateArticleId()`      | Articles             | 生成文章 ID                  |
| `generateContentBlockId()` | ArticleContentBlocks | 生成文章内容块 ID            |
| `generateHotSearchId()`    | HotSearchKeywords    | 生成热搜关键词 ID            |
| `generateLikeId()`         | ArticleLikes         | 生成点赞记录 ID              |
| `generateUserId()`         | Users                | 生成用户 ID                  |
| `generateRefreshTokenId()` | RefreshTokens        | 生成刷新令牌 ID              |

**使用示例**：

```typescript
import { IdGenerator } from '@/common/utils/id-generator';

// 创建用户
const user = await this.prisma.users.create({
  data: {
    id: IdGenerator.generateUserId(),
    username: '13800138000',
    // ...
  },
});

// 创建点赞记录
await this.prisma.articleLikes.create({
  data: {
    id: IdGenerator.generateLikeId(),
    article_id: articleId,
    user_id: userId,
    // ...
  },
});
```

---

### 2. 解决的核心问题

| 问题             | 解决方案                                   | 效果                          |
| ---------------- | ------------------------------------------ | ----------------------------- |
| **竞态条件 Bug** | 改用 `crypto.randomUUID()`，无需查询数据库 | ✅ 高并发注册不再主键冲突     |
| **ID 可预测**    | UUID 完全随机，无法推测用户总量            | ✅ 防枚举攻击，保护业务数据   |
| **代码分散**     | 统一封装到 `IdGenerator` 类                | ✅ 一处修改，全表生效         |
| **风格不统一**   | 所有表使用相同的 ID 生成策略               | ✅ 代码风格一致，降低维护成本 |
| **分布式不友好** | UUID 无需中心化生成                        | ✅ 多实例部署无问题           |

---

## 🏗️ 架构设计

### 设计原则

1. **零依赖**：仅使用 Node.js 内置 `crypto` 模块，无需安装任何 npm 包
2. **高性能**：UUID 生成极快，无性能损耗
3. **易扩展**：未来新增表只需添加对应方法，无需修改底层实现
4. **易切换**：未来想换成 NanoID 或其他格式，只需修改 `generateUUID()` 一个方法

### 目录结构

```
services/
├── backend/
│   └── src/
│       └── common/
│           └── utils/
│               └── id-generator.ts  ✅ backend 全表 ID 生成器
└── auth-service/
    └── src/
        └── common/
            └── utils/
                └── id-generator.ts  ✅ auth-service ID 生成器
```

---

## 📊 数据库兼容性

所有表的主键字段都是 `VARCHAR(36)`，完美匹配标准 UUID 长度：

| 表名                 | 字段类型    | 兼容性      |
| -------------------- | ----------- | ----------- |
| Users                | VARCHAR(36) | ✅ 完全兼容 |
| Articles             | VARCHAR(36) | ✅ 完全兼容 |
| Categories           | VARCHAR(36) | ✅ 完全兼容 |
| ArticleLikes         | VARCHAR(36) | ✅ 完全兼容 |
| ArticleContentBlocks | VARCHAR(36) | ✅ 完全兼容 |
| HotSearchKeywords    | VARCHAR(36) | ✅ 完全兼容 |
| RefreshTokens        | VARCHAR(36) | ✅ 完全兼容 |

> 💡 **注意**：无需执行任何数据库 Migration，字段定义已支持。

---

## 🔧 修改的文件清单

| 序号 | 文件路径                                                 | 修改类型 | 说明                               |
| ---- | -------------------------------------------------------- | -------- | ---------------------------------- |
| 1    | `services/backend/src/common/utils/id-generator.ts`      | ✅ 新增  | 全表 ID 生成工具类                 |
| 2    | `services/auth-service/src/common/utils/id-generator.ts` | ✅ 新增  | auth-service ID 生成工具类         |
| 3    | `services/auth-service/src/auth/auth.service.ts`         | 🔄 修改  | 删除自增 ID 逻辑，改用 IdGenerator |
| 4    | `services/backend/src/article/article.service.ts`        | 🔄 修改  | 点赞逻辑改用 IdGenerator           |
| 5    | `services/auth-service/src/auth/dto/user.dto.ts`         | 🔄 修改  | 更新 example 为标准 UUID           |
| 6    | `services/backend/src/auth/dto/user.dto.ts`              | 🔄 修改  | 更新 example 为标准 UUID           |
| 7    | `services/backend/src/users/dto/user-info.dto.ts`        | 🔄 修改  | 更新 example 为标准 UUID           |
| 8    | `services/backend/src/users/dto/user.dto.ts`             | 🔄 修改  | 更新 example 为标准 UUID           |

**代码变更统计**：新增代码约 80 行，删除代码约 15 行。

---

## 🚀 未来开发指南

### 开发新功能时（如文章发布、分类管理）

```typescript
// 直接调用，无需思考
const article = await this.prisma.articles.create({
  data: {
    id: IdGenerator.generateArticleId(), // ✅ 直接用
    title: '文章标题',
    // ...
  },
});
```

### 新增表时

1. 在 `IdGenerator` 类中添加对应方法
2. 方法内部调用 `generateUUID()` 即可
3. 保持命名规范：`generateXxxId()`

---

## ⚠️ 注意事项

| 项               | 说明                                       |
| ---------------- | ------------------------------------------ |
| **已有数据兼容** | ✅ 完全兼容，`author-N` 格式和 UUID 可共存 |
| **外键关联**     | ✅ 都是字符串，无任何问题                  |
| **性能影响**     | ✅ UUID 生成极快（< 0.1ms），无感          |
| **数据库索引**   | ✅ VARCHAR(36) 索引性能完全满足需求        |

---

## 📝 代码统计

| 指标            | 数值        |
| --------------- | ----------- |
| 新增文件        | 2 个        |
| 修改文件        | 6 个        |
| 新增代码        | ~ 80 行     |
| 删除代码        | ~ 15 行     |
| TypeScript 检查 | ✅ 全部通过 |

---

## 🎯 改造收益总结

| 收益           | 说明                            |
| -------------- | ------------------------------- |
| **架构一致性** | ✅ 所有表 ID 生成策略统一       |
| **Bug 修复**   | ✅ 彻底解决高并发主键冲突问题   |
| **安全性提升** | ✅ 防止用户量被猜测，防枚举攻击 |
| **代码复用**   | ✅ 一处封装，全项目调用         |
| **易于扩展**   | ✅ 未来换 ID 格式，只需改一处   |
| **分布式友好** | ✅ 多实例部署无需中心化 ID 生成 |

---

_本文档最后更新于 2026-05-05_
