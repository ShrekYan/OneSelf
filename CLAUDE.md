# Claude Code 项目指南

### 项目描述
全栈博客项目，**Monorepo 单代码仓库多系统架构**，包含前端 H5 移动端应用 + 后端多微服务 + 跨系统共享包。

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

## 🛠️ 关键指令

### 根项目（Monorepo 全局）
- **全项目构建**: `npm run build`
- **并行开发所有服务**: `npm run dev`
- **全项目代码检查**: `npm run lint`

### 🔄 多系统开发流程

#### 单系统开发（推荐，隔离性好）
```bash
# 前端开发
cd apps/web && npm run dev

# 单个后端服务开发
cd services/auth-service && npm run start:dev
cd services/backend && npm run start:dev
cd services/log-service && npm run start:dev

# 共享包开发
cd packages/shared-logging && npm run build
```


#### 前端（apps/web/ 目录下）
- **开发**: `npm run dev` (默认外测环境)
- **构建**: `npm run build` (全流程)
- **检查**: `npm run lint` / `npx tsc --noEmit`
- **各环境开发**: `npm run test-dev` (测试) | `npm run sit-dev` (SIT) | `npm run prd-dev` (生产)

#### 后端（进入对应服务目录执行）
```bash
# 各服务独立开发
cd services/auth-service && npm run start:dev
cd services/backend && npm run start:dev
cd services/log-service && npm run start:dev
```
- **构建**: `npm run build`
- **检查**: `npm run lint`

### 📦 共享包开发规范

#### packages/ 目录规则
1. **纯技术库**：不包含业务逻辑，仅提供通用能力
2. **单向依赖**：只能被其他包引用，不能引用业务服务
3. **同步更新**：修改共享包必须同步更新所有使用方
4. **破坏性变更**：必须在 commit body 中详细说明影响范围

#### 跨系统修改提交规范
```bash
# 同时修改多个系统
feat(auth+web): 统一登录状态管理
fix(backend+shared): 修复日志格式兼容性问题
refactor(auth+backend+log): 抽离通用响应格式
```

## 📚 项目规范入口

### 🎯 通用规则（前后端共用）

- **TypeScript 通用规范**: [.claude/rules/typescript-common.md](.claude/rules/typescript-common.md) - 严格模式、any 限制、空值处理、异步规范等
- **安全通用规范**: [.claude/rules/security-common.md](.claude/rules/security-common.md) - HttpOnly Cookie、Token 安全、密码加密、错误信息安全
- **代码格式通用规范**: [.claude/rules/code-format-common.md](.claude/rules/code-format-common.md) - 缩进、引号、分号、导入排序、工具链配置
- **全局行为规范**: [.claude/rules/project-behavior.md](.claude/rules/project-behavior.md) - 代码复用、影响范围确认、安全底线

### 📱 前端特有规范

- **前端 H5 项目信息**: [.claude/projects/frontend-project-info.md](.claude/projects/frontend-project-info.md)
- **公共组件开发规范**: [.claude/rules/frontend-components.md](.claude/rules/frontend-components.md)
- 更多前端规则详见：`.claude/skills/h5-frontend-developer/rules/`

### 🖥️ 后端特有规范

- **后端 NestJS 项目信息**: [.claude/projects/backend-project-info.md](.claude/projects/backend-project-info.md)
- 更多后端规则详见：`.claude/skills/nestjs-backend-developer/`

### 📐 规范引用原则

- **Agent 自动加载**：前端开发 Agent 和后端架构师 Agent 会自动先加载通用规则，再加载各自技术栈的特有规则
- **不重复原则**：通用规则在 rules/ 目录统一维护，前后端特有规则只包含该技术栈独有的内容
- **向后兼容**：原有规则文件保留，只做内容精简，不影响现有工作流

## ✅ 验证流程

完成开发后，请务必依次执行：
1. `npm run lint` (在修改的子项目目录执行，不要在根目录执行全项目检查)
2. 前端目录：`npx tsc --noEmit` (TypeScript 类型检查)
3. 参照 [.claude/commands/review.md](.claude/commands/review.md) 进行自我审计。

## 🧠 项目记忆规则

当用户说"添加到项目记忆"，请将用户描述的踩坑教训按照以下要求处理：

1. **目标文件**: `.claude/project-memory.md`
2. **格式要求**: 在文件末尾追加，遵循现有格式：
   ```markdown
   ---

   ## 问题标题（一句话概括）

   ### 错误场景
   什么场景下遇到这个错误

   ### 错误现象
   具体遇到了什么问题，有什么错误表现

   ### 原因分析
   分析错误原因

   ### 正确解决方法
   展示正确的代码/配置/操作步骤

   ### 记录信息
   **记录日期**: YYYY-MM-DD
   **错误原因**: 一句话概括根本原因

   ---
   ```
3. **处理流程**:
   - 先读取现有 `.claude/project-memory.md` 查看当前格式
   - 根据用户描述，整理成标准格式（补全缺失必要信息，但不要编造内容）
   - 追加到文件末尾
   - 保持原有内容不变

---

## 🤖 Agent 自动触发规则

当用户输入符合以下特征时，**自动使用对应的专属 Agent**，无需用户手动指定：

### 前端相关
| 用户输入特征 | 自动使用 Agent |
|-------------|---------------|
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
| 微服务间接口联调、契约设计 | `api-integration` |

### 架构与跨系统相关
| 用户输入特征 | 自动使用 Agent |
|-------------|---------------|
| 开发共享包、公共工具库 | `package-developer` |
| 跨系统架构设计、重构 | `architect-planner` |
| 生成架构图、流程图、序列图 | `mermaid-generator` |

### 通用工具
| 用户输入特征 | 自动使用 Agent |
|-------------|---------------|
| 搜索代码、组件、调用链 | `search-expert` |
| 全量前端代码审查（质量 + 安全 + 性能） | `full-frontend-review-orchestrator` |
| 错误日志分析、Bug 诊断、复现步骤生成 | `debug-assistant` |
