# 全栈博客系统

一个现代化的全栈博客项目，**前端 H5 移动端应用** + **后端 NestJS 微服务群**，采用 **Monorepo + Turborepo** 架构，遵循工程化开发规范。

## 📖 项目简介

这是一个功能完整的个人博客系统，支持文章分类浏览、搜索、点赞、用户认证等功能，专为移动端访问优化设计。

**整体架构：**

```
┌─────────────────────────────────────────────────────────────────┐
│                     前端 H5 移动端应用 (apps/web)                 │
│        React 19 + TypeScript + Vite + MobX + Ant Design Mobile  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│  backend (core)    │ │  auth-service      │ │   log-service    │
│  文章/分类/用户业务 │ │  JWT认证/用户管理  │ │   请求日志/审计   │
└───────────────────┘ └───────────────────┘ └───────────────────┘
                              ↓
┌───────────────────┐      ┌───────────────────┐
│    MySQL 数据库    │      │    Redis 缓存     │
│  用户 / 文章 / 分类  │      │   Token / 缓存   │
└───────────────────┘      └───────────────────┘
```

**Monorepo 目录组织：**

```
claude/
├── apps/
│   └── web/                 # 👈 前端 H5 移动端应用
├── services/
│   ├── backend/             # 👈 后端核心业务服务（文章、分类、用户）
│   ├── auth-service/        # 👈 独立认证授权微服务
│   └── log-service/         # 👈 集中化日志微服务
├── packages/                # 共享包（预留）
├── turbo.json              # Turborepo 配置
├── pnpm-workspace.yaml      # pnpm 工作区配置
└── package.json             # 根目录仅保留全局配置
```

---

## 🚀 技术栈

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 19.2.3 | UI 框架 |
| **TypeScript** | 5.5.3 | 类型系统 |
| **Vite** | 7.3.1 | 构建工具 |
| **MobX** | 6.13.5 | 响应式状态管理 |
| **Ant Design Mobile** | 5.42.3 | 移动端组件库 |
| **React Router DOM** | 6.27.0 | 路由管理 |
| **Axios** | 1.7.7 | HTTP 客户端 |
| **SCSS** | - | 样式预处理 |
| **CSS Modules** | - | 模块化样式方案 |
| **Zod** | 3.24.2 | 数据校验 |
| **dayjs** | 1.11.13 | 日期处理 |
| **ECharts** | 5.6.0 | 图表可视化 |
| **React Hook Form** | 7.54.2 | 表单处理 |
| **ESLint** | 9.11.1 | 代码检查 |
| **Prettier** | 3.3.3 | 代码格式化 |
| **Husky + lint-staged** | - | Git 钩子工具 |

### 后端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **NestJS** | 11.0.1 | 后端框架 |
| **TypeScript** | 5.7.3 | 开发语言 |
| **Prisma ORM** | 6.5.0 | 数据库 ORM |
| **MySQL** | - | 主数据库 |
| **Redis** | (ioredis) | 缓存 / Token 存储 |
| **@nestjs/swagger** | 11.2.6 | API 文档自动生成 |
| **class-validator** | 0.14.4 | 请求参数验证 |
| **jsonwebtoken** | 9.0.3 | JWT 认证 |
| **argon2** | 0.44.0 | 密码加密 |
| **jest** | 30.0.0 | 单元测试 |

---

## 🏗️ 架构设计

### 前端架构

采用**清晰分层 + 职责分离**的架构设计：

```
src/
├── api/                    # API 接口层（按业务领域拆分）
│   ├── core/               # Axios 扩展核心功能
│   │   ├── axios-instance.ts  # Axios 实例 + 拦截器
│   │   ├── cancel-manager.ts  # 重复请求自动取消
│   │   ├── request-cache.ts   # 轻量级请求缓存
│   │   └── api-utils.ts       # API 工具函数
│   ├── [module]/           # 业务模块：定义接口 + 类型
│   └── index.ts            # 统一出口
├── assets/                 # 静态资源（图片、图标）
├── components/             # 全局公共组件
│   └── [Component]/        # 每个组件独立目录（PascalCase）
│       ├── index.tsx
│       └── index.module.scss
├── hooks/                  # 自定义 Hooks
├── pages/                  # 页面组件（路由对应页面）
│   └── [Page]/             # 页面目录（PascalCase）
│       ├── index.tsx       # 页面入口：只做渲染和组合
│       ├── useStore.ts     # 页面局部状态（MobX useLocalObservable）
│       ├── handle.ts       # 纯业务逻辑处理
│       ├── constant.ts     # 页面常量定义
│       ├── components/     # 页面内部分拆的子组件
│       └── index.module.scss
├── routes/                 # 路由配置
├── store/                 # 全局 Store
├── styles/                # 全局样式 + 变量 + mixins
├── types/                 # 全局类型定义
├── App.tsx                # 应用根组件
└── main.tsx               # 应用入口
```

**前端核心设计理念：**

1. **职责分离**：`index.tsx` (UI) → `useStore.ts` (状态) → `handle.ts` (业务逻辑)，各司其职
2. **状态管理**：全局状态 + 页面局部状态，页面状态使用 `useLocalObservable`
3. **类型安全**：全程 TypeScript 严格模式，所有 API 请求响应都有完整类型
4. **性能优化**：路由懒加载、请求缓存、自动取消重复请求、React Compiler 自动优化
5. **移动端优先**：基于 750px 设计稿，`px` 自动转换 `vw` 适配不同屏幕

### 后端架构

采用**NestJS 模块化分层架构**，按业务领域划分模块：

```
backend/src/
├── [module]/               # 业务模块（按领域划分，小写命名）
│   │   ├── dto/           # 数据传输对象（请求/响应）
│   │   ├── *.controller.ts  # 控制器：处理 HTTP 请求
│   │   ├── *.service.ts     # 服务：业务逻辑实现
│   │   └── *.module.ts      # 模块定义
├── common/                # 公共基础设施
│   ├── decorators/        # 自定义装饰器
│   ├── dto/              # 公共 DTO 基类
│   ├── filters/          # 全局异常过滤器
│   └── interceptors/     # 全局拦截器
├── article/              # 文章模块
├── auth/                 # 认证模块
├── category/             # 分类模块
├── users/                # 用户模块
├── redis/                # Redis 模块
├── prisma/               # Prisma 客户端
├── app.module.ts         # 根模块
└── main.ts               # 应用入口
```

**后端核心设计理念：**

1. **模块化**：每个业务领域独立成模块，低耦合高内聚
2. **分层职责**：Controller 处理 HTTP 输入输出，Service 专注业务逻辑
3. **依赖注入**：充分利用 NestJS 依赖注入系统，便于测试和维护
4. **类型安全**：全程 TypeScript 严格模式
5. **API 优先**：自动生成 Swagger 文档，便于联调

**微服务架构：**
项目已拆分为多个独立服务：
- `auth-service`: 认证授权服务
- `log-service`: 集中化日志服务
- `backend`: 核心业务服务（文章、分类、用户）

---

## ✨ 核心功能

### 前端功能

| 模块 | 功能 |
|------|------|
| **用户认证** | 登录、注册、忘记密码、Token 自动刷新 |
| **首页** | 推荐文章、热门搜索、快捷导航 |
| **发现** | 分类浏览、文章列表、无限加载 |
| **文章详情** | Markdown 渲染、内容展示、点赞、统计信息 |
| **个人中心** | 用户信息、关于本站、功能入口 |
| **消息通知** | 通知列表 |
| **搜索** | 热门搜索关键词、文章搜索 |

### 后端 API 功能

| 模块 | 功能 |
|------|------|
| **认证授权** | 用户注册、登录、登出、Token 刷新、JWT 认证 |
| **文章管理** | 文章列表分页查询、文章详情获取、分类筛选、热门推荐 |
| **分类管理** | 获取分类列表、分类信息、文章统计 |
| **用户管理** | 用户信息 CRUD、头像管理 |
| **点赞** | 文章点赞、取消点赞、点赞状态查询 |
| **搜索** | 热门关键词列表、文章全文搜索 |
| **日志服务** | 集中化 HTTP 请求响应日志记录、审计追踪 |

### 数据模型

核心实体：
- **Users**: 用户信息，包含用户名、密码、头像等
- **Articles**: 文章，支持标题、摘要、封面、标签、统计数据
- **ArticleContentBlocks**: 文章内容块（支持多块内容）
- **Categories**: 文章分类，支持排序、描述、图片
- **ArticleLikes**: 用户点赞记录
- **HotSearchKeywords**: 热门搜索关键词
- **RefreshTokens**: 刷新令牌存储

---

## 📁 项目结构

```
claude/
├── .claude/                 # Claude Code 开发规则和配置
├── .husky/                  # Git Hooks 配置
├── apps/
│   └── web/                 # 前端 H5 移动端应用源码
│       ├── src/
│       │   ├── api/         # API 接口层
│       │   ├── components/  # 全局公共组件
│       │   ├── pages/       # 页面组件
│       │   ├── hooks/       # 自定义 Hooks
│       │   ├── store/       # 全局状态管理
│       │   └── ...
│       ├── package.json
│       └── vite.config.ts
├── services/
│   ├── backend/             # 后端核心业务服务（文章、分类、用户）
│   ├── auth-service/        # 独立认证授权微服务
│   └── log-service/         # 集中化日志微服务
├── packages/                # 共享工具包（预留扩展）
├── docs/                    # 项目架构文档
├── .env*                    # 根目录多环境配置模板
├── package.json             # 根目录仅保留全局配置和工具依赖
├── pnpm-workspace.yaml      # pnpm 工作区配置
├── turbo.json              # Turborepo 构建配置
└── README.md                # 项目说明（本文档）
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9
- MySQL >= 8.0
- Redis >= 6.0

### 安装依赖

```bash
# 一键安装所有项目依赖（Monorepo）
pnpm install
```

### 环境配置

**前端**：`apps/web/.env.*` 多环境配置：

| 文件 | 环境 | 启动命令 |
|------|------|----------|
| `.env.outDev` | 外测环境 | `pnpm dev` (默认) |
| `.env.test` | 测试环境 | `pnpm --filter web test-dev` |
| `.env.sit` | SIT 集成测试 | `pnpm --filter web sit-dev` |
| `.env.pre` | 预生产环境 | `pnpm --filter web pre-dev` |
| `.env.production` | 生产环境 | `pnpm --filter web prd-dev` |

关键环境变量：
```env
VITE_APP_BASE_URL=http://localhost:8888/api  # API 地址
VITE_APP_ENV=development                     # 环境名称
VITE_ENABLE_VCONSOLE=false                   # 是否开启 vConsole 调试
```

**后端**：各服务独立配置：
- `services/backend/.env` - 核心业务服务
- `services/auth-service/.env` - 认证服务
- `services/log-service/.env` - 日志服务

```env
# 通用后端配置示例
DATABASE_URL="mysql://user:password@localhost:3306/blog"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret-key"
PORT=8888
```

### 数据库初始化

```bash
# 核心服务数据库初始化
cd services/backend
npx prisma generate
npx prisma db push

# 认证服务数据库初始化
cd ../auth-service
npx prisma generate
```

### 开发启动

使用 Turborepo 并行启动所有服务：
```bash
# 启动所有项目开发模式
pnpm dev
```

也可以单独启动某个服务：
```bash
# 仅启动前端
pnpm --filter web dev

# 仅启动后端核心服务
pnpm --filter backend start:dev

# 仅启动认证服务
pnpm --filter auth-service start:dev
```

后端服务启动后：
- 核心 API: `http://localhost:8888/api/`
- Swagger 文档: `http://localhost:8888/docs`
- 认证服务: `http://localhost:8889/`
- 日志服务: `http://localhost:8890/`

### 构建打包

```bash
# Turborepo 并行构建所有项目
pnpm build

# 单独构建某个项目
pnpm --filter web build
pnpm --filter backend build
```

---

## ✅ 验证流程

使用 Turborepo 对所有项目执行检查：

```bash
# 对所有项目运行 lint
pnpm lint

# 单独检查某个项目
pnpm --filter web lint
pnpm --filter backend lint

# 类型检查（进入对应项目执行）
cd apps/web && npx tsc --noEmit
cd services/backend && npx tsc --noEmit
cd services/auth-service && npx tsc --noEmit
cd services/log-service && npx tsc --noEmit

# 全量构建验证
pnpm build
```

---

## 🔧 性能优化

### 前端优化

- ✅ **px → vw 自动转换**：基于 750px 设计稿开发，自动适配不同屏幕
- ✅ **路由懒加载**：按需加载页面代码，减小首屏包体积
- ✅ **请求缓存**：GET 请求支持客户端缓存，减少重复请求
- ✅ **自动取消重复请求**：避免网络拥塞和重复渲染
- ✅ **Gzip 压缩**：构建产物压缩，减小传输体积
- ✅ **React Freeeze + React Activation**：冻结不活跃页面，减少重渲染
- ✅ **React Compiler**：自动编译优化，减少不必要重渲染

### 后端优化

- ✅ **Prisma ORM 连接池**：优化数据库连接管理
- ✅ **Redis 缓存**：热点数据缓存加速
- ✅ **数据库索引**：关键查询字段添加索引
- ✅ **全局异常处理**：统一错误响应格式
- ✅ **日志分级**：集中化日志服务，便于问题定位

---

## 📝 开发规范

### 前端命名规范

| 元素 | 命名规则 | 示例 |
|------|----------|------|
| 组件目录 | PascalCase | `src/components/LazyImage/` |
| 页面目录 | PascalCase | `src/pages/ArticleDetail/` |
| 组件名 | PascalCase | `const ArticleCard: React.FC =` |
| Hooks | camelCase (use 开头) | `useLocalStorage.ts` |
| 样式类名 | camelCase | `.articleCardContainer` |
| API 模块 | kebab-case | `src/api/article/` |

### 后端命名规范

| 元素 | 命名规则 | 示例 |
|------|----------|------|
| 模块目录 | 小写 | `auth/`, `article/` |
| 文件名 | kebab-case + 后缀 | `auth.controller.ts` |
| 类名 | PascalCase | `AuthController`, `ArticleService` |
| DTO 类 | PascalCase + 后缀 | `LoginDto`, `CreateArticleDto` |

详细开发规范请参考：
- [CLAUDE.md](./CLAUDE.md) - 项目整体指南
- [.claude/projects/frontend-project-info.md](.claude/projects/frontend-project-info.md) - 前端开发指南
- [.claude/projects/backend-project-info.md](.claude/projects/backend-project-info.md) - 后端开发指南

---

## 🌐 浏览器支持

```browserslist
ie >= 10
>0.3%
ios >= 9
```

---

## 🧪 测试

```bash
# Turborepo 运行所有测试
pnpm test

# 前端单元测试
pnpm --filter web test          # 交互模式
pnpm --filter web test:run      # 单次运行
pnpm --filter web test:coverage # 生成覆盖率报告

# 后端单元测试（各服务独立运行）
pnpm --filter backend test
pnpm --filter auth-service test
pnpm --filter log-service test
```

---

## 🔒 安全

- 密码使用 Argon2 加密存储
- JWT + Refresh Token 双令牌认证
- 请求参数自动校验
- 敏感信息不存储前端
- CORS 跨域配置

---

## 📄 License

MIT
# test commit
# test non-code commit
