# Claude Code 项目指南

### 项目描述
全栈博客项目，**Monorepo 单代码仓库多系统架构**，包含前端 H5 移动端应用 + 后端多微服务 + 跨系统共享包。

---

## 🤖 Agent 自动触发规则

### 🔐 核心调用机制

当用户输入符合以下特征时，**必须使用 `Agent` 工具调用对应的专属 Agent**，无需用户手动指定。

**调用参数说明**：
- `description`：简短描述任务内容（3-5 个词）
- `prompt`：详细的任务描述和需求
- `subagent_type`：下方表格中列的 Agent 名称

### 前端相关
| 用户输入特征 | 自动使用 方式 |
|-------------|---------------|
| Figma 设计稿转代码、Figma 转 H5 页面/组件、Figma URL 转 React 代码 | `Skill` 工具调用 `figma-to-code` skill（skill 位于 `.claude/skills/figma-to-code/SKILL.md`，user-invocable，可通过 `/figma-to-code` 直接触发） |
| 开发前端页面、组件、API、Hook | `frontend-developer` |
| 审查前端代码质量 | `frontend-code-reviewer` |
| 前端性能问题分析、优化 | `frontend-performance-expert` |
| 前端单元测试编写 | `frontend-test-writer` |
| 前端安全漏洞扫描 | `frontend-security-auditor` |
| UI 设计稿转代码、组件设计 | `ui-designer` |

### 后端相关
| 用户输入特征 | 自动使用 Agent |
|-------------|---------------|
| 开发 NestJS 后端、Controller、Service、Module | `backend-architect` |
| 审查后端代码质量 | `nestjs-code-review` |
| 后端性能问题分析、优化 | `nestjs-performance-audit` |
| 后端单元测试编写 | `nestjs-test-writer` |
| 后端安全漏洞扫描 | `nestjs-security-audit` |
| 解析接口文档生成前后端 API 代码 | `api-parser` |

### 架构与跨系统相关
| 用户输入特征 | 自动使用 Agent |
|-------------|---------------|
| 生成架构图、流程图、序列图 | `mermaid-generator` |
| XMind 思维导图转任务清单、结构化任务解析 | `xmind-task-parser` |

### 通用工具
| 用户输入特征 | 自动使用 Agent |
|-------------|---------------|
| 搜索代码、组件、调用链 | `search-expert` |
| 全量前端代码审查（质量 + 安全 + 性能） | `full-frontend-review-orchestrator` |
| 错误日志分析、Bug 诊断、复现步骤生成 | `Skill` 工具调用 `debug` skill（skill 位于 `.claude/skills/debug/SKILL.md`，user-invocable，可通过 `/debug` 直接触发） |
| Git 提交信息生成、分支管理、PR 描述 | `git-helper` |

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

## 📁 项目应用指南

前后端详细开发规范与目录约定见 `.claude/projects`：

| 系统 | 指南文件 |
|------|---------|
| 前端 H5 | [`.claude/projects/frontend-project-info.md`](.claude/projects/frontend-project-info.md) |
| 后端 NestJS | [`.claude/projects/backend-project-info.md`](.claude/projects/backend-project-info.md) |

---