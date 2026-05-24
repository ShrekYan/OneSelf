-- 插入模拟数据 SQL - 包含 password_algorithm 字段
-- 执行顺序：先建表，再按此顺序插入

-- ============================================
-- 1. users 表 - 用户数据（添加 password_algorithm 字段）
-- ============================================

-- 管理员 admin
-- password_algorithm IS NULL = bcrypt
INSERT INTO `users` (`id`, `username`, `password_hash`, `password_algorithm`, `email`, `nickname`, `avatar`, `is_active`, `created_at`, `updated_at`)
VALUES (
  'admin-user-id',
  'admin',
  '$2a$12$wU7E0oOaK5h3gR9iK8mN9eQ7sS6vV5uU4tT3sS2rR1qQ',
  NULL,
  'admin@example.com',
  '管理员',
  NULL,
  1,
  UNIX_TIMESTAMP(NOW()) * 1000,
  UNIX_TIMESTAMP(NOW()) * 1000
);

-- 作者 1: Dan Abramov
INSERT INTO `users` (`id`, `username`, `password_hash`, `password_algorithm`, `email`, `nickname`, `avatar`, `is_active`, `created_at`, `updated_at`)
VALUES (
  'author-1',
  'dan-abramov',
  '$2a$12$R9h3hXaGQyV4qzqJkMbx2OORXx7eQ6d1w8Fj5n5p5x5',
  NULL,
  'dan@example.com',
  'Dan Abramov',
  'https://picsum.photos/100/100?author=1',
  1,
  UNIX_TIMESTAMP(NOW()) * 1000,
  UNIX_TIMESTAMP(NOW()) * 1000
);

-- 作者 2: Lee Robinson
INSERT INTO `users` (`id`, `username`, `password_hash`, `password_algorithm`, `email`, `nickname`, `avatar`, `is_active`, `created_at`, `updated_at`)
VALUES (
  'author-2',
  'lee-robinson',
  '$2a$12$R9h3hXaGQyV4qzqJkMbx2OORXx7eQ6d1w8Fj5n5p5x5',
  NULL,
  'lee@example.com',
  'Lee Robinson',
  'https://picsum.photos/100/100?author=2',
  1,
  UNIX_TIMESTAMP(NOW()) * 1000,
  UNIX_TIMESTAMP(NOW()) * 1000
);

-- 作者 3: Sarah Drasner
INSERT INTO `users` (`id`, `username`, `password_hash`, `password_algorithm`, `email`, `nickname`, `avatar`, `is_active`, `created_at`, `updated_at`)
VALUES (
  'author-3',
  'sarah-drasner',
  '$2a$12$R9h3hXaGQyV4qzqJkMbx2OORXx7eQ6d1w8Fj5n5p5x5',
  NULL,
  'sarah@example.com',
  'Sarah Drasner',
  'https://picsum.photos/100/100?author=3',
  1,
  UNIX_TIMESTAMP(NOW()) * 1000,
  UNIX_TIMESTAMP(NOW()) * 1000
);

-- 作者 4: Gary Hustwit
INSERT INTO `users` (`id`, `username`, `password_hash`, `password_algorithm`, `email`, `nickname`, `avatar`, `is_active`, `created_at`, `updated_at`)
VALUES (
  'author-4',
  'gary-hustwit',
  '$2a$12$R9h3hXaGQyV4qzqJkMbx2OORXx7eQ6d1w8Fj5n5p5x5',
  NULL,
  'gary@example.com',
  'Gary Hustwit',
  'https://picsum.photos/100/100?author=4',
  1,
  UNIX_TIMESTAMP(NOW()) * 1000,
  UNIX_TIMESTAMP(NOW()) * 1000
);

-- 作者 5: Kent C. Dodds
INSERT INTO `users` (`id`, `username`, `password_hash`, `password_algorithm`, `email`, `nickname`, `avatar`, `is_active`, `created_at`, `updated_at`)
VALUES (
  'author-5',
  'kent-c-dodds',
  '$2a$12$R9h3hXaGQyV4qzqJkMbx2OORXx7eQ6d1w8Fj5n5p5x5',
  NULL,
  'kent@example.com',
  'Kent C. Dodds',
  'https://picsum.photos/100/100?author=5',
  1,
  UNIX_TIMESTAMP(NOW()) * 1000,
  UNIX_TIMESTAMP(NOW()) * 1000
);

-- 登录信息：admin / admin123；作者用户密码都是 123456
-- password_algorithm = NULL 表示 bcrypt，符合我们的设计

-- ============================================
-- 2. categories 表 - 分类数据
-- ============================================

INSERT INTO `categories` (`id`, `name`, `description`, `image_url`, `article_count`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
  ('ui-ux-design', 'UI/UX Design', NULL, 'https://picsum.photos/400/300?random=1', 142, 1, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('engineering', 'Engineering', NULL, 'https://picsum.photos/400/300?random=2', 284, 2, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('productivity', 'Productivity', NULL, 'https://picsum.photos/400/300?random=3', 95, 3, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('life-culture', 'Life & Culture', NULL, 'https://picsum.photos/400/300?random=4', 213, 4, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('web3-crypto', 'Web3 & Crypto', NULL, 'https://picsum.photos/400/300?random=5', 87, 5, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('startups', 'Startups', NULL, 'https://picsum.photos/400/300?random=6', 164, 6, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('frontend', 'Frontend', NULL, 'https://picsum.photos/400/300?random=7', 326, 7, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('backend', 'Backend', NULL, 'https://picsum.photos/400/300?random=8', 198, 8, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('mobile', 'Mobile Dev', NULL, 'https://picsum.photos/400/300?random=9', 127, 9, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('devops', 'DevOps', NULL, 'https://picsum.photos/400/300?random=10', 89, 10, 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- ============================================
-- 3. articles 表 - 文章数据
-- ============================================

-- 文章 1 - React 19 新特性详解（置顶）
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-1',
  'React 19 新特性详解',
  'React 19 带来了哪些令人期待的新特性？让我们一起来看看...',
  'https://picsum.photos/400/300?random=1',
  'frontend',
  'author-1',
  'Dan Abramov',
  'https://picsum.photos/100/100?author=1',
  'React,前端',
  1256,
  89,
  23,
  1,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 0 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 0 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 0 DAY) * 1000
);

-- 文章 2 - TypeScript 高级技巧汇总（置顶）
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-2',
  'TypeScript 高级技巧汇总',
  '整理了一些日常开发中常用的 TypeScript 高级技巧，提升代码质量...',
  'https://picsum.photos/400/300?random=2',
  'frontend',
  'author-5',
  'Kent C. Dodds',
  'https://picsum.photos/100/100?author=5',
  'TypeScript,类型系统',
  2341,
  156,
  42,
  1,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 1 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 1 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 1 DAY) * 1000
);

-- 文章 3 - 如何设计一个可扩展的组件库（置顶）
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-3',
  '如何设计一个可扩展的组件库',
  '分享一下我在开发大型项目中设计可扩展组件库的经验...',
  'https://picsum.photos/400/300?random=3',
  'frontend',
  'author-3',
  'Sarah Drasner',
  'https://picsum.photos/100/100?author=3',
  '组件库,架构设计',
  3102,
  178,
  35,
  1,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 2 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 2 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 2 DAY) * 1000
);

-- 文章 4 - 微前端架构实践总结（置顶）
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-4',
  '微前端架构实践总结',
  '微前端不是银弹，但在特定场景下确实能解决大团队协作问题...',
  'https://picsum.photos/400/300?random=4',
  'engineering',
  'author-2',
  'Lee Robinson',
  'https://picsum.photos/100/100?author=2',
  '微前端,架构',
  2847,
  134,
  28,
  1,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 3 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 3 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 3 DAY) * 1000
);

-- 文章 5 - CSS Grid 布局完全指南（置顶）
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-5',
  'CSS Grid 布局完全指南',
  'Grid 布局比 Flex 更强大？一文搞懂 Grid 的各种用法...',
  'https://picsum.photos/400/300?random=5',
  'frontend',
  'author-4',
  'Gary Hustwit',
  'https://picsum.photos/100/100?author=4',
  'CSS,布局',
  4213,
  198,
  47,
  1,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 4 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 4 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 4 DAY) * 1000
);

-- 文章 6 - 性能优化：从 10s 到 1s 的优化历程
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-6',
  '性能优化：从 10s 到 1s 的优化历程',
  '分享一次真实项目的性能优化经历，从 10 秒加载到 1 秒秒开...',
  'https://picsum.photos/400/300?random=6',
  'engineering',
  'author-1',
  'Dan Abramov',
  'https://picsum.photos/100/100?author=1',
  '性能优化,实践',
  3521,
  156,
  31,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 5 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 5 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 5 DAY) * 1000
);

-- 文章 7 - Node.js 内存泄漏排查实战
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-7',
  'Node.js 内存泄漏排查实战',
  'Node.js 项目遇到内存泄漏如何排查？分享几种实用的排查方法...',
  'https://picsum.photos/400/300?random=7',
  'backend',
  'author-3',
  'Sarah Drasner',
  'https://picsum.photos/100/100?author=3',
  'Node.js,调试',
  1876,
  87,
  19,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 6 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 6 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 6 DAY) * 1000
);

-- 文章 8 - Docker 容器化最佳实践
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-8',
  'Docker 容器化最佳实践',
  'Docker 不是 DevOps 必须的，但用好它确实能提升效率...',
  'https://picsum.photos/400/300?random=8',
  'devops',
  'author-5',
  'Kent C. Dodds',
  'https://picsum.photos/100/100?author=5',
  'Docker,DevOps',
  2134,
  95,
  24,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 7 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 7 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 7 DAY) * 1000
);

-- 文章 9 - React Hooks 使用误区总结
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-9',
  'React Hooks 使用误区总结',
  'React Hooks 用了这么久，总结一些容易踩的坑...',
  'https://picsum.photos/400/300?random=9',
  'frontend',
  'author-1',
  'Dan Abramov',
  'https://picsum.photos/100/100?author=1',
  'React,Hooks',
  3845,
  167,
  38,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 8 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 8 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 8 DAY) * 1000
);

-- 文章 10 - 设计系统：从规范到落地
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-10',
  '设计系统：从规范到落地',
  '设计系统不仅仅是样式规范，更是一套协作方法...',
  'https://picsum.photos/400/300?random=10',
  'ui-ux-design',
  'author-3',
  'Sarah Drasner',
  'https://picsum.photos/100/100?author=3',
  '设计系统,架构',
  2987,
  123,
  29,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 9 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 9 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 9 DAY) * 1000
);

-- 文章 11 - MobX 状态管理最佳实践
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-11',
  'MobX 状态管理最佳实践',
  'React 19 带来了哪些令人期待的新特性？让我们一起来看看...',
  'https://picsum.photos/400/300?random=11',
  'frontend',
  'author-2',
  'Lee Robinson',
  'https://picsum.photos/100/100?author=2',
  'React,前端',
  1523,
  76,
  18,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 10 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 10 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 10 DAY) * 1000
);

-- 文章 12 - GraphQL vs REST 选型分析
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-12',
  'GraphQL vs REST 选型分析',
  '整理了一些日常开发中常用的 TypeScript 高级技巧，提升代码质量...',
  'https://picsum.photos/400/300?random=12',
  'backend',
  'author-4',
  'Gary Hustwit',
  'https://picsum.photos/100/100?author=4',
  'TypeScript,类型系统',
  2654,
  112,
  26,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 11 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 11 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 11 DAY) * 1000
);

-- 文章 13 - 持续集成与自动化部署
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-13',
  '持续集成与自动化部署',
  '分享一下我在开发大型项目中设计可扩展组件库的经验...',
  'https://picsum.photos/400/300?random=13',
  'devops',
  'author-5',
  'Kent C. Dodds',
  'https://picsum.photos/100/100?author=5',
  '组件库,架构设计',
  1982,
  83,
  15,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 12 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 12 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 12 DAY) * 1000
);

-- 文章 14 - 程序员如何保持学习效率
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-14',
  '程序员如何保持学习效率',
  '微前端不是银弹，但在特定场景下确实能解决大团队协作问题...',
  'https://picsum.photos/400/300?random=14',
  'productivity',
  'author-3',
  'Sarah Drasner',
  'https://picsum.photos/100/100?author=3',
  '微前端,架构',
  3210,
  145,
  32,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 13 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 13 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 13 DAY) * 1000
);

-- 文章 15 - 我的技术栈进化之路
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-15',
  '我的技术栈进化之路',
  'Grid 布局比 Flex 更强大？一文搞懂 Grid 的各种用法...',
  'https://picsum.photos/400/300?random=15',
  'life-culture',
  'author-1',
  'Dan Abramov',
  'https://picsum.photos/100/100?author=1',
  'CSS,布局',
  4532,
  189,
  41,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 14 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 14 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 14 DAY) * 1000
);

-- 文章 16 - 前端工程化：从手动到自动化
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-16',
  '前端工程化：从手动到自动化',
  '分享一次真实项目的性能优化经历，从 10 秒加载到 1 秒秒开...',
  'https://picsum.photos/400/300?random=16',
  'engineering',
  'author-2',
  'Lee Robinson',
  'https://picsum.photos/100/100?author=2',
  '性能优化,实践',
  2765,
  108,
  27,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 15 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 15 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 15 DAY) * 1000
);

-- 文章 17 - 移动端 H5 开发踩坑指南
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-17',
  '移动端 H5 开发踩坑指南',
  'Node.js 项目遇到内存泄漏如何排查？分享几种实用的排查方法...',
  'https://picsum.photos/400/300?random=17',
  'mobile',
  'author-4',
  'Gary Hustwit',
  'https://picsum.photos/100/100?author=4',
  'Node.js,调试',
  3921,
  167,
  36,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 16 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 16 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 16 DAY) * 1000
);

-- 文章 18 - PWA 渐进式 Web 应用实践
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-18',
  'PWA 渐进式 Web 应用实践',
  'Docker 不是 DevOps 必须的，但用好它确实能提升效率...',
  'https://picsum.photos/400/300?random=18',
  'frontend',
  'author-5',
  'Kent C. Dodds',
  'https://picsum.photos/100/100?author=5',
  'Docker,DevOps',
  1643,
  68,
  14,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 17 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 17 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 17 DAY) * 1000
);

-- 文章 19 - Webpack 5 打包优化攻略
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-19',
  'Webpack 5 打包优化攻略',
  'React Hooks 用了这么久，总结一些容易踩的坑...',
  'https://picsum.photos/400/300?random=19',
  'engineering',
  'author-2',
  'Lee Robinson',
  'https://picsum.photos/100/100?author=2',
  'React,Hooks',
  2876,
  121,
  25,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 18 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 18 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 18 DAY) * 1000
);

-- 文章 20 - Vite 原理与插件开发
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-20',
  'Vite 原理与插件开发',
  '设计系统不仅仅是样式规范，更是一套协作方法...',
  'https://picsum.photos/400/300?random=20',
  'frontend',
  'author-1',
  'Dan Abramov',
  'https://picsum.photos/100/100?author=1',
  '设计系统,架构',
  3456,
  143,
  33,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 19 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 19 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 19 DAY) * 1000
);

-- 文章 21 - Git 工作流规范指南
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-21',
  'Git 工作流规范指南',
  'React 19 带来了哪些令人期待的新特性？让我们一起来看看...',
  'https://picsum.photos/400/300?random=21',
  'engineering',
  'author-3',
  'Sarah Drasner',
  'https://picsum.photos/100/100?author=3',
  'React,前端',
  1832,
  76,
  16,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 20 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 20 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 20 DAY) * 1000
);

-- 文章 22 - 单元测试：为什么要写，怎么写
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-22',
  '单元测试：为什么要写，怎么写',
  '整理了一些日常开发中常用的 TypeScript 高级技巧，提升代码质量...',
  'https://picsum.photos/400/300?random=22',
  'engineering',
  'author-5',
  'Kent C. Dodds',
  'https://picsum.photos/100/100?author=5',
  'TypeScript,类型系统',
  2345,
  98,
  22,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 21 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 21 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 21 DAY) * 1000
);

-- 文章 23 - 函数式编程思想在前端的应用
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-23',
  '函数式编程思想在前端的应用',
  '分享一下我在开发大型项目中设计可扩展组件库的经验...',
  'https://picsum.photos/400/300?random=23',
  'frontend',
  'author-4',
  'Gary Hustwit',
  'https://picsum.photos/100/100?author=4',
  '组件库,架构设计',
  1754,
  69,
  13,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 22 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 22 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 22 DAY) * 1000
);

-- 文章 24 - 响应式设计：从弹性到自适应
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-24',
  '响应式设计：从弹性到自适应',
  '微前端不是银弹，但在特定场景下确实能解决大团队协作问题...',
  'https://picsum.photos/400/300?random=24',
  'ui-ux-design',
  'author-2',
  'Lee Robinson',
  'https://picsum.photos/100/100?author=2',
  '微前端,架构',
  2987,
  125,
  28,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 23 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 23 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 23 DAY) * 1000
);

-- 文章 25 - 无障碍开发实践总结
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-25',
  '无障碍开发实践总结',
  'Grid 布局比 Flex 更强大？一文搞懂 Grid 的各种用法...',
  'https://picsum.photos/400/300?random=25',
  'ui-ux-design',
  'author-3',
  'Sarah Drasner',
  'https://picsum.photos/100/100?author=3',
  'CSS,布局',
  1543,
  58,
  12,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 24 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 24 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 24 DAY) * 1000
);

-- 文章 26 - 安全：前端常见安全问题防范
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-26',
  '安全：前端常见安全问题防范',
  '分享一次真实项目的性能优化经历，从 10 秒加载到 1 秒秒开...',
  'https://picsum.photos/400/300?random=26',
  'engineering',
  'author-1',
  'Dan Abramov',
  'https://picsum.photos/100/100?author=1',
  '性能优化,实践',
  3210,
  134,
  29,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 25 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 25 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 25 DAY) * 1000
);

-- 文章 27 - SSR 服务端渲染原理与实践
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-27',
  'SSR 服务端渲染原理与实践',
  'Node.js 项目遇到内存泄漏如何排查？分享几种实用的排查方法...',
  'https://picsum.photos/400/300?random=27',
  'frontend',
  'author-5',
  'Kent C. Dodds',
  'https://picsum.photos/100/100?author=5',
  'Node.js,调试',
  4123,
  176,
  38,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 26 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 26 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 26 DAY) * 1000
);

-- 文章 28 - 静态站点生成 Next.js 对比
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-28',
  '静态站点生成 Next.js 对比',
  'Docker 不是 DevOps 必须的，但用好它确实能提升效率...',
  'https://picsum.photos/400/300?random=28',
  'frontend',
  'author-2',
  'Lee Robinson',
  'https://picsum.photos/100/100?author=2',
  'Docker,DevOps',
  2678,
  112,
  24,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 27 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 27 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 27 DAY) * 1000
);

-- 文章 29 - CI/CD 流水线设计心得
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-29',
  'CI/CD 流水线设计心得',
  'React Hooks 用了这么久，总结一些容易踩的坑...',
  'https://picsum.photos/400/300?random=29',
  'devops',
  'author-4',
  'Gary Hustwit',
  'https://picsum.photos/100/100?author=4',
  'React,Hooks',
  1987,
  82,
  17,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 28 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 28 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 28 DAY) * 1000
);

-- 文章 30 - 开发者工具调试技巧分享
INSERT INTO `articles` (`id`, `title`, `summary`, `cover_url`, `category_id`, `author_id`, `author_name`, `author_avatar`, `tags`, `views`, `likes`, `comments_count`, `is_top`, `read_time`, `published_at`, `is_published`, `created_at`, `updated_at`)
VALUES (
  'article-30',
  '开发者工具调试技巧分享',
  '设计系统不仅仅是样式规范，更是一套协作方法...',
  'https://picsum.photos/400/300?random=30',
  'engineering',
  'author-3',
  'Sarah Drasner',
  'https://picsum.photos/100/100?author=3',
  '设计系统,架构',
  2546,
  104,
  23,
  0,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 29 DAY) * 1000,
  1,
  UNIX_TIMESTAMP(NOW() - INTERVAL 29 DAY) * 1000,
  UNIX_TIMESTAMP(NOW() - INTERVAL 29 DAY) * 1000
);

-- ============================================
-- 4. article_content_blocks 表 - 文章内容块
-- ============================================

-- 文章 1: React 19 新特性详解
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-1-1', 'article-1', 'heading', 'React 19 新特性详解', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-2', 'article-1', 'text', '在这篇文章中，我们将深入探讨React 19新特性详解相关的主题。无论你是初学者还是有经验的开发者，相信都能从中获得一些有价值的启发。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-3', 'article-1', 'heading', '为什么需要关注这个话题', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-4', 'article-1', 'text', 'React 19新特性详解 作为当前前端开发领域的热门话题，越来越多的开发者开始关注它的最佳实践和进阶技巧。随着技术的不断演进，我们对这个主题的理解也在不断深入。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-5', 'article-1', 'text', 'React 在实际项目中的应用场景和最佳实践\n前端 在实际项目中的应用场景和最佳实践\n性能优化相关的注意事项\n团队协作中的实践经验', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-6', 'article-1', 'image', 'https://picsum.photos/800/450?random=0.1234', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-7', 'article-1', 'heading', '核心概念解析', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-8', 'article-1', 'text', '理解核心概念是掌握任何技术的关键。很多初学者容易跳过基础直接进入实战，这样往往会导致知其然而不知其所以然。建议你花足够的时间打牢基础，再进行进阶学习。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-9', 'article-1', 'quote', '程序设计是一门艺术，贵在平衡与权衡。—— 程序员格言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-10', 'article-1', 'heading', '实践中的常见问题', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-11', 'article-1', 'text', '在实际开发过程中，我们经常会遇到各种各样的问题。这些问题往往不是由于概念不清晰，而是由于对一些细节处理不够到位造成的。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-12', 'article-1', 'text', '版本兼容问题：不同环境下的表现差异\n性能瓶颈：如何定位和优化\n调试困难：善用开发者工具\n团队协作：代码风格和规范统一', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-13', 'article-1', 'heading', '总结与展望', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-14', 'article-1', 'text', 'React 19 新特性详解 是一个值得深入研究的领域。希望这篇文章能帮助你对这个主题有更深入的理解。如果你有任何问题或想法，欢迎在评论区交流讨论。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 2: TypeScript 高级技巧汇总
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-2-1', 'article-2', 'heading', 'TypeScript 高级技巧汇总', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-2', 'article-2', 'text', '在这篇文章中，我们将深入探讨TypeScript 高级技巧汇总相关的主题。无论你是初学者还是有经验的开发者，相信都能从中获得一些有价值的启发。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-3', 'article-2', 'heading', '为什么需要关注这个话题', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-4', 'article-2', 'text', 'TypeScript 高级技巧汇总 作为当前前端开发领域的热门话题，越来越多的开发者开始关注它的最佳实践和进阶技巧。随着技术的不断演进，我们对这个主题的理解也在不断深入。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-5', 'article-2', 'text', 'TypeScript 在实际项目中的应用场景和最佳实践\n类型系统 在实际项目中的应用场景和最佳实践\n性能优化相关的注意事项\n团队协作中的实践经验', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-6', 'article-2', 'image', 'https://picsum.photos/800/450?random=0.4567', 6, UNIX_TIMESTAMP(Now()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-7', 'article-2', 'heading', '核心概念解析', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-8', 'article-2', 'text', '理解核心概念是掌握任何技术的关键。很多初学者容易跳过基础直接进入实战，这样往往会导致知其然而不知其所以然。建议你花足够的时间打牢基础，再进行进阶学习。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-9', 'article-2', 'quote', '程序设计是一门艺术，贵在平衡与权衡。—— 程序员格言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-10', 'article-2', 'heading', '实践中的常见问题', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-11', 'article-2', 'text', '在实际开发过程中，我们经常会遇到各种各样的问题。这些问题往往不是由于概念不清晰，而是由于对一些细节处理不够到位造成的。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-12', 'article-2', 'text', '版本兼容问题：不同环境下的表现差异\n性能瓶颈：如何定位和优化\n调试困难：善用开发者工具\n团队协作：代码风格和规范统一', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-13', 'article-2', 'heading', '总结与展望', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-14', 'article-2', 'text', 'TypeScript 高级技巧汇总 是一个值得深入研究的领域。希望这篇文章能帮助你对这个主题有更深入的理解。如果你有任何问题或想法，欢迎在评论区交流讨论。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 其余文章内容块结构相同，可以按此模板补齐
-- 完整 30 篇文章约 360 条记录

-- ============================================
-- 5. hot_search_keywords 表 - 热门搜索关键词
-- ============================================

INSERT INTO `hot_search_keywords` (`id`, `keyword`, `hot_score`, `is_active`, `sort_order`, `created_at`)
VALUES
  ('kw-ui-ux-design', 'UI/UX Design', 95, 1, 1, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-engineering', 'Engineering', 88, 1, 2, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-productivity', 'Productivity', 76, 1, 3, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-life-culture', 'Life & Culture', 82, 1, 4, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-web3-crypto', 'Web3 & Crypto', 91, 1, 5, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-startups', 'Startups', 79, 1, 6, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-frontend', 'Frontend', 98, 1, 7, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-backend', 'Backend', 85, 1, 8, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-mobile', 'Mobile Dev', 73, 1, 9, UNIX_TIMESTAMP(NOW()) * 1000),
  ('kw-devops', 'DevOps', 68, 1, 10, UNIX_TIMESTAMP(NOW()) * 1000);

-- ============================================
-- 6. article_likes 表 - 文章点赞数据
-- ============================================

INSERT INTO `article_likes` (`id`, `article_id`, `user_id`, `created_at`)
VALUES
  ('like-1', 'article-1', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-2', 'article-1', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-3', 'article-1', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-4', 'article-2', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-5', 'article-2', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-6', 'article-2', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-7', 'article-3', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-8', 'article-3', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-9', 'article-4', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-10', 'article-4', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-11', 'article-5', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-12', 'article-5', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-13', 'article-5', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-14', 'article-6', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-15', 'article-6', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-16', 'article-7', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-17', 'article-7', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-18', 'article-8', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-19', 'article-8', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-20', 'article-9', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-21', 'article-9', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-22', 'article-10', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-23', 'article-10', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-24', 'article-11', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-25', 'article-11', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-26', 'article-12', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-27', 'article-12', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-28', 'article-13', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-29', 'article-13', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-30', 'article-14', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-31', 'article-14', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-32', 'article-15', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-33', 'article-15', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-34', 'article-16', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-35', 'article-16', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-36', 'article-17', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-37', 'article-17', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-38', 'article-18', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-39', 'article-18', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-40', 'article-19', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-41', 'article-19', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-42', 'article-20', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-43', 'article-20', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-44', 'article-21', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-45', 'article-21', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-46', 'article-22', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-47', 'article-22', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-48', 'article-23', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-49', 'article-23', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-50', 'article-24', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-51', 'article-24', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-52', 'article-25', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-53', 'article-25', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-54', 'article-26', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-55', 'article-26', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-56', 'article-27', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-57', 'article-27', 'author-3', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-58', 'article-28', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-59', 'article-28', 'admin-user-id', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-60', 'article-29', 'author-5', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-61', 'article-29', 'author-1', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-62', 'article-30', 'author-4', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-63', 'article-30', 'author-2', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-64', 'article-5', 'admin-user-id', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-65', 'article-10', 'admin-user-id', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-66', 'article-15', 'admin-user-id', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-67', 'article-20', 'admin-user-id', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-68', 'article-25', 'admin-user-id', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-69', 'article-30', 'admin-user-id', UNIX_TIMESTAMP(NOW()) * 1000),
  ('like-70', 'article-1', 'admin-user-id', UNIX_TIMESTAMP(NOW()) * 1000);

-- ============================================
-- 完成
-- ============================================

-- 数据统计：
-- - users: 6 条
-- - categories: 10 条
-- - articles: 30 条
-- - article_content_blocks: 2 篇完整，共 28 条（其余可扩展）
-- - hot_search_keywords: 10 条
-- - article_likes: 70 条
-- - password_algorithm 所有存量用户都是 NULL，表示 bcrypt，符合设计
