# Claude Blog - AI 驱动的全栈博客系统

> **核心特色**：本项目 100% 代码通过 **Claude Code** AI 工具生成，基于 `.claude` 工程化配置体系，遵循严格的开发规范。

---

## 📖 项目简介

这是一个现代化的全栈博客系统，采用 **Monorepo + Turborepo** 单体仓库多系统架构，包含：

- **前端 H5 移动端应用**（React 19 + MobX）
- **后端微服务群**（NestJS 11 + 多服务拆分）
- **跨系统共享包**（TypeScript 纯技术库）

专为移动端访问优化设计，支持文章分类浏览、搜索、点赞、用户认证等完整功能。

---

## 🏗️ 整体架构

```
                              ┌─────────────────────────────────────────────┐
                              │              Claude Code AI                │
                              │    代码生成 · 规范约束 · Agent 调度        │
                              │    .claude/ 配置驱动整个开发流程           │
                              └─────────────────────────────────────────────┘
                                                    ↓
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           Monorepo 单体仓库 (Turborepo)                           │
├──────────────────────────┬──────────────────────────┬───────────────────────────┤
│      前端应用层          │      后端微服务层         │       共享包层             │
│                          │                          │                           │
│  ┌────────────────┐     │  ┌────────────────┐      │  ┌────────────────┐       │
│  │ apps/web       │     │  │ backend        │      │  │ shared-logging │       │
│  │ React 19 移动端│     │  │ 核心业务服务    │ ←──→ │  统一日志SDK     │       │
│  └────────────────┘     │  └────────────────┘      │  └────────────────┘       │
│           ↓             │           ↓              │                           │
│                          │  ┌────────────────┐      │                           │
│                          │  │ auth-service   │      │                           │
│                          │  │ 认证授权服务    │      │                           │
│                          │  └────────────────┘      │                           │
│                          │           ↓              │                           │
│                          │  ┌────────────────┐      │                           │
│                          │  │ log-service    │      │                           │
│                          │  │ 日志审计服务    │      │                           │
│                          │  └────────────────┘      │                           │
└──────────────────────────┴──────────────────────────┴───────────────────────────┘
```

### 服务职责矩阵

| 系统 | 目录 | 职责范围 | 技术栈 |
|------|------|---------|--------|
| **web** | `apps/web/` | 用户端 H5 应用，页面渲染、交互逻辑、状态管理 | React 19 + MobX + Ant Design Mobile |
| **backend** | `services/backend/` | 核心业务：文章 CRUD、分类、用户管理 | NestJS 11 + Prisma ORM |
| **auth-service** | `services/auth-service/` | 认证领域：登录、注册、权限校验、Token 管理 | NestJS 11 + JWT + Argon2 |
| **log-service** | `services/log-service/` | 日志领域：操作记录、审计追踪、行为数据采集 | NestJS 11 |
| **shared-logging** | `packages/shared-logging/` | 共享组件：统一日志格式、日志上报 SDK | TypeScript |

---

## 🚀 核心技术栈

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 19.2.3 | UI 框架 |
| **TypeScript** | 5.5.3 | 类型系统（严格模式） |
| **Vite** | 7.3.1 | 构建工具 |
| **MobX** | 6.13.5 | 响应式状态管理 |
| **Ant Design Mobile** | 5.42.3 | 移动端组件库 |
| **React Router DOM** | 6.27.0 | 路由管理 |
| **Axios** | 1.7.7 | HTTP 客户端 |
| **SCSS + CSS Modules** | - | 模块化样式方案 |
| **React Compiler** | - | 自动编译优化重渲染 |

### 后端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **NestJS** | 11.0.1 | 后端框架 |
| **TypeScript** | 5.7.3 | 开发语言 |
| **Prisma ORM** | 6.4.1 | 数据库 ORM |
| **MySQL** | 8.0+ | 主数据库 |
| **Redis** | 6.0+ | 缓存 / Token 存储 |
| **@nestjs/swagger** | 11.2.6 | API 文档自动生成 |
| **class-validator** | 0.14.4 | 请求参数验证 |
| **jsonwebtoken** | 9.0.3 | JWT 认证 |
| **argon2** | 0.44.0 | 密码加密 |

### 工程化工具

| 工具 | 版本 | 说明 |
|------|------|------|
| **Turborepo** | 2.4.2 | Monorepo 构建优化 |
| **ESLint** | 9.x | 代码质量检查 |
| **Prettier** | 3.3.3 | 代码格式化 |
| **Husky + lint-staged** | - | Git Hooks 提交前检查 |
| **Claude Code** | Latest | AI 驱动开发工具 |

---

## 📁 项目目录结构

```
claude/
├── .claude/                 # ✨ Claude Code 核心配置（AI 开发驱动）
│   ├── agents/              # 专属 Agent 定义（前端/后端/审查/测试等）
│   ├── skills/              # 技能定义（按技术栈分组 + 规则）
│   ├── rules/               # 通用开发规范（TS/安全/格式/组件）
│   ├── commands/            # 快捷命令定义
│   ├── workflows/           # 自动化工作流配置
│   ├── projects/            # 前后端项目信息
│   ├── settings.json        # Claude Code 全局配置
│   └── project-memory.md    # 项目踩坑记忆库
│
├── apps/
│   └── web/                 # 前端 H5 移动端应用
│       ├── src/
│       │   ├── api/         # API 接口层（按业务拆分 + Axios 增强）
│       │   ├── components/  # 全局公共组件（独立目录 + CSS Modules）
│       │   ├── pages/       # 页面组件（5 文件拆分规范）
│       │   ├── hooks/       # 自定义 Hooks
│       │   ├── store/       # 全局状态管理
│       │   ├── routes/      # 路由配置
│       │   └── styles/      # 全局样式变量
│       ├── .env.*           # 多环境配置
│       └── vite.config.ts
│
├── services/
│   ├── backend/             # 后端核心业务服务
│   │   ├── src/
│   │   │   ├── [module]/    # 按领域拆分模块
│   │   │   ├── common/      # 公共基础设施（拦截器/过滤器/装饰器）
│   │   │   ├── prisma/      # Prisma 客户端
│   │   │   └── redis/       # Redis 模块
│   │   └── prisma/          # Schema 定义 + 迁移
│   │
│   ├── auth-service/        # 独立认证授权微服务
│   └── log-service/         # 集中化日志微服务
│
├── packages/
│   └── shared-logging/      # 跨系统共享日志 SDK
│
├── docs/                     # 教学文档与架构说明（40+ 篇）
│   ├── *.md                 # 功能开发教学指南
│   ├── ai-save/             # AI 协同结果保存
│   └── security/            # 安全专题
│
├── CLAUDE.md                # 项目开发总指南（Agent 自动加载）
├── package.json             # 全局 Monorepo 配置
├── turbo.json              # Turborepo 任务管道
└── README.md                # 本文档
```

---

## 🤖 Claude Code AI 开发模式

### 核心理念

本项目采用 **AI 驱动开发 (AI-Driven Development)**，所有代码通过 Claude Code 生成，严格遵循 `.claude/` 配置的工程规范。

### Agent 智能调度系统

内置 **15+ 专属 Agent**，根据开发场景自动调度：

| Agent 类型 | 触发场景 | 能力 |
|-----------|---------|------|
| **frontend-developer** | 开发前端页面、组件、API | 遵循 H5 移动端 5 文件拆分规范 |
| **backend-architect** | 开发后端 Controller、Service、Module | NestJS 模块化架构设计 |
| **frontend-code-reviewer** | 前端代码审查 | TypeScript 类型安全 + React 最佳实践 |
| **nestjs-code-review** | 后端代码审查 | 架构分层 + DTO 验证 + 命名规范 |
| **frontend-performance-expert** | 性能问题分析优化 | 移动端 H5 性能专项优化 |
| **nestjs-performance-audit** | 后端性能审计 | Prisma N+1 问题 + 索引优化 |
| **frontend-test-writer** | 前端单元测试 | Vitest + React Testing Library |
| **nestjs-test-writer** | 后端单元测试 | Jest + NestJS 测试规范 |
| **frontend-security-auditor** | 前端安全扫描 | XSS、注入、敏感信息泄露 |
| **nestjs-security-audit** | 后端安全审计 | OWASP Top 10 风险检测 |
| **full-frontend-review-orchestrator** | 全量前端审查 | 依次执行质量→安全→性能三维检查 |
| **debug-assistant** | 错误日志分析 | Bug 模式匹配 + 复现步骤生成 |
| **search-expert** | 代码搜索 | 按功能/组件/调用链搜索 |
| **git-helper** | Git 操作 | 提交信息生成 + 分支管理 + PR 描述生成 |

### 工程化规范体系

```
.claude/rules/
├── typescript-common.md      # TypeScript 通用规范（严格模式、any 限制）
├── security-common.md        # 安全通用规范（HttpOnly Cookie、密码加密）
├── code-format-common.md     # 代码格式通用规范（缩进、引号、导入排序）
├── project-behavior.md       # 全局行为规范（代码复用、影响范围确认）
└── frontend-components.md    # 公共组件开发规范
```

### 项目记忆系统

踩坑经验自动沉淀到 `.claude/project-memory.md`，避免重复踩坑：

- MobX `useLocalObservable` 箭头函数 this 绑定问题
- Prisma 模型 PascalCase 命名规范
- Claude Code include 机制嵌套引用限制
- ... 更多实战经验积累

---

## ✨ 核心功能

### 前端功能

| 模块 | 功能特性 |
|------|---------|
| **用户认证** | 登录、注册、Token 自动刷新、401 防循环 |
| **首页** | 推荐文章、热门搜索关键词、快捷导航 |
| **发现** | 分类浏览、文章列表无限加载、分类筛选 |
| **文章详情** | Markdown 内容渲染、点赞功能、统计信息展示 |
| **个人中心** | 用户信息展示、关于本站、功能入口聚合 |
| **消息通知** | 通知列表、消息状态管理 |
| **搜索** | 热门搜索、文章搜索、搜索历史 |

### 后端 API 功能

| 模块 | 功能特性 |
|------|---------|
| **认证授权** | 用户注册、登录、登出、Token 刷新、JWT 认证、权限校验 |
| **文章管理** | 文章列表分页查询、详情获取、分类筛选、热门推荐 |
| **分类管理** | 获取分类列表、分类信息、分类文章统计 |
| **用户管理** | 用户信息 CRUD、头像管理、个人资料维护 |
| **点赞系统** | 文章点赞、取消点赞、点赞状态实时查询 |
| **搜索服务** | 热门关键词列表、文章全文搜索 |
| **日志服务** | 集中化 HTTP 请求响应日志记录、审计追踪 |

### 数据模型

核心实体关系：

```
Users ──< Articles ──< ArticleContentBlocks
  │         │
  │         └──< ArticleLikes
  │
  └──< RefreshTokens

Categories ──< Articles

HotSearchKeywords
```

---

## 🛠️ 快速开始

### 环境要求

| 依赖 | 版本要求 |
|------|---------|
| Node.js | >= 20 |
| npm | >= 10.9 |
| MySQL | >= 8.0 |
| Redis | >= 6.0 |

### 安装依赖

```bash
# 一键安装所有项目依赖（Monorepo）
npm install
```

### 环境配置

#### 前端多环境配置

前端支持 5 套环境配置，位于 `apps/web/.env.*`：

| 环境 | 配置文件 | 启动命令 |
|------|---------|----------|
| 外测环境（默认） | `.env.outDev` | `npm run dev` |
| 测试环境 | `.env.test` | `npm run test-dev` |
| SIT 集成测试 | `.env.sit` | `npm run sit-dev` |
| 预生产环境 | `.env.pre` | `npm run pre-dev` |
| 生产环境 | `.env.production` | `npm run prd-dev` |

关键环境变量示例：

```env
VITE_APP_BASE_URL=http://localhost:8888/api
VITE_APP_ENV=development
VITE_ENABLE_VCONSOLE=false
```

#### 后端服务配置

每个后端服务独立配置：

| 服务 | 配置文件路径 | 默认端口 |
|------|------------|---------|
| backend | `services/backend/.env` | 8888 |
| auth-service | `services/auth-service/.env` | 8889 |
| log-service | `services/log-service/.env` | 8890 |

通用后端配置示例：

```env
DATABASE_URL="mysql://user:password@localhost:3306/blog"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret-key"
PORT=8888
```

### 数据库初始化

```bash
# 核心业务服务数据库初始化
cd services/backend
npx prisma generate
npx prisma db push

# 认证服务数据库初始化
cd ../auth-service
npx prisma generate
```

### 开发启动

#### 方式一：并行启动所有服务（推荐）

```bash
# 使用 Turborepo 并行启动前端 + 所有后端服务
npm run dev
```

#### 方式二：单独启动某个服务

```bash
# 仅启动前端
cd apps/web && npm run dev

# 仅启动后端核心服务
cd services/backend && npm run start:dev

# 仅启动认证服务
cd services/auth-service && npm run start:dev

# 仅启动日志服务
cd services/log-service && npm run start:dev
```

### 访问地址

启动成功后：

| 服务 | 访问地址 |
|------|---------|
| 前端 H5 应用 | `http://localhost:5173/` |
| 后端核心 API | `http://localhost:8888/api/` |
| Swagger API 文档 | `http://localhost:8888/docs` |
| 认证服务 | `http://localhost:8889/` |
| 日志服务 | `http://localhost:8890/` |

---

## 🧪 代码检查与构建

### 代码质量检查

```bash
# Turborepo 并行检查所有项目
npm run lint

# 单独检查某个项目
cd apps/web && npm run lint
cd services/backend && npm run lint

# TypeScript 类型检查（进入对应项目执行）
cd apps/web && npx tsc --noEmit
cd services/backend && npx tsc --noEmit
```

### 项目构建

```bash
# Turborepo 并行构建所有项目（带缓存优化）
npm run build

# 单独构建某个项目
cd apps/web && npm run build
cd services/backend && npm run build
```

### 单元测试

```bash
# Turborepo 运行所有测试
npm test

# 前端单元测试
cd apps/web && npm test

# 后端单元测试（各服务独立运行）
cd services/backend && npm test
cd services/auth-service && npm test
```

---

## ⚡ 性能优化特性

### 前端优化

| 优化项 | 说明 |
|--------|------|
| **px → vw 自动转换** | 基于 750px 设计稿开发，自动适配不同屏幕尺寸 |
| **路由懒加载** | 按需加载页面代码，减小首屏包体积 |
| **请求缓存** | GET 请求支持客户端缓存，减少重复请求 |
| **自动取消重复请求** | 避免网络拥塞和重复渲染 |
| **Gzip 压缩** | 构建产物压缩，减小传输体积 |
| **React Freeeze + React Activation** | 冻结不活跃页面，减少重渲染 |
| **React Compiler** | 自动编译优化，减少不必要重渲染 |

### 后端优化

| 优化项 | 说明 |
|--------|------|
| **Prisma ORM 连接池** | 优化数据库连接管理，提升并发性能 |
| **Redis 缓存** | 热点数据缓存加速，减少数据库压力 |
| **数据库索引** | 关键查询字段添加索引，查询性能提升 |
| **全局异常处理** | 统一错误响应格式，便于前端处理 |
| **日志分级** | 集中化日志服务，便于问题定位和分析 |

---

## 🔒 安全特性

| 安全项 | 实现细节 |
|--------|---------|
| **密码加密** | 使用 Argon2 算法加密存储，抗 GPU 攻击 |
| **双令牌认证** | JWT Access Token + Refresh Token，支持无感刷新 |
| **HttpOnly Cookie** | Token 存储在 HttpOnly Cookie，防止 XSS 窃取 |
| **SameSite 严格模式** | 防止 CSRF 攻击 |
| **请求参数校验** | class-validator 自动校验所有入参 |
| **敏感信息保护** | 敏感信息不存储前端，错误信息不泄露内部细节 |
| **CORS 配置** | 精细的跨域访问控制 |
| **开放重定向防护** | 登录跳转白名单校验，防止钓鱼攻击 |

---

## 📚 开发规范摘要

### 前端命名规范

| 元素 | 命名规则 | 示例 |
|------|----------|------|
| 组件目录 | PascalCase | `src/components/LazyImage/` |
| 页面目录 | PascalCase | `src/pages/ArticleDetail/` |
| 组件名 | PascalCase | `const ArticleCard: React.FC =` |
| Hooks | camelCase (use 开头) | `useLocalStorage.ts` |
| 样式类名 | camelCase | `.articleCardContainer` |
| API 模块 | kebab-case | `src/api/article/` |

### 页面 5 文件拆分规范

每个页面必须拆分为独立文件，职责分离：

```
ArticleDetail/
├── index.tsx           # 页面入口：只做渲染和组合，无业务逻辑
├── useStore.ts         # 页面局部状态：MobX useLocalObservable
├── handle.ts           # 纯业务逻辑处理：无 React Hook，纯函数
├── constant.ts         # 页面常量定义
└── index.module.scss   # 页面样式（CSS Modules）
```

### 后端命名规范

| 元素 | 命名规则 | 示例 |
|------|----------|------|
| 模块目录 | 小写 | `auth/`, `article/` |
| 文件名 | kebab-case + 后缀 | `auth.controller.ts` |
| 类名 | PascalCase | `AuthController`, `ArticleService` |
| DTO 类 | PascalCase + 后缀 | `LoginDto`, `CreateArticleDto` |

### Prisma 模型命名规范

✅ **强制使用 PascalCase** 命名模型，直接访问无需类型转换：

```typescript
// ✅ 正确
this.prisma.articles.findMany({...})

// ❌ 错误：不要用全小写 model 名，也不需要 as any
(this.prisma as any).articles.findMany({...})
```

---

## 📖 参考文档

### 开发总指南

- [CLAUDE.md](./CLAUDE.md) - 项目开发总指南（Agent 自动加载）
- [.claude/projects/frontend-project-info.md](.claude/projects/frontend-project-info.md) - 前端开发信息
- [.claude/projects/backend-project-info.md](.claude/projects/backend-project-info.md) - 后端开发信息

### 规范文档

- [TypeScript 通用规范](.claude/rules/typescript-common.md)
- [安全通用规范](.claude/rules/security-common.md)
- [代码格式通用规范](.claude/rules/code-format-common.md)
- [公共组件开发规范](.claude/rules/frontend-components.md)

### 教学文档（40+ 篇）

详见 `docs/` 目录，包含：

- 功能开发教学指南
- Bug 修复实战案例
- 安全专题教学
- Claude Code 高级功能
- Agent 编排与调度
- ... 更多实战经验沉淀

---

## 📄 License

MIT
