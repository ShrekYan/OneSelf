# MySQL 建表 SQL

本文档包含根据数据库模型设计生成的完整 `CREATE TABLE` SQL 语句，可直接在 MySQL 中执行创建所有表。

## 使用说明

1. 请先在 MySQL 中创建数据库：
```sql
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog;
```

2. 按顺序执行以下建表语句（注意外键依赖顺序）：
   - `users` → `refresh_tokens` → `categories` → `articles` → `article_content_blocks` → `article_likes` → `hot_search_keywords`

---

## 建表 SQL

### 1. `users` - 用户表

```sql
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL COMMENT '用户ID（UUID）',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名（登录账号）',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希（bcrypt加密）',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '账户是否启用',
  `created_at` BIGINT NOT NULL COMMENT '创建时间（时间戳）',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间（时间戳）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表（用户基础信息 + 认证信息）';
```

---

### 2. `refresh_tokens` - 刷新令牌表

```sql
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` VARCHAR(36) NOT NULL COMMENT '令牌ID',
  `user_id` VARCHAR(36) NOT NULL COMMENT '对应用户',
  `refresh_token` VARCHAR(500) NOT NULL COMMENT '刷新令牌值',
  `client_ip` VARCHAR(50) NOT NULL COMMENT '客户端IP',
  `expires_at` BIGINT NOT NULL COMMENT '过期时间（时间戳）',
  `revoked` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已撤销',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_refresh_token` (`refresh_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='刷新令牌表（认证模块）';
```

---

### 3. `categories` - 文章分类表

```sql
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) NOT NULL COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '分类描述',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '分类封面图片URL',
  `article_count` INT NOT NULL DEFAULT 0 COMMENT '该分类下已发布文章数量（冗余字段，优化查询）',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类表';
```

---

### 4. `articles` - 文章表

```sql
CREATE TABLE IF NOT EXISTS `articles` (
  `id` VARCHAR(36) NOT NULL COMMENT '文章ID',
  `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
  `summary` VARCHAR(500) DEFAULT NULL COMMENT '文章摘要',
  `cover_url` VARCHAR(500) DEFAULT NULL COMMENT '封面图片URL',
  `category_id` VARCHAR(36) NOT NULL COMMENT '所属分类',
  `author_id` VARCHAR(36) NOT NULL COMMENT '作者ID',
  `author_name` VARCHAR(50) DEFAULT NULL COMMENT '作者名称（冗余）',
  `author_avatar` VARCHAR(500) DEFAULT NULL COMMENT '作者头像URL（冗余）',
  `tags` VARCHAR(200) DEFAULT NULL COMMENT '标签（逗号分隔）',
  `views` INT NOT NULL DEFAULT 0 COMMENT '阅读量',
  `likes` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  `comments_count` INT NOT NULL DEFAULT 0 COMMENT '评论数',
  `is_top` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否置顶（特色文章）',
  `read_time` INT DEFAULT NULL COMMENT '预计阅读时间（分钟）',
  `published_at` BIGINT NOT NULL COMMENT '发布时间（时间戳）',
  `is_published` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否发布',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_is_top` (`is_top`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_is_published` (`is_published`),
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';
```

---

### 5. `article_content_blocks` - 文章内容块表

```sql
CREATE TABLE IF NOT EXISTS `article_content_blocks` (
  `id` VARCHAR(36) NOT NULL COMMENT '内容块ID',
  `article_id` VARCHAR(36) NOT NULL COMMENT '所属文章',
  `block_type` VARCHAR(20) NOT NULL COMMENT '内容块类型：text/image/quote/code/heading',
  `content` TEXT NOT NULL COMMENT '内容（HTML或Markdown）',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_sort_order` (`article_id`, `sort_order`),
  FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章内容块表（一对多关系）';
```

---

### 6. `article_likes` - 文章点赞表

```sql
CREATE TABLE IF NOT EXISTS `article_likes` (
  `id` VARCHAR(36) NOT NULL COMMENT '记录ID',
  `article_id` VARCHAR(36) NOT NULL COMMENT '文章ID',
  `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
  `created_at` BIGINT NOT NULL COMMENT '点赞时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_user` (`article_id`, `user_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章点赞表（用户-文章多对多关系）';
```

---

### 7. `hot_search_keywords` - 热门搜索关键词表

```sql
CREATE TABLE IF NOT EXISTS `hot_search_keywords` (
  `id` VARCHAR(36) NOT NULL COMMENT '关键词ID',
  `keyword` VARCHAR(50) NOT NULL COMMENT '关键词',
  `hot_score` INT NOT NULL DEFAULT 0 COMMENT '热度分数（用于排序）',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_hot_score` (`hot_score`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='热门搜索关键词表';
```

---

## 完整汇总（一次性执行所有建表）

```sql
-- 创建数据库（请先手动执行）
-- CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE blog;

-- 1. 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL COMMENT '用户ID（UUID）',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名（登录账号）',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希（bcrypt加密）',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '账户是否启用',
  `created_at` BIGINT NOT NULL COMMENT '创建时间（时间戳）',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间（时间戳）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表（用户基础信息 + 认证信息）';

-- 2. 刷新令牌表
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` VARCHAR(36) NOT NULL COMMENT '令牌ID',
  `user_id` VARCHAR(36) NOT NULL COMMENT '对应用户',
  `refresh_token` VARCHAR(500) NOT NULL COMMENT '刷新令牌值',
  `client_ip` VARCHAR(50) NOT NULL COMMENT '客户端IP',
  `expires_at` BIGINT NOT NULL COMMENT '过期时间（时间戳）',
  `revoked` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已撤销',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_refresh_token` (`refresh_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='刷新令牌表（认证模块）';

-- 3. 文章分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) NOT NULL COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '分类描述',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '分类封面图片URL',
  `article_count` INT NOT NULL DEFAULT 0 COMMENT '该分类下已发布文章数量（冗余字段，优化查询）',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类表';

-- 4. 文章表
CREATE TABLE IF NOT EXISTS `articles` (
  `id` VARCHAR(36) NOT NULL COMMENT '文章ID',
  `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
  `summary` VARCHAR(500) DEFAULT NULL COMMENT '文章摘要',
  `cover_url` VARCHAR(500) DEFAULT NULL COMMENT '封面图片URL',
  `category_id` VARCHAR(36) NOT NULL COMMENT '所属分类',
  `author_id` VARCHAR(36) NOT NULL COMMENT '作者ID',
  `author_name` VARCHAR(50) DEFAULT NULL COMMENT '作者名称（冗余）',
  `author_avatar` VARCHAR(500) DEFAULT NULL COMMENT '作者头像URL（冗余）',
  `tags` VARCHAR(200) DEFAULT NULL COMMENT '标签（逗号分隔）',
  `views` INT NOT NULL DEFAULT 0 COMMENT '阅读量',
  `likes` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  `comments_count` INT NOT NULL DEFAULT 0 COMMENT '评论数',
  `is_top` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否置顶（特色文章）',
  `read_time` INT DEFAULT NULL COMMENT '预计阅读时间（分钟）',
  `published_at` BIGINT NOT NULL COMMENT '发布时间（时间戳）',
  `is_published` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否发布',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_is_top` (`is_top`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_is_published` (`is_published`),
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 5. 文章内容块表
CREATE TABLE IF NOT EXISTS `article_content_blocks` (
  `id` VARCHAR(36) NOT NULL COMMENT '内容块ID',
  `article_id` VARCHAR(36) NOT NULL COMMENT '所属文章',
  `block_type` VARCHAR(20) NOT NULL COMMENT '内容块类型：text/image/quote/code/heading',
  `content` TEXT NOT NULL COMMENT '内容（HTML或Markdown）',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_sort_order` (`article_id`, `sort_order`),
  FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章内容块表（一对多关系）';

-- 6. 文章点赞表
CREATE TABLE IF NOT EXISTS `article_likes` (
  `id` VARCHAR(36) NOT NULL COMMENT '记录ID',
  `article_id` VARCHAR(36) NOT NULL COMMENT '文章ID',
  `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
  `created_at` BIGINT NOT NULL COMMENT '点赞时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_user` (`article_id`, `user_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章点赞表（用户-文章多对多关系）';

-- 7. 热门搜索关键词表
CREATE TABLE IF NOT EXISTS `hot_search_keywords` (
  `id` VARCHAR(36) NOT NULL COMMENT '关键词ID',
  `keyword` VARCHAR(50) NOT NULL COMMENT '关键词',
  `hot_score` INT NOT NULL DEFAULT 0 COMMENT '热度分数（用于排序）',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `created_at` BIGINT NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_hot_score` (`hot_score`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='热门搜索关键词表';
```

---

## 外键约束对照表

| 子表 | 外键字段 | 父表 | 删除行为 | 说明 |
|------|----------|------|----------|------|
| `refresh_tokens` | `user_id` | `users` | CASCADE | 用户删除时同时删除令牌 |
| `articles` | `category_id` | `categories` | RESTRICT | 分类下有文章时不允许删除分类 |
| `articles` | `author_id` | `users` | RESTRICT | 用户有文章时不允许删除用户 |
| `article_content_blocks` | `article_id` | `articles` | CASCADE | 文章删除时同时删除内容块 |
| `article_likes` | `article_id` | `articles` | CASCADE | 文章删除时同时删除点赞记录 |
| `article_likes` | `user_id` | `users` | CASCADE | 用户删除时同时删除点赞记录 |

---

## 索引设计汇总

| 表名 | 索引 | 类型 | 用途 |
|------|------|------|------|
| `users` | `uk_username` | 唯一索引 | 保证用户名唯一 |
| `users` | `idx_is_active` | 普通索引 | 快速筛选启用的用户 |
| `refresh_tokens` | `uk_refresh_token` | 唯一索引 | 快速校验令牌 |
| `refresh_tokens` | `idx_user_id` | 普通索引 | 查询用户的所有令牌 |
| `categories` | `idx_is_active` | 普通索引 | 快速筛选启用的分类 |
| `articles` | `idx_category_id` | 普通索引 | 按分类筛选文章 |
| `articles` | `idx_author_id` | 普通索引 | 查询作者的文章列表 |
| `articles` | `idx_is_top` | 普通索引 | 查询置顶特色文章 |
| `articles` | `idx_published_at` | 普通索引 | 按发布时间排序 |
| `article_content_blocks` | `idx_article_id` | 普通索引 | 查询文章的所有内容块 |
| `article_content_blocks` | `idx_sort_order` | 复合索引 | 按顺序获取内容块 |
| `article_likes` | `uk_article_user` | 唯一复合索引 | 防止同一用户重复点赞 |
| `article_likes` | `idx_user_id` | 普通索引 | 查询用户点赞过的文章 |
| `hot_search_keywords` | `idx_hot_score` | 普通索引 | 按热度排序获取热门关键词 |

---

## 统计信息

- **总表数**: 7 张
- **总索引数**: 20 个（含主键）
- **外键约束**: 6 个
- **字符集**: `utf8mb4` 支持完整 Unicode（包括 emoji）
- **存储引擎**: `InnoDB` 支持事务和外键
