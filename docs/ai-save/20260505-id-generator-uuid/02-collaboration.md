# AI 协同开发成果 - ID 生成策略统一改造

## 📅 协同基本信息

- 协同日期：2026-05-05
- 开发模块：后端通用工具 - ID 生成器
- 协同时长：约 30 分钟
- 涉及服务：auth-service、backend

---

## 🎯 本次协同目标

### 用户原始需求

1. 将 `services/auth-service/src/auth/auth.service.ts` register 的 ID 从 author-N 自增格式更换为 UUID
2. 评估并分析其他表（RefreshTokens、Categories、Articles、ArticleContentBlocks、ArticleLikes、HotSearchKeywords）是否也需要统一改造成 UUID
3. 提前统一改造，避免未来开发时出现 ID 格式不统一的问题

---

## 📝 完成的工作内容

### 代码变更清单

| 序号 | 文件路径                                                 | 修改类型 | 修改内容简述                                        |
| ---- | -------------------------------------------------------- | -------- | --------------------------------------------------- |
| 1    | `services/backend/src/common/utils/id-generator.ts`      | ✅ 新增  | backend 全表 ID 生成工具类，7 个方法                |
| 2    | `services/auth-service/src/common/utils/id-generator.ts` | ✅ 新增  | auth-service ID 生成工具类，3 个方法                |
| 3    | `services/auth-service/src/auth/auth.service.ts`         | 🔄 修改  | 删除自增 ID 逻辑，改用 IdGenerator.generateUserId() |
| 4    | `services/backend/src/article/article.service.ts`        | 🔄 修改  | 点赞逻辑改用 IdGenerator.generateLikeId()           |
| 5    | `services/auth-service/src/auth/dto/user.dto.ts`         | 🔄 修改  | 更新 example 为标准 UUID 格式                       |
| 6    | `services/backend/src/auth/dto/user.dto.ts`              | 🔄 修改  | 更新 example 为标准 UUID 格式                       |
| 7    | `services/backend/src/users/dto/user-info.dto.ts`        | 🔄 修改  | 更新 example 为标准 UUID 格式                       |
| 8    | `services/backend/src/users/dto/user.dto.ts`             | 🔄 修改  | 更新 example 为标准 UUID 格式                       |

### 功能实现说明

本次改造实现了**"一处封装，全表生效"**的 ID 生成策略：

1. **彻底消除竞态条件 Bug**：原有的 `findLast + parse + increment` 方式在高并发下必然导致主键冲突，改用 UUID 后彻底解决。

2. **统一架构风格**：所有表的 ID 生成逻辑统一，开发者不需要思考"这个表应该用什么 ID 格式"。

3. **面向未来扩展**：未来想换成 NanoID、Snowflake 等其他 ID 格式，只需修改 `generateUUID()` 一个方法，无需改动业务代码。

4. **安全性提升**：UUID 不可预测，防止通过 ID 递增猜测平台真实用户量，防枚举攻击。

---

## 💡 关键技术决策

### 决策 1：选择 UUID v4 而非自增 ID

- **背景**：原实现使用 author-1、author-2 格式，需要查询数据库获取最大值 +1，存在竞态条件，且 ID 可预测
- **方案**：使用标准 UUID v4（`crypto.randomUUID()`）
- **理由**：
  - ✅ Node.js 内置，无需额外依赖
  - ✅ 全局唯一，无需查询数据库，无竞态
  - ✅ 不可预测，安全性高
  - ✅ 数据库已支持（VARCHAR(36) 正好匹配）
  - ✅ 分布式友好，多实例可独立生成

### 决策 2：现在统一改造，而不是等未来

- **背景**：部分表（Categories、Articles 等）目前暂无创建逻辑，只有查询
- **方案**：提前统一改造，创建工具类，定义好所有表的 ID 生成方法
- **理由**：
  - ✅ 避免未来开发功能时忘记用 UUID，又产生 author-N 格式数据
  - ✅ 数据一旦产生再清洗成本很高，防患于未然
  - ✅ 现在成本极低（创建一个工具类，10 分钟），未来收益永久
  - ✅ 架构一致性，代码风格统一

### 决策 3：封装统一工具类，而不是分散调用 crypto.randomUUID()

- **背景**：可以在每个 create 处直接写 `crypto.randomUUID()`
- **方案**：封装 `IdGenerator` 类，每个表有专属方法
- **理由**：
  - ✅ 语义化：`generateArticleId()` 比 `crypto.randomUUID()` 更清晰
  - ✅ 易于切换：未来换 ID 格式只需改一处
  - ✅ 便于统一添加前缀（如 usr*、art* 等），无需业务代码
  - ✅ 便于添加测试、Mock 等功能

---

## 🔧 核心代码实现

> 🚨 **强制必填章节**
> 📌 后续回顾直接看文档，不用翻 git 历史

### 1. `id-generator.ts` 【新增】- backend 全表 ID 生成器

> 统一封装所有表的 ID 生成方法，一处修改全表生效

```typescript
import crypto from 'crypto';

/**
 * ID 生成工具类
 * 统一所有表的主键生成策略，确保全库 ID 格式一致
 */
export class IdGenerator {
  /**
   * 生成标准 UUID v4
   * @returns UUID 字符串，如 "550e8400-e29b-41d4-a716-446655440000"
   */
  static generateUUID(): string {
    return crypto.randomUUID();
  }

  static generateCategoryId(): string {
    return this.generateUUID();
  }

  static generateArticleId(): string {
    return this.generateUUID();
  }

  static generateContentBlockId(): string {
    return this.generateUUID();
  }

  static generateHotSearchId(): string {
    return this.generateUUID();
  }

  static generateLikeId(): string {
    return this.generateUUID();
  }

  static generateUserId(): string {
    return this.generateUUID();
  }
}
```

---

### 2. `auth.service.ts` 【修改】- 删除自增 ID 逻辑

> 彻底解决高并发注册时的主键竞态条件 Bug

**修改前（有 Bug）**：

```typescript
// 查找最后一个用户获取最大 ID 并递增
const lastUser = await this.prismaService.users.findFirst({
  orderBy: { id: 'desc' },
  select: { id: true },
});

// 解析生成新 ID（❌ 竞态条件！两个请求同时查到相同的 lastUser）
let nextNumber = 1;
if (lastUser?.id) {
  const match = lastUser.id.match(/^author-(\d+)$/);
  if (match) {
    nextNumber = parseInt(match[1], 10) + 1;
  }
}
const newId = `author-${nextNumber}`;
```

**修改后（无 Bug）**：

```typescript
// ✅ 直接生成 UUID，无需查询，无竞态
const newId = IdGenerator.generateUserId();
```

---

### 3. `article.service.ts` 【修改】- 点赞逻辑改用工具类

> 统一代码风格，与业务逻辑保持一致

```typescript
// 修改前
await tx.articleLikes.create({
  data: {
    id: crypto.randomUUID(), // ❌ 直接调用，不统一
    article_id: articleId,
    user_id: userId,
    created_at: BigInt(Date.now()),
  },
});

// 修改后
await tx.articleLikes.create({
  data: {
    id: IdGenerator.generateLikeId(), // ✅ 统一调用，语义清晰
    article_id: articleId,
    user_id: userId,
    created_at: BigInt(Date.now()),
  },
});
```

---

## ⚠️ 遇到的问题与解决方案

### 问题 1：用户最初只想改 Users 表，是否需要全表统一？

- **现象**：用户最初需求只是"register id 更换为 UUID"，但系统中有 7 张表都是 VARCHAR(36)
- **原因**：如果只改 Users 表，未来开发其他表的创建功能时，很可能又会用回 author-N 格式，导致数据格式不统一
- **解决方案**：
  1. 先分析所有表的当前使用状态
  2. 给出"现在统一改" vs "等未来再改"的对比分析
  3. 用户决策后，提前创建工具类，统一所有表的 ID 生成策略
  4. 虽然部分表现在没有创建逻辑，但方法已经定义好，未来开发直接用

---

## 📌 代码审查要点

1. ✅ **消除竞态条件**：删除了需要查询数据库的自增逻辑，改用无状态 UUID 生成
2. ✅ **架构一致性**：所有表的 ID 生成策略统一，代码风格一致
3. ✅ **零依赖**：使用 Node.js 内置 `crypto` 模块，无需额外安装 npm 包
4. ✅ **易于扩展**：未来换 ID 格式只需修改一个方法，不影响业务代码
5. ✅ **TypeScript 安全**：所有修改均通过 TypeScript 编译检查
6. ✅ **无破坏性**：不影响已有数据，author-N 格式与 UUID 可完美共存

---

## 📚 后续建议与待办

### 后续开发建议

| 场景             | 做法                                                        |
| ---------------- | ----------------------------------------------------------- |
| 开发文章发布功能 | 直接调用 `IdGenerator.generateArticleId()`                  |
| 开发分类管理功能 | 直接调用 `IdGenerator.generateCategoryId()`                 |
| 新增数据库表     | 在 `IdGenerator` 中添加对应方法，命名规范 `generateXxxId()` |
| 想换成 NanoID    | 只需修改 `generateUUID()` 方法的实现，业务代码不动          |

### 可优化项（非必须）

1. **可添加 ID 前缀**：如 `usr_`、`art_`、`cat_` 等，便于一眼识别 ID 类型
2. **可切换为 NanoID**：比 UUID 更短，URL 更友好（21 字符 vs 36 字符）
3. **可添加 ID 校验方法**：`isValidUUID()` 用于输入验证

---

## 📊 数据统计

| 指标            | 数值             |
| --------------- | ---------------- |
| 新增文件        | 2 个             |
| 修改文件        | 6 个             |
| 新增代码        | ~ 80 行          |
| 删除代码        | ~ 15 行          |
| 解决 Bug        | 1 个（竞态条件） |
| 架构决策        | 3 项             |
| TypeScript 检查 | ✅ 全部通过      |

---

_本文档记录了 2026-05-05 完整的 ID 生成策略统一改造协同过程_
