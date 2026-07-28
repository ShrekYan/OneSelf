# Claude Code 项目指南

### 项目描述
全栈博客项目，**Monorepo 单代码仓库多系统架构**，包含前端 H5 移动端应用 + 后端多微服务 + 跨系统共享包。

---

## 📁 项目应用指南

前后端详细开发规范与目录约定见 `.claude/projects`：

| 系统 | 指南文件 |
|------|---------|
| 前端 H5 | [`.claude/projects/frontend-project-info.md`](.claude/projects/frontend-project-info.md) |
| 后端 NestJS | [`.claude/projects/backend-project-info.md`](.claude/projects/backend-project-info.md) |

---

## 🏗️ 系统架构与职责边界

```
claude (Monorepo 根)
├── apps/                    # 应用系统
│   └── web/                 # 前端 H5 移动端博客应用
│
├── services/                # 后端微服务
│   ├── auth-service/        # 认证授权服务 - 登录、注册、Token 管理
│   ├── backend/             # 主业务服务 - 博客文章、评论、用户管理
│   └── log-service/         # 日志服务 - 操作日志、审计日志、行为分析
│
└── packages/                # 跨系统共享包
    └── shared-logging/      # 统一日志格式与上报 - 所有 NestJS 服务共用
```

### 各系统职责说明

| 系统 | 目录 | 职责范围 | 技术栈 |
|------|------|---------|--------|
| **web** | `apps/web/` | 用户端 H5 应用，页面渲染、交互逻辑、状态管理 | React 19 + MobX |
| **auth-service** | `services/auth-service/` | 认证领域：登录、注册、权限校验、Session 管理 | NestJS 11 |
| **backend** | `services/backend/` | 核心业务：文章 CRUD、评论系统、用户管理 | NestJS 11 + Prisma |
| **log-service** | `services/log-service/` | 日志领域：操作记录、审计追踪、行为数据采集 | NestJS 11 |
| **shared-logging** | `packages/shared-logging/` | 共享组件：统一日志格式、日志上报 SDK | TypeScript |

### 服务间依赖关系

```
web (前端)
    ↓ 调用
auth-service (认证) ←→ backend (主业务) ←→ log-service (日志)
                                    ↓
                          shared-logging (共享包)
```

---

## 🚀 核心技术栈

### 前端（apps/web/）
- React 19.2.3 + TypeScript 5.5.3
- Vite 7.3.1 + MobX 6.13.5
- Ant Design Mobile 5.42.3 + SCSS (CSS Modules)

### 后端（services/）
- NestJS 11.0.1 + TypeScript 5.7.3
- Prisma ORM 6.4.1

### 共享包（packages/）
- 纯 TypeScript 库
- 无业务逻辑，仅提供通用能力

### 构建工具
- Turborepo 2.4.2（Monorepo 构建优化）

---