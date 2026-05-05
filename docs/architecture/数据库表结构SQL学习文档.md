# 数据库表结构 SQL 学习文档

> 本文档汇总了整个项目的所有数据库表结构，配合 30 天学习计划的 ER 图阶段使用。
> 学习建议：先看 SQL → 再看设计思想 → 手敲一遍 → 关掉文档默写 → 对比差异

---

## 📊 数据库表总览

整个项目一共 7 张核心表：

| 表名                   | 所属领域 | 主要用途                 |
| ---------------------- | -------- | ------------------------ |
| users                  | 用户认证 | 用户账号、密码、基本信息 |
| refresh_tokens         | 用户认证 | 刷新 Token 存储          |
| categories             | 文章领域 | 文章分类                 |
| articles               | 文章领域 | 文章基本信息             |
| article_content_blocks | 文章领域 | 文章内容块               |
| article_likes          | 文章领域 | 文章点赞记录             |
| hot_search_keywords    | 搜索领域 | 热搜关键词               |

---

## 📝 表结构详细说明

---

### 1. users 表（用户表）

#### SQL 建表语句

```sql
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL COMMENT '用户ID（UUID）',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希值',
  `password_algorithm` VARCHAR(20) DEFAULT NULL COMMENT '密码加密算法（argon2id / bcrypt）',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '是否启用',
  `created_at` BIGINT NOT NULL COMMENT '创建时间戳',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间戳',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

#### 设计思想 & 灵魂拷问

| 设计点                               | 为什么这么做？                                                          |
| ------------------------------------ | ----------------------------------------------------------------------- |
| **主键用 UUID 不用自增ID**           | 1. 分布式环境下不会冲突<br>2. 不会暴露用户数量<br>3. 爬虫无法按 ID 遍历 |
| **只存 password_hash，不存明文密码** | ✅ 安全第一，就算数据库泄露也不会泄露用户密码                           |
| **password_algorithm 字段**          | ✅ 支持算法平滑升级，旧用户用 bcrypt，新用户用 argon2id，登录后静默迁移 |
| **is_active 布尔字段加索引**         | 后台列表页经常要"只看启用用户"，加索引查询更快                          |

**灵魂拷问：**

1. 如果用户量到了 1000 万，这张表哪些字段会成为瓶颈？怎么优化？
2. 主键用 UUID 有什么缺点？有没有更好的方案？（提示：雪花ID）
3. 密码字段为什么用 VARCHAR(255)？Argon2id 哈希出来有多长？

---

### 2. refresh_tokens 表（刷新令牌表）

#### SQL 建表语句

```sql
CREATE TABLE `refresh_tokens` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
  `refresh_token` VARCHAR(500) NOT NULL COMMENT '刷新令牌',
  `client_ip` VARCHAR(50) NOT NULL COMMENT '客户端IP',
  `expires_at` BIGINT NOT NULL COMMENT '过期时间戳',
  `revoked` TINYINT(1) DEFAULT 0 COMMENT '是否已撤销',
  `created_at` BIGINT NOT NULL COMMENT '创建时间戳',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_refresh_token` (`refresh_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='刷新令牌表';
```

#### 设计思想 & 灵魂拷问

| 设计点                          | 为什么这么做？                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **独立成表，不放在 users 表里** | ✅ 一个用户可以有多个 Token（多设备登录）<br>✅ Token 可以独立撤销、独立过期<br>✅ 删除用户级联删除所有 Token |
| **client_ip 字段**              | ✅ 安全审计：可以看到用户在哪登录的<br>✅ 异常检测：同一个账号在多个国家登录，可能被盗了                      |
| **revoked 字段支持手动撤销**    | ✅ 用户改密码后，所有旧 Token 立即失效                                                                        |
| **expires_at 加索引**           | ✅ 定时清理过期 Token 的时候，可以快速定位                                                                    |

**灵魂拷问：**

1. 为什么 refresh_token 要存在 MySQL + Redis 双写？只存一个不行吗？
2. 一个用户同时登录了 5 个设备，这张表里会有几条记录？
3. 如果有人恶意刷登录接口，这张表会不会爆？怎么限流？
4. ON DELETE CASCADE 是什么意思？有什么优缺点？

---

### 3. categories 表（文章分类表）

#### SQL 建表语句

```sql
CREATE TABLE `categories` (
  `id` VARCHAR(36) NOT NULL COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '分类描述',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '分类封面图',
  `article_count` INT DEFAULT 0 COMMENT '文章数量（冗余统计）',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '是否启用',
  `created_at` BIGINT NOT NULL COMMENT '创建时间戳',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间戳',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章分类表';
```

#### 设计思想 & 灵魂拷问

| 设计点                     | 为什么这么做？                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------ |
| **article_count 冗余字段** | ✅ 列表页显示"分类下有多少篇文章"<br>✅ 不用每次都 COUNT()，COUNT 100 万条数据会卡爆 |

**灵魂拷问：**

1. article_count 字段什么时候更新？会不会不准？不准了怎么办？
2. 如果分类只有 10 条数据，这个冗余字段还有必要吗？
3. sort_order 为什么不用自增？如果两个分类排序值一样怎么办？

---

### 4. articles 表（文章表）

#### SQL 建表语句

```sql
CREATE TABLE `articles` (
  `id` VARCHAR(36) NOT NULL COMMENT '文章ID',
  `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
  `summary` VARCHAR(500) DEFAULT NULL COMMENT '文章摘要',
  `cover_url` VARCHAR(500) DEFAULT NULL COMMENT '封面图URL',
  `category_id` VARCHAR(36) NOT NULL COMMENT '分类ID',
  `author_id` VARCHAR(36) NOT NULL COMMENT '作者ID',
  `author_name` VARCHAR(50) DEFAULT NULL COMMENT '作者名称（冗余）',
  `author_avatar` VARCHAR(500) DEFAULT NULL COMMENT '作者头像（冗余）',
  `tags` VARCHAR(200) DEFAULT NULL COMMENT '标签，逗号分隔',
  `views` INT DEFAULT 0 COMMENT '浏览量',
  `likes` INT DEFAULT 0 COMMENT '点赞数',
  `comments_count` INT DEFAULT 0 COMMENT '评论数',
  `is_top` TINYINT(1) DEFAULT 0 COMMENT '是否置顶',
  `read_time` INT DEFAULT NULL COMMENT '阅读时间（分钟）',
  `published_at` BIGINT NOT NULL COMMENT '发布时间戳',
  `is_published` TINYINT(1) DEFAULT 1 COMMENT '是否已发布',
  `created_at` BIGINT NOT NULL COMMENT '创建时间戳',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间戳',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_is_published` (`is_published`),
  KEY `idx_is_top` (`is_top`),
  KEY `idx_published_at` (`published_at`),
  CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE RESTRICT,
  CONSTRAINT `articles_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';
```

#### 设计思想 & 灵魂拷问

| 设计点                                        | 为什么这么做？                                                               |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| **author_name、author_avatar 冗余字段**       | ✅ 文章列表页直接显示，不用 JOIN users 表查询<br>✅ 列表页性能提升 10 倍以上 |
| **views、likes、comments_count 三个计数字段** | ✅ 列表页直接显示，不用 COUNT<br>✅ 热点数据用缓存 + 异步落库                |
| **is_top 和 is_published 两个布尔字段**       | ✅ 灵活组合：置顶+已发布 / 置顶+草稿 / 普通+已发布 / 普通+草稿               |

**灵魂拷问：**

1. 用户改了昵称怎么办？所有文章的 author_name 都要更新吗？
2. 文章列表页 1 秒 1000 次浏览，views 字段直接 UPDATE 会不会有锁竞争？怎么优化？
3. 5 个索引会不会太多？写入的时候会不会慢？
4. tags 为什么用 VARCHAR 逗号分隔？不用中间表？（提示：读多写少场景）

---

### 5. article_content_blocks 表（文章内容块表）

#### SQL 建表语句

```sql
CREATE TABLE `article_content_blocks` (
  `id` VARCHAR(36) NOT NULL COMMENT '内容块ID',
  `article_id` VARCHAR(36) NOT NULL COMMENT '文章ID',
  `block_type` VARCHAR(20) NOT NULL COMMENT '内容块类型（text/image/code/quote）',
  `content` TEXT NOT NULL COMMENT '内容',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `created_at` BIGINT NOT NULL COMMENT '创建时间戳',
  `updated_at` BIGINT NOT NULL COMMENT '更新时间戳',
  PRIMARY KEY (`id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_sort_order` (`article_id`, `sort_order`),
  CONSTRAINT `article_content_blocks_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章内容块表';
```

#### 设计思想 & 灵魂拷问

| 设计点                                           | 为什么这么做？                                                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **内容不用 TEXT 字段存在 articles 表，独立成表** | ✅ 文章内容很大，列表页查 articles 表不查内容，性能飙升<br>✅ 内容可以分块编辑、分块渲染<br>✅ TEXT 类型不占行缓存，不影响其他字段查询速度 |
| **content 用 TEXT 类型**                         | ✅ VARCHAR 最大 65535 字节，长文章不够用                                                                                                   |
| **复合索引 (article_id, sort_order)**            | ✅ 查询文章内容时，按 sort_order 排序返回<br>✅ 不用 filesort，直接走索引排序                                                              |

**灵魂拷问：**

1. 如果一篇文章有 50 个内容块，查一次要回 50 行数据，会不会慢？
2. 复合索引为什么是 (article_id, sort_order)，不是 (sort_order, article_id)？
3. 内容字段支持 Markdown 吗？如果要存图片怎么办？
4. 为什么 ON DELETE CASCADE？删文章要连带删除所有内容块吗？

---

### 6. article_likes 表（文章点赞表）

#### SQL 建表语句

```sql
CREATE TABLE `article_likes` (
  `id` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `article_id` VARCHAR(36) NOT NULL COMMENT '文章ID',
  `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
  `created_at` BIGINT NOT NULL COMMENT '点赞时间戳',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_user` (`article_id`, `user_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `article_likes_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `article_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章点赞表';
```

#### 设计思想 & 灵魂拷问

| 设计点                                     | 为什么这么做？                                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **唯一索引 uk_article_user**               | ✅ 防止重复点赞：同一个用户对同一篇文章只能点一次赞<br>✅ 不用先查再插，数据库层面保证唯一性 |
| **没有 is_liked 字段，取消点赞直接删记录** | ✅ 简单，省空间<br>✅ 存在 = 已点赞，不存在 = 未点赞                                         |

**灵魂拷问：**

1. 如果要做"点赞历史记录"，还能直接删记录吗？
2. 1 秒 1 万次点赞，这张表扛得住吗？怎么优化？（提示：Redis 计数 + 异步落库）
3. 查"我有没有点赞过这篇文章"，怎么查最快？
4. 唯一索引顺序为什么是 (article_id, user_id)，不是反过来？

---

### 7. hot_search_keywords 表（热搜关键词表）

#### SQL 建表语句

```sql
CREATE TABLE `hot_search_keywords` (
  `id` VARCHAR(36) NOT NULL COMMENT '关键词ID',
  `keyword` VARCHAR(50) NOT NULL COMMENT '关键词',
  `hot_score` INT DEFAULT 0 COMMENT '热度分数',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '是否启用',
  `sort_order` INT DEFAULT 0 COMMENT '排序权重',
  `created_at` BIGINT NOT NULL COMMENT '创建时间戳',
  PRIMARY KEY (`id`),
  KEY `idx_hot_score` (`hot_score`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='热搜关键词表';
```

#### 设计思想 & 灵魂拷问

| 设计点                   | 为什么这么做？                                                       |
| ------------------------ | -------------------------------------------------------------------- |
| **hot_score 字段存热度** | ✅ 定时计算每个关键词的搜索次数、趋势衰减<br>✅ 按分数排序就是热搜榜 |
| **3 个独立索引**         | ✅ 按热度排序、按是否启用过滤、按自定义排序                          |

**灵魂拷问：**

1. 热搜实时更新的话，这张表的 UPDATE 会不会成为瓶颈？
2. 热搜的热度算法怎么设计？（提示：时间衰减 + 点击量加权）
3. 这张表读多还是写多？适合放缓存吗？

---

## 📚 索引设计总结

| 表名                   | 索引名称         | 索引字段               | 类型     | 用途               |
| ---------------------- | ---------------- | ---------------------- | -------- | ------------------ |
| users                  | uk_username      | username               | 唯一索引 | 登录时按用户名查询 |
| users                  | idx_is_active    | is_active              | 普通索引 | 过滤已禁用用户     |
| refresh_tokens         | uk_refresh_token | refresh_token          | 唯一索引 | Token 验证         |
| refresh_tokens         | idx_user_id      | user_id                | 普通索引 | 查用户的所有 Token |
| refresh_tokens         | idx_expires_at   | expires_at             | 普通索引 | 清理过期 Token     |
| articles               | idx_category_id  | category_id            | 普通索引 | 按分类查文章       |
| articles               | idx_author_id    | author_id              | 普通索引 | 查用户的所有文章   |
| articles               | idx_is_published | is_published           | 普通索引 | 过滤已发布         |
| articles               | idx_published_at | published_at           | 普通索引 | 按发布时间排序     |
| article_content_blocks | idx_sort_order   | article_id, sort_order | 复合索引 | 查询文章内容并排序 |
| article_likes          | uk_article_user  | article_id, user_id    | 唯一索引 | 防重复点赞         |
| article_likes          | idx_user_id      | user_id                | 普通索引 | 查用户点赞列表     |

---

## 🎯 学习建议（配合 30 天计划第 1-7 天）

### 第 1-2 天：手敲 + 理解

1. 把上面 7 张表的 SQL 亲手敲一遍，不要复制粘贴
2. 敲每一行的时候，停下来想：这个字段为什么要这么定义？
3. 敲完之后，关掉文档，凭理解重新写一遍

### 第 3-5 天：索引专项学习

1. 把所有索引都单独列出来
2. 每个索引问自己：这个索引是给哪个 SQL 建的？
3. 试着写几个查询，用 EXPLAIN 看看走不走索引

### 第 6-7 天：发散思考

1. 如果用户量到了 1000 万，哪张表会先爆？怎么分库分表？
2. 如果要加一个评论功能，表结构怎么设计？
3. 如果要加一个收藏功能，表结构怎么设计？

---

## 💡 终极灵魂拷问

**学完这 7 张表，问自己 3 个问题：**

1. 哪些设计是"为了性能牺牲一致性"？
2. 哪些设计是"为了省空间牺牲查询速度"？
3. 哪些设计是"为了开发简单牺牲了扩展性"？

**想清楚这 3 个问题，你对"数据库设计"的理解就超过 80% 的后端开发了。** 🚀
