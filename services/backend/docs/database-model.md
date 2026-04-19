# 数据库模型设计

## 设计概述

本文档定义了博客后端项目的关系型数据库模型设计，基于现有的接口定义和前端类型定义，遵循第三范式设计。

## 设计原则

- 遵循 **第三范式（3NF）**，消除数据冗余
- 每个表对应一个实体，关联通过外键实现
- 所有表必须包含 `created_at` 和 `updated_at` 审计字段
- 使用 UUID 字符串作为主键（匹配前端 `string` 类型 ID 设计）
- 合理处理可空字段，严格遵循前端类型定义
- 为常用查询字段添加索引，优化查询性能

---

## 表结构设计

### 1. `users` - 用户表（用户基础信息 + 认证信息）

| 字段名 | 数据类型 | 约束 | 含义说明 |
|--------|----------|------|----------|
| `id` | VARCHAR(36) | PRIMARY KEY | 用户ID（UUID） |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | 用户名（登录账号） |
| `password_hash` | VARCHAR(255) | NOT NULL | 密码哈希（bcrypt加密） |
| `email` | VARCHAR(100) | NULL | 邮箱 |
| `nickname` | VARCHAR(50) | NULL | 昵称 |
| `avatar` | VARCHAR(500) | NULL | 头像URL |
| `is_active` | TINYINT(1) | NOT NULL DEFAULT 1 | 账户是否启用 |
| `created_at` | BIGINT | NOT NULL | 创建时间（时间戳） |
| `updated_at` | BIGINT | NOT NULL | 更新时间（时间戳） |

---

### 2. `refresh_tokens` - 刷新令牌表（认证模块）

| 字段名 | 数据类型 | 约束 | 含义说明 |
|--------|----------|------|----------|
| `id` | VARCHAR(36) | PRIMARY KEY | 令牌ID |
| `user_id` | VARCHAR(36) | NOT NULL, FOREIGN KEY → users.id | 对应用户 |
| `refresh_token` | VARCHAR(500) | NOT NULL | 刷新令牌值 |
| `client_ip` | VARCHAR(50) | NOT NULL | 客户端IP |
| `expires_at` | BIGINT | NOT NULL | 过期时间（时间戳） |
| `revoked` | TINYINT(1) | NOT NULL DEFAULT 0 | 是否已撤销 |
| `created_at` | BIGINT | NOT NULL | 创建时间 |

---

### 3. `categories` - 文章分类表

| 字段名 | 数据类型 | 约束 | 含义说明 |
|--------|----------|------|----------|
| `id` | VARCHAR(36) | PRIMARY KEY | 分类ID |
| `name` | VARCHAR(50) | NOT NULL | 分类名称 |
| `description` | VARCHAR(500) | NULL | 分类描述 |
| `image_url` | VARCHAR(500) | NULL | 分类封面图片URL |
| `article_count` | INT | NOT NULL DEFAULT 0 | 该分类下已发布文章数量（冗余字段，优化查询） |
| `sort_order` | INT | NULL DEFAULT 0 | 排序权重 |
| `is_active` | TINYINT(1) | NOT NULL DEFAULT 1 | 是否启用 |
| `created_at` | BIGINT | NOT NULL | 创建时间 |
| `updated_at` | BIGINT | NOT NULL | 更新时间 |

---

### 4. `articles` - 文章表

| 字段名 | 数据类型 | 约束 | 含义说明 |
|--------|----------|------|----------|
| `id` | VARCHAR(36) | PRIMARY KEY | 文章ID |
| `title` | VARCHAR(200) | NOT NULL | 文章标题 |
| `summary` | VARCHAR(500) | NULL | 文章摘要 |
| `cover_url` | VARCHAR(500) | NULL | 封面图片URL |
| `category_id` | VARCHAR(36) | NOT NULL, FOREIGN KEY → categories.id | 所属分类 |
| `author_id` | VARCHAR(36) | NOT NULL, FOREIGN KEY → users.id | 作者ID |
| `author_name` | VARCHAR(50) | NULL | 作者名称（冗余） |
| `author_avatar` | VARCHAR(500) | NULL | 作者头像URL（冗余） |
| `tags` | VARCHAR(200) | NULL | 标签（逗号分隔） |
| `views` | INT | NOT NULL DEFAULT 0 | 阅读量 |
| `likes` | INT | NOT NULL DEFAULT 0 | 点赞数 |
| `comments_count` | INT | NOT NULL DEFAULT 0 | 评论数 |
| `is_top` | TINYINT(1) | NOT NULL DEFAULT 0 | 是否置顶（特色文章） |
| `read_time` | INT | NULL | 预计阅读时间（分钟） |
| `published_at` | BIGINT | NOT NULL | 发布时间（时间戳） |
| `is_published` | TINYINT(1) | NOT NULL DEFAULT 1 | 是否发布 |
| `created_at` | BIGINT | NOT NULL | 创建时间 |
| `updated_at` | BIGINT | NOT NULL | 更新时间 |

---

### 5. `article_content_blocks` - 文章内容块表（一对多关系）

一篇文章可以拆分为多个内容块（标题、段落、图片、引用等），便于结构化编辑

| 字段名 | 数据类型 | 约束 | 含义说明 |
|--------|----------|------|----------|
| `id` | VARCHAR(36) | PRIMARY KEY | 内容块ID |
| `article_id` | VARCHAR(36) | NOT NULL, FOREIGN KEY → articles.id | 所属文章 |
| `block_type` | VARCHAR(20) | NOT NULL | 内容块类型：text/image/quote/code/heading |
| `content` | TEXT | NOT NULL | 内容（HTML或Markdown） |
| `sort_order` | INT | NOT NULL DEFAULT 0 | 排序顺序 |
| `created_at` | BIGINT | NOT NULL | 创建时间 |
| `updated_at` | BIGINT | NOT NULL | 更新时间 |

---

### 6. `article_likes` - 文章点赞表（用户-文章多对多关系）

| 字段名 | 数据类型 | 约束 | 含义说明 |
|--------|----------|------|----------|
| `id` | VARCHAR(36) | PRIMARY KEY | 记录ID |
| `article_id` | VARCHAR(36) | NOT NULL, FOREIGN KEY → articles.id | 文章ID |
| `user_id` | VARCHAR(36) | NOT NULL, FOREIGN KEY → users.id | 用户ID |
| `created_at` | BIGINT | NOT NULL | 点赞时间 |

**联合唯一约束**: `UNIQUE(article_id, user_id)` 防止同一用户重复点赞

---

### 7. `hot_search_keywords` - 热门搜索关键词表（分类模块）

| 字段名 | 数据类型 | 约束 | 含义说明 |
|--------|----------|------|----------|
| `id` | VARCHAR(36) | PRIMARY KEY | 关键词ID |
| `keyword` | VARCHAR(50) | NOT NULL | 关键词 |
| `hot_score` | INT | NOT NULL DEFAULT 0 | 热度分数（用于排序） |
| `is_active` | TINYINT(1) | NOT NULL DEFAULT 1 | 是否启用 |
| `sort_order` | INT | DEFAULT 0 | 排序 |
| `created_at` | BIGINT | NOT NULL | 创建时间 |

---

## 表关系图（文字描述）

```
users (1) ─┐
           ├─→ refresh_tokens (N)
           └─→ articles (N)

categories (1) ──→ articles (N)

articles (1) ─┐
              ├─→ article_content_blocks (N)
              └─→ article_likes (N) ← (N) users
```

---

## 索引设计建议

| 表名 | 索引字段 | 索引类型 | 说明 |
|------|----------|----------|------|
| `refresh_tokens` | `user_id` | 普通索引 | 快速查询用户的所有令牌 |
| `refresh_tokens` | `refresh_token` | 唯一索引 | 快速校验令牌 |
| `articles` | `category_id` | 普通索引 | 按分类筛选文章 |
| `articles` | `author_id` | 普通索引 | 查询作者的文章列表 |
| `articles` | `is_top` | 普通索引 | 查询特色文章 |
| `articles` | `published_at` | 普通索引 | 按发布时间排序 |
| `article_likes` | `article_id, user_id` | 联合唯一索引 | 防重复 + 快速检查点赞状态 |
| `article_likes` | `user_id` | 普通索引 | 查询用户点赞过的文章 |
| `hot_search_keywords` | `hot_score` | 普通索引 | 按热度排序 |

---

## 外键约束说明

| 子表 | 外键字段 | 父表 | 参照字段 | 删除行为 | 说明 |
|------|----------|------|----------|----------|------|
| `refresh_tokens` | `user_id` | `users` | `id` | CASCADE | 用户删除时同时删除令牌 |
| `articles` | `category_id` | `categories` | `id` | RESTRICT | 分类下有文章时不允许删除分类 |
| `articles` | `author_id` | `users` | `id` | RESTRICT | 用户有文章时不允许删除用户 |
| `article_content_blocks` | `article_id` | `articles` | `id` | CASCADE | 文章删除时同时删除内容块 |
| `article_likes` | `article_id` | `articles` | `id` | CASCADE | 文章删除时同时删除点赞记录 |
| `article_likes` | `user_id` | `users` | `id` | CASCADE | 用户删除时同时删除点赞记录 |

---

## 数据类型选择说明

1. **ID 主键**: 全部使用 `VARCHAR(36)` 存储 UUID，匹配前端 `string` 类型
2. **时间戳**: 使用 `BIGINT` 存储 Unix 时间戳（毫秒），便于前端处理
3. **金额**: 使用 `DECIMAL(18,2)` 存储金额，避免浮点精度问题
4. **布尔值**: 使用 `TINYINT(1)` 存储，0 代表 false，1 代表 true
5. **文本**: 短文本用 `VARCHAR(n)`，长文本用 `TEXT`

---

## 总结

总共设计 **7 张表**：

| 表序号 | 表名 | 用途 |
|--------|------|------|
| 1 | `users` | 用户基础信息 + 认证信息 |
| 2 | `refresh_tokens` | JWT 刷新令牌 |
| 3 | `categories` | 文章分类 |
| 4 | `articles` | 文章主表 |
| 5 | `article_content_blocks` | 文章结构化内容块 |
| 6 | `article_likes` | 用户文章点赞关系 |
| 7 | `hot_search_keywords` | 热门搜索关键词 |

设计符合第三范式，合理消除了数据冗余，同时为了查询性能做了必要的冗余字段（如文章的作者名称、分类文章计数），并规划了完整的索引和外键约束。
