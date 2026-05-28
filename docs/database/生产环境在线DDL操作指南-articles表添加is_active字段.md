# 生产环境在线 DDL 操作指南 - articles 表添加 is_active 字段

> 📅 操作日期：2026-05-25
> 📊 数据量：约 100 万条
> 🎯 目标：零 downtime，不锁表，不影响用户访问

---

## 一、背景说明

### 现状

- `articles` 表目前没有 `is_active` 字段，无法实现文章的"启用/禁用/软删除"功能
- 当前通过 `is_published` 字段控制文章发布状态，但语义不够（发布 ≠ 活动）
- 项目中其他表（`categories`、`users`、`hot_search_keywords`）均已使用 `is_active` 模式

### 新增字段

| 字段名      | 类型    | 默认值 | 含义                                        |
| ----------- | ------- | ------ | ------------------------------------------- |
| `is_active` | BOOLEAN | true   | 文章是否处于活动状态（false = 已删除/禁用） |

---

## 二、操作方案选型

### 按 MySQL 版本选择

| MySQL 版本     | 操作方式                  | 预计耗时      | 锁表情况                  | 推荐度     |
| -------------- | ------------------------- | ------------- | ------------------------- | ---------- |
| **8.0+**       | 原生 ALTER + INSTANT 算法 | **< 1 秒**    | ✅ 完全不锁               | ⭐⭐⭐⭐⭐ |
| **5.7**        | pt-online-schema-change   | **3-5 分钟**  | ✅ 几乎不锁（短暂只读锁） | ⭐⭐⭐⭐   |
| **5.6 及以下** | gh-ost                    | **5-10 分钟** | ✅ 最安全                 | ⭐⭐⭐⭐   |

---

## 三、操作前检查清单

### ✅ 必做检查

```sql
-- 1. 确认 MySQL 版本
SELECT VERSION();

-- 2. 检查表大小和行数
SELECT
  table_rows,
  ROUND(data_length / 1024 / 1024, 2) AS data_size_mb
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name = 'articles';

-- 3. 🔴 最重要：检查长事务（会导致 metadata lock 卡死！）
SELECT
  trx_id,
  trx_state,
  trx_started,
  TIMESTAMPDIFF(SECOND, trx_started, NOW()) AS trx_duration_sec,
  trx_query
FROM information_schema.innodb_trx
WHERE TIMESTAMPDIFF(SECOND, trx_started, NOW()) > 5;

-- 如果上面有结果，等这些事务结束了再操作！

-- 4. 检查当前连接数（确认是低峰期）
SHOW GLOBAL STATUS LIKE 'Threads_connected';

-- 5. 检查表结构
SHOW CREATE TABLE articles\G
```

### ✅ 数据备份

```bash
# 只备份 articles 表，不影响性能
mysqldump -u用户名 -p密码 库名 articles > articles_backup_$(date +%Y%m%d).sql
```

### ✅ 选择操作时间窗口

**强烈建议：凌晨 2:00 - 4:00（业务低峰期）**

---

## 四、方案一：MySQL 8.0+ 操作步骤（推荐）

### 第 1 步：执行加列（< 1 秒完成）

```sql
-- ✅ 瞬间完成，不锁表，允许读写并行
ALTER TABLE articles
  ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true,
  ALGORITHM=INSTANT,
  LOCK=NONE;
```

### 第 2 步：立即验证（30 秒）

```sql
-- 1. 确认列已添加
SHOW COLUMNS FROM articles LIKE 'is_active';

-- 2. 验证默认值正确（所有数据应该都是 true）
SELECT
  COUNT(*) AS total,
  SUM(is_active = 1) AS active_count,
  SUM(is_active = 0) AS inactive_count
FROM articles;

-- ✅ 预期结果：total = active_count，inactive_count = 0

-- 3. 抽查几条数据
SELECT id, title, is_active FROM articles LIMIT 5;
```

### 第 3 步：检查主从同步

```sql
-- 在从库执行，确认延迟为 0
SHOW SLAVE STATUS\G
-- 看 Seconds_Behind_Master 是不是 0
```

---

## 五、方案二：MySQL 5.7 操作步骤

### 第 1 步：安装 percona-toolkit

```bash
# Mac
brew install percona-toolkit

# CentOS
yum install percona-toolkit
```

### 第 2 步：执行在线加列

```bash
pt-online-schema-change \
  --user=你的用户名 \
  --password=你的密码 \
  --host=127.0.0.1 \
  --database=你的库名 \
  --table=articles \
  --alter="ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true" \
  --chunk-size=1000 \
  --max-lag=1 \
  --check-interval=1 \
  --execute
```

**原理说明**：

1. 创建影子表 `_articles_new`
2. 在原表加触发器，增量同步数据
3. 分批次拷贝 100 万条数据（每次 1000 条）
4. 最后原子 `RENAME TABLE` 切换
5. 删除旧表

---

## 六、Prisma Schema 同步（关键！）

> ❌ 绝对不要跑 `prisma migrate dev`，会与手动执行的 SQL 冲突！

### 第 1 步：拉取数据库最新状态

```bash
cd services/backend

# 拉取数据库 schema 到本地
npx prisma db pull
```

此时 `prisma/schema.prisma` 会自动更新：

```prisma
model Articles {
  // ... 原有字段 ...
  is_published   Boolean    @default(true)
  is_active      Boolean    @default(true)  // ✅ 自动加上了
  created_at     BigInt
  updated_at     BigInt
  // ...
}
```

### 第 2 步：重新生成 Prisma Client

```bash
npx prisma generate
```

### 第 3 步：手动创建迁移记录

```bash
# 创建迁移目录
mkdir -p prisma/migrations/20260525_add_is_active_to_articles

# 创建迁移文件（标记为手动执行）
echo "-- Add is_active column to articles (manually executed via online DDL)" > prisma/migrations/20260525_add_is_active_to_articles/migration.sql

# 标记迁移为已应用
npx prisma migrate resolve --applied 20260525_add_is_active_to_articles
```

---

## 七、代码改造步骤

### 需要修改的文件

| 文件                 | 位置                                   | 修改内容                                                |
| -------------------- | -------------------------------------- | ------------------------------------------------------- |
| `article.service.ts` | 第 35 行 `queryArticleList()`          | where 条件加 `is_active: true`                          |
| `article.service.ts` | 第 124 行 `getFeaturedArticles()`      | where 条件加 `is_active: true`                          |
| `article.service.ts` | 第 356 行 `getArticleDetail()`         | where 条件加 `is_active: true`                          |
| `article.service.ts` | 第 309 行 `getUserLikeList()`          | 已判断 `!article.is_published`，加 `!article.is_active` |
| `article.service.ts` | 第 517 行 `queryArticleListByUserId()` | where 条件加 `is_active: true`                          |

### 代码示例

```typescript
// 修改前
const where: Prisma.ArticlesWhereInput = {
  is_published: true,
};

// 修改后 ✅
const where: Prisma.ArticlesWhereInput = {
  is_published: true,
  is_active: true, // + 新增
};
```

---

## 八、灰度发布策略

| 阶段           | 操作                                         | 风险等级 | 观察时间 |
| -------------- | -------------------------------------------- | -------- | -------- |
| **T + 0**      | 数据库加完 `is_active` 字段                  | 🟢 极低  | -        |
| **T + 1 小时** | 代码加 `is_active: true` 过滤，灰度 10% 流量 | 🟡 低    | 30 分钟  |
| **T + 2 小时** | 全量发布过滤代码                             | 🟢 极低  | 1 小时   |

### 监控指标

- 错误率：5xx 错误是否上升
- 响应时间：文章列表查询是否变慢
- 数据正确性：文章列表数量是否正常

---

## 九、回滚方案

### 紧急回滚（1 秒恢复）

```sql
-- MySQL 8.0: 瞬间删除列
ALTER TABLE articles DROP COLUMN is_active, ALGORITHM=INSTANT, LOCK=NONE;

-- MySQL 5.7: 如果是 pt-osc 加的
DROP TABLE IF EXISTS _articles_old;
```

### Prisma 回滚

```bash
# 标记迁移为已回滚
npx prisma migrate resolve --rolled-back 20260525_add_is_active_to_articles

# 重新拉取 schema
npx prisma db pull
npx prisma generate
```

---

## 十、完整操作 Checklist

```
[ ] 1. 确认 MySQL 版本，选择对应方案
[ ] 2. 选择业务低峰期（推荐凌晨 2-4 点）
[ ] 3. 检查没有运行超过 5 秒的长事务
[ ] 4. 备份 articles 表
[ ] 5. 执行加列操作
[ ] 6. 验证列已添加，默认值正确（100% 都是 true）
[ ] 7. 验证主从同步无延迟
[ ] 8. 同步 Prisma Schema，重新生成 Client
[ ] 9. 代码中所有查询添加 is_active: true 过滤
[ ] 10. 灰度发布 10% 流量，观察 30 分钟
[ ] 11. 无问题，全量发布
[ ] 12. 观察 1 小时，确认系统稳定
```

---

## 十一、后续扩展（可选）

### 1. 添加索引（数据量大了再加）

```prisma
model Articles {
  // ...
  is_active  Boolean  @default(true)

  @@index([is_active], map: "idx_is_active")
}
```

### 2. 添加管理员删除文章接口

```typescript
// article.service.ts
async deleteArticle(id: string): Promise<void> {
  await this.prisma.articles.update({
    where: { id },
    data: {
      is_active: false,
      updated_at: BigInt(Date.now()),
    },
  });
}
```

### 3. 管理后台查询已删除文章

```typescript
async queryArticleListForAdmin(query: AdminQueryDto) {
  const where: Prisma.ArticlesWhereInput = {
    // 管理员可以选择看所有状态
    ...(query.includeDeleted ? {} : { is_active: true }),
  };
}
```

---

## 十二、实战经验总结

1. **MySQL 8.0 的 INSTANT 真的是毫秒级**，5000 万条表加列也是 1 秒完成
2. **最容易踩的坑是 metadata lock**，有长事务时 ALTER 会卡住，一定要先检查
3. **pt-online-schema-change 不要在高峰期跑**，虽然不锁表但会有 IO 压力
4. **Prisma migrate 千万不要在生产直接用**，手动执行 SQL 再标记更可控
5. **代码过滤一定要全量覆盖**，漏掉一个查询就可能出现已删除的文章

---

## 十三、相关文档

- [索引设计指南](../architecture/er-diagrams/04-索引设计指南.md)
- [文章领域 ER 图](../architecture/er-diagrams/03-文章领域ER图.md)
- [数据库表结构 SQL 学习文档](../architecture/数据库表结构SQL学习文档.md)
