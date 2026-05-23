# Speckit 系统入门教学指南

> **文档用途**：帮助新手快速理解和使用 `.specify` / Speckit AI 驱动开发工作流
> **适用人群**：第一次接触 Speckit 的开发者
> **实战场景**：新功能开发、需求规格化、AI 协作编码
> **教学价值**：掌握"规格驱动开发"（SDD）的标准化流程，让 AI 开发不再"黑盒"

---

## 1. Speckit 是什么？

### 1.1 一句话解释

Speckit 是一个**把"口头需求"变成"结构化开发文档"再到"可执行代码"**的 AI 协作框架。

### 1.2 为什么要用它？

| 不用 Speckit                                                  | 使用 Speckit                                                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| "帮我做个文章评论功能" → AI 直接写代码 → 漏掉分页、权限、排序 | "帮我做个文章评论功能" → AI 先写 spec → 你审核 → AI 写 plan → 你审核 → AI 拆 tasks → AI 写代码 |
| 开发到一半发现需求理解错了，推倒重来                          | 每一步都有审核门，方向错了在文档阶段就发现                                                     |
| 没有设计文档，后期维护全靠猜                                  | 自动生成 `spec.md`、`plan.md`、`tasks.md`，知识可沉淀                                          |
| Git 分支混乱，提交信息随意                                    | 自动创建功能分支、自动提交、规范命名                                                           |

### 1.3 核心工作流（SDD 流程）

```
你说需求
  ↓
/speckit-specify  →  生成 spec.md（需求规格书）
  ↓                    用户故事、验收标准、功能需求
[人工审核门]          你可以说"不对，这里要改"
  ↓
/speckit-plan      →  生成 plan.md（实现计划）
  ↓                    技术选型、项目结构、依赖分析
[人工审核门]
  ↓
/speckit-tasks     →  生成 tasks.md（任务清单）
  ↓                    按优先级拆分的可执行任务
  ↓
/speckit-implement →  按 tasks.md 写代码
```

---

## 2. 项目中的 `.specify` 文件夹

### 2.1 目录结构一览

```
.specify/                          # Speckit 配置根目录
├── extensions/                    # 扩展插件
│   └── git/                       # Git 自动化扩展
│       ├── commands/              # 可用的 Git 命令定义
│       ├── scripts/               # Bash / PowerShell 脚本
│       └── extension.yml          # 扩展配置
├── extensions.yml                 # 扩展总配置（钩子定义）
├── init-options.json              # 你的初始化选择
├── integration.json               # 与 Claude Code 的集成配置
├── integrations/                  # 集成清单
├── memory/                        # 项目"宪法"
│   └── constitution.md            # 技术原则约束
├── scripts/                       # 通用脚本工具
├── templates/                     # 文档模板（核心！）
│   ├── spec-template.md           # 需求规格模板
│   ├── plan-template.md           # 实现计划模板
│   ├── tasks-template.md          # 任务清单模板
│   ├── checklist-template.md      # 检查清单模板
│   └── constitution-template.md   # 项目宪法模板
└── workflows/                     # 工作流定义
    └── speckit/
        └── workflow.yml           # 完整 SDD 工作流
```

### 2.2 关键文件解读

#### `init-options.json` —— 你的配置选择

```json
{
  "ai": "claude", // 使用 Claude AI
  "ai_skills": true, // 启用 AI Skills
  "branch_numbering": "sequential", // 分支编号：顺序编号（001, 002...）
  "context_file": "CLAUDE.md", // 上下文文件
  "here": true, // 在当前目录执行
  "integration": "claude", // 集成方式：Claude Code
  "script": "sh", // 脚本类型：Shell
  "speckit_version": "0.8.11.dev0"
}
```

**说明**：这份配置表示你选择用 **Claude Code + Shell 脚本 + 顺序分支编号** 的方式工作。

#### `extensions.yml` —— Git 自动化钩子

这是 Speckit 的"自动化管家"。它会在每个阶段前后自动执行 Git 操作：

| 阶段                                                | 自动执行的操作           | 作用                                     |
| --------------------------------------------------- | ------------------------ | ---------------------------------------- |
| `before_constitution`                               | `speckit.git.initialize` | 初始化 Git 仓库                          |
| `before_specify`                                    | `speckit.git.feature`    | 创建功能分支（如 `001-article-comment`） |
| `before_plan` / `before_tasks` / `before_implement` | `speckit.git.commit`     | 自动提交当前修改                         |
| `after_specify` / `after_plan` / `after_tasks`      | `speckit.git.commit`     | 每个阶段完成后自动提交                   |

**好处**：你专心想需求，Git 管理全部自动化。

#### `templates/` —— 5 大文档模板

| 模板文件                   | 用途                 | 什么时候生成               |
| -------------------------- | -------------------- | -------------------------- |
| `spec-template.md`         | 需求规格书           | `/speckit-specify` 时      |
| `plan-template.md`         | 技术实现计划         | `/speckit-plan` 时         |
| `tasks-template.md`        | 可执行任务清单       | `/speckit-tasks` 时        |
| `checklist-template.md`    | 验收检查清单         | `/speckit-checklist` 时    |
| `constitution-template.md` | 项目宪法（技术原则） | `/speckit-constitution` 时 |

---

## 3. 快速开始：你的第一个 Speckit 流程

### 3.1 第 1 步：描述你的需求

对 Claude 说：

```
我想做一个文章评论功能，用户可以：
1. 在文章下方发表评论
2. 回复其他人的评论
3. 删除自己的评论
4. 点赞/取消点赞评论

要求：
- 支持分页加载，每页 10 条
- 需要登录才能评论
- 后端用 NestJS + Prisma
- 前端用 React + MobX
```

或者更简洁地执行 skill 命令：

```bash
/speckit-specify 我想做一个文章评论功能，支持发表、回复、删除、点赞，分页加载
```

### 3.2 第 2 步：AI 生成 `spec.md`（需求规格书）

Speckit 会在 `specs/001-article-comment/` 目录下生成：

```
specs/001-article-comment/
├── spec.md          # 需求规格书 ← 这一步生成
├── plan.md          # 实现计划 ← 下一步
├── tasks.md         # 任务清单 ← 再下一步
└── ...
```

`spec.md` 的结构（基于模板）：

```markdown
# Feature Specification: 文章评论功能

## User Story 1 - 发表评论 (Priority: P1)

**Acceptance Scenarios**:

1. Given 已登录用户，When 输入评论内容并提交，Then 评论显示在文章下方

## User Story 2 - 回复评论 (Priority: P2)

...

## Functional Requirements

- FR-001: System MUST 允许登录用户发表评论
- FR-002: System MUST 支持嵌套回复（最多 3 层）

## Success Criteria

- SC-001: 用户可以 3 步内完成评论发表
```

**你的动作**：阅读生成的 `spec.md`，如果不满意可以直接告诉 Claude 哪里要改。

### 3.3 第 3 步：AI 生成 `plan.md`（实现计划）

执行：

```bash
/speckit-plan
```

`plan.md` 会包含：

```markdown
# Implementation Plan: 文章评论功能

## Technical Context

- Language: TypeScript 5.7
- Backend: NestJS 11 + Prisma 6.4
- Frontend: React 19 + MobX
- Database: PostgreSQL

## Project Structure
```

backend/src/
modules/comment/
comment.controller.ts
comment.service.ts
comment.module.ts
dto/
create-comment.dto.ts
...

```

## Constitution Check
[检查是否符合项目宪法中的约束]
```

**你的动作**：审核技术方案是否合理。比如可以问：

- "分页用 offset 还是 cursor？"
- "DTO 验证用 class-validator 吗？"
- "前端评论状态放在全局 Store 还是页面级 Store？"

### 3.4 第 4 步：AI 生成 `tasks.md`（任务清单）

执行：

```bash
/speckit-tasks
```

`tasks.md` 是按优先级组织的任务列表：

```markdown
# Tasks: 文章评论功能

## Phase 1: Setup

- [ ] T001 Create project structure

## Phase 2: Foundational

- [ ] T004 Setup database schema for Comment entity
- [ ] T005 Implement auth guard for comment endpoints

## Phase 3: User Story 1 - 发表评论 (P1)

- [ ] T012 [P] [US1] Create Comment model in Prisma
- [ ] T013 [US1] Implement CommentService.create()
- [ ] T014 [US1] Implement POST /api/comments endpoint

## Phase 4: User Story 2 - 回复评论 (P2)

...
```

**关键概念**：

- `[P]` = 可并行执行的任务
- `[US1]` = 属于 User Story 1 的任务
- `Phase 2` 是"阻塞性基础任务"，必须先完成

### 3.5 第 5 步：AI 执行实现

执行：

```bash
/speckit-implement
```

AI 会按照 `tasks.md` 逐条：

1. 写代码
2. 跑 lint
3. 类型检查
4. 自动提交

**你的动作**：等待完成，或者中途查看进度。

---

## 4. 常用命令速查表

| 命令                     | 作用                        | 对应产出                         |
| ------------------------ | --------------------------- | -------------------------------- |
| `/speckit-specify`       | 从需求描述生成规格书        | `specs/XXX-feature/spec.md`      |
| `/speckit-clarify`       | 识别需求中不明确的地方      | 更新 spec.md                     |
| `/speckit-plan`          | 制定技术实现方案            | `specs/XXX-feature/plan.md`      |
| `/speckit-tasks`         | 拆分为具体执行任务          | `specs/XXX-feature/tasks.md`     |
| `/speckit-implement`     | 按任务清单写代码            | 实际代码文件                     |
| `/speckit-analyze`       | 检查文档一致性              | 分析报告                         |
| `/speckit-checklist`     | 生成验收检查清单            | `specs/XXX-feature/checklist.md` |
| `/speckit-taskstoissues` | 把 tasks 转成 GitHub Issues | GitHub Issues                    |

---

## 5. 项目中的实际案例

### 5.1 你的项目中 Speckit 产出的文档在哪？

在你的项目中，所有 Speckit 生成的文档都在：

```
specs/                          # 所有功能规格文档
└── [分支名]-[功能名]/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

### 5.2 结合你的项目架构

你的项目是 Monorepo 结构：

```
claude/
├── apps/web/           ← 前端 H5 应用
├── services/
│   ├── auth-service/   ← 认证服务
│   ├── backend/        ← 主业务服务
│   └── log-service/    ← 日志服务
└── packages/
    └── shared-logging/ ← 共享包
```

当 Speckit 生成 `plan.md` 时，它会：

1. **自动识别**这是 Monorepo 结构
2. **建议正确的目录**：前端代码放 `apps/web/src/`，后端代码放 `services/backend/src/`
3. **遵循已有规范**：比如前端页面用 5 文件拆分、Prisma 模型用 PascalCase

---

## 6. 最佳实践与避坑指南

### 6.1 需求描述的黄金公式

```
【功能】我想做 X 功能
【用户】目标用户是谁
【场景】用户在什么场景下使用
【必须】必须包含的功能点
【可选】可选/加分功能
【约束】技术约束或不能做什么
```

### 6.2 常见踩坑点

| 坑         | 现象                          | 避免方法                                      |
| ---------- | ----------------------------- | --------------------------------------------- |
| 需求太模糊 | AI 生成的 spec 和你想的不一样 | 用"用户故事"格式描述：作为...我想要...以便... |
| 跳过审核门 | 开发到一半发现方向错了        | **一定要看**生成的 spec/plan，不满意就拒绝    |
| 范围蔓延   | 一个功能越做越大              | 在 spec 中明确标注"不在本次范围内"            |
| 忽略边界   | 只考虑正常流程                | 要求 AI 在 spec 中写 Edge Cases 章节          |

### 6.3 何时使用 Speckit？

| 场景          | 是否推荐    | 理由                         |
| ------------- | ----------- | ---------------------------- |
| 新功能开发    | ✅ 强烈推荐 | 完整流程确保不遗漏           |
| 小型 Bug 修复 | ⚠️ 看情况   | 修复一行代码不需要走完整流程 |
| 重构已有功能  | ✅ 推荐     | plan.md 帮助梳理影响范围     |
| 纯文档工作    | ✅ 推荐     | specify + clarify 快速生成   |
| 紧急热修复    | ❌ 不推荐   | 流程较长，不适合紧急场景     |

---

## 7. 核心知识点摘要

| 分类       | 核心知识点                                             |
| ---------- | ------------------------------------------------------ |
| **工作流** | SDD = Specify → Plan → Tasks → Implement，每步有审核门 |
| **自动化** | Git 分支、提交全部自动管理，命名规范统一               |
| **模板**   | 5 大模板确保文档结构一致，知识可沉淀                   |
| **并行**   | `[P]` 标记的任务可以并行开发，提高团队效率             |
| **审核**   | 人工审核门是质量的最后一道防线，不要跳过               |

---

## 8. 下一步学习建议

1. **实际操作一次**：选一个简单功能（如"文章点赞"），完整走一遍 `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`
2. **阅读生成的文档**：重点看 `spec.md` 的用户故事和验收标准，学习如何结构化表达需求
3. **查看 `.specify/templates/`**：了解每个模板的具体字段，知道 AI 会按什么结构生成文档
4. **尝试自定义宪法**：在项目根目录执行 `/speckit-constitution`，设置你团队的技术原则约束

---

---

## 9. 实战案例深度复盘：字符串工具函数

> 本节基于本项目 `specs/001-string-utils` 特性的完整实战过程编写，是新手理解 Speckit 工作流的最佳参考。

### 9.1 需求起源

用户输入：

```
apps/web/src/utils 中 实现 3 个简单的字符串工具函数
- trim() - 去除首尾空格
- uppercase() - 转为大写
- lowercase() - 转为小写
质量标准：类型声明完整
执行模式：plan-only
```

这是一个**极简单的功能**，但完整走了一遍 Speckit 流程。正是简单功能的完整复盘，最能帮助新手理解每个步骤的意义。

---

### 9.2 完整时间线与文件变化

#### Step 1: `/speckit-specify` — 创建需求

**发生了什么**：

- Speckit 自动创建了特性目录 `specs/001-string-utils/`
- 基于模板生成了 `spec.md`
- 创建了 Git 分支 `20260320-string-utils`
- 生成了质量检查清单 `checklists/requirements.md`

**生成的 spec.md 初版包含**：

- 3 个 User Story（trim、uppercase、lowercase）
- 每个故事有 3 个 Acceptance Scenarios
- 4 个 Functional Requirements（FR-001 ~ FR-004）
- 3 个 Success Criteria（SC-001 ~ SC-003）
- Edge Cases（空字符串、多语言字符、特殊符号）

**新手注意**：

> 这一步你不需要写任何代码，只需要说"我要做什么"。AI 会帮你把模糊的想法变成结构化的需求文档。

---

#### Step 2: `/speckit-clarify`（第 1 次）— 去除单元测试

**用户输入**：`去除单元测试`

**发生了什么**：

- AI 扫描 spec.md，发现需求中提到了"Independent Test"
- 但没有明确说"是否需要编写单元测试代码"
- 这是需求中的一个**模糊点**

**spec.md 的变更**：

```markdown
## Clarifications

### Session 2026-05-16

- **Q**: 本特性是否需要编写单元测试？
  **A**: 否，本特性不包含单元测试代码编写。
```

**为什么这很重要**：

> 如果不澄清，后续 `/speckit-plan` 可能会默认生成测试方案（如 Vitest 测试文件），导致实现时多写了不需要的代码。

---

#### Step 3: `/speckit-plan`（第 1 次）— 生成技术方案

**发生了什么**：

- AI 读取了更新后的 spec.md
- 生成了 4 个文件：plan.md、research.md、data-model.md、quickstart.md

**plan.md 的关键内容**：

- 技术栈：TypeScript 5.5.3，零外部依赖
- 文件位置：`apps/web/src/utils/string.ts`
- 测试：Vitest（因为此时还没澄清"去除测试"）
- 验收：Acceptance Scenarios 人工验证

**data-model.md 的关键内容**：

```typescript
export function trim(str: string): string;
export function uppercase(str: string): string;
export function lowercase(str: string): string;
```

**注意**：此时参数类型还是 `string`，因为还没澄清"空值安全处理"。

---

#### Step 4: `/speckit-clarify`（第 2 次）— 验收用 npm run lint

**用户输入**：`测试使用npm run lint验证就行`

**发生了什么**：

- 用户在需求中补充了验收方式
- AI 更新 spec.md 的 Clarifications 和 Assumptions

**spec.md 的变更**：

```markdown
- **Q**: 本特性的验收方式是什么？
  **A**: 实现后运行 `npm run lint` 通过，即视为验收合格。
```

**为什么这很重要**：

> 明确验收方式后，后续 plan.md 中的 Testing 部分会更新，tasks.md 中也会有对应的验收任务。

---

#### Step 5: `/speckit-plan`（第 2 次）— 重新生成方案

**发生了什么**：

- 因为 spec.md 变了（增加了 lint 验收），plan.md 必须重新生成
- plan.md 中的 Testing 更新为：`npm run lint` 通过
- quickstart.md 中增加了 `npm run lint` 的验收命令

**关键认知**：

> **spec.md 变了，plan.md 必须重新生成**。不要手动改 plan.md 来"同步" spec.md 的变更，那样容易遗漏。

---

#### Step 6: `/speckit-clarify`（第 3 次）— 增加空值安全处理

**用户输入**：`增加空值安全处理（允许传入 null/undefined）`

**发生了什么**：

- 这是一个**需求变更**（不是计划调整）
- 因为参数类型从 `string` 变成了 `string | null | undefined`
- 函数行为从"调用方保证非空"变成了"函数内部处理空值"

**spec.md 的两处变更**：

**① Edge Cases 增加**：

```markdown
- 传入 `null` 或 `undefined` 时，函数应返回空字符串 `""`，不抛出异常
```

**② Assumptions 修改**：

```markdown
// 从：

- 调用方负责保证传入参数为字符串类型（不处理 null、undefined）

// 改为：

- 函数需对 `null` / `undefined` 做安全处理，返回空字符串 `""`
```

**为什么这是需求变更**：

> 因为用户故事中的验收场景没有变（还是 trim/uppercase/lowercase），但**边界情况**和**约束条件**变了。这会影响接口签名和实现逻辑，所以是需求层变更。

---

#### Step 7: `/speckit-plan`（第 3 次）— 重新生成空值安全方案

**发生了什么**：

- plan.md 更新：Summary 中增加"关键设计点：函数参数类型为 `string | null | undefined`"
- research.md 更新：增加"空值安全处理策略"章节，对比 `??` vs `||`
- data-model.md 更新：所有参数类型变为 `string | null | undefined`

**data-model.md 的变更**：

```typescript
// 从：
export function trim(str: string): string;

// 变为：
export function trim(str: string | null | undefined): string;
```

**关键认知**：

> 需求层的一个小调整（"支持 null"），会导致技术方案层的多个文件连锁更新。这就是为什么要用 Speckit 管理——确保所有文档一致。

---

#### Step 8: `/speckit-clarify`（第 4 次）— 去除 npm run lint

**用户输入**：`去除npm run lint`

**发生了什么**：

- 用户改变了验收标准
- spec.md 的 Clarifications 和 Assumptions 再次更新

**spec.md 的变更**：

```markdown
- **Q**: 本特性的验收方式是什么？
  **A**: 代码实现正确即可，无额外验收步骤。
```

**Assumptions 更新**：

```markdown
- 本特性不包含单元测试实现，无额外验收步骤
```

---

#### Step 9: `/speckit-plan`（第 4 次）— 最终方案

**发生了什么**：

- plan.md 中的 Testing 更新为："无单元测试。无额外验收步骤。"
- research.md 中移除了 lint 相关内容
- quickstart.md 中移除了测试命令

**此时 plan.md 的最终状态**：

- 空值安全处理 ✅
- 无单元测试 ✅
- 无额外验收步骤 ✅

---

#### Step 10: `/speckit-tasks` — 生成任务清单

**发生了什么**：

- 基于最终的 plan.md 和 spec.md 生成 tasks.md
- 共生成 5 个任务：T001~T003（三个函数实现）+ T004~T005（格式检查）

**tasks.md 的内容**：

```markdown
## Phase 1: User Story 1 - trim

- [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts

## Phase 2: User Story 2 - uppercase

- [ ] T002 [US2] 实现 uppercase 函数于 apps/web/src/utils/string.ts

## Phase 3: User Story 3 - lowercase

- [ ] T003 [US3] 实现 lowercase 函数于 apps/web/src/utils/string.ts

## Phase 4: Polish

- [ ] T004 确保 JSDoc 注释完整
- [ ] T005 确保导入排序规范
```

**关键认知**：

> tasks.md 中的任务非常具体，每个任务都有明确的文件路径。这让执行时不会有歧义。

---

#### Step 11: `/speckit-implement` — 代码实现

**发生了什么**：

- AI 读取 tasks.md
- 按顺序执行 T001 → T002 → T003 → T004 → T005
- 生成文件 `apps/web/src/utils/string.ts`
- 在 tasks.md 中标记所有任务为 `[x]` 完成

**最终代码**（27 行）：

```typescript
/**
 * 去除字符串首尾空白字符
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 去除首尾空白后的字符串；传入 null/undefined 时返回空字符串
 */
export function trim(str: string | null | undefined): string {
  return (str ?? '').trim();
}

/**
 * 将字符串转为全大写
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 全大写形式的字符串；传入 null/undefined 时返回空字符串
 */
export function uppercase(str: string | null | undefined): string {
  return (str ?? '').toUpperCase();
}

/**
 * 将字符串转为全小写
 * @param str - 待处理的字符串，允许传入 null 或 undefined
 * @returns 全小写形式的字符串；传入 null/undefined 时返回空字符串
 */
export function lowercase(str: string | null | undefined): string {
  return (str ?? '').toLowerCase();
}
```

---

### 9.3 文件关系总图（本次特性）

```
用户输入："实现3个字符串工具函数"
           │
           ▼
    ┌──────────────┐
    │ /speckit-specify │
    └──────────────┘
           │
           ▼
    specs/001-string-utils/
    ├── spec.md  ─────┐
    └── checklists/   │
                     │
    ┌────────────────┤
    │ /speckit-clarify │
    │ （去除单元测试）  │
    └────────────────┤
                     │
    ┌────────────────┤
    │ /speckit-plan    │
    └────────────────┘
                     │
           ┌─────────┼─────────┬────────────┐
           ▼         ▼         ▼            ▼
        plan.md  research.md  data-model.md  quickstart.md
           │                              │
    ┌──────┴──────┐              ┌──────┴──────┐
    │ /speckit-clarify │            │ /speckit-clarify │
    │（lint 验收）    │            │（空值安全处理）  │
    └──────┴──────┘              └──────┴──────┘
           │                              │
    ┌──────┴──────┐              ┌──────┴──────┐
    │ /speckit-plan  │            │ /speckit-plan  │
    │（更新验收方式）  │            │（更新参数类型）  │
    └─────────────┘              └─────────────┘
                                          │
                                   ┌──────┴──────┐
                                   │ /speckit-clarify │
                                   │（去除 lint）     │
                                   └──────┴──────┘
                                          │
                                   ┌──────┴──────┐
                                   │ /speckit-plan  │
                                   │（最终方案）      │
                                   └─────────────┘
                                          │
                                          ▼
                                   /speckit-tasks
                                          │
                                          ▼
                                   tasks.md
                                          │
                                          ▼
                                   /speckit-implement
                                          │
                                          ▼
                              apps/web/src/utils/string.ts
```

---

### 9.4 核心判断：什么时候改 spec，什么时候改 plan？

本次特性中经历的判断：

| 用户操作              | 文件       | 判断依据               | 结果    |
| --------------------- | ---------- | ---------------------- | ------- |
| "去除单元测试"        | 改 spec.md | 验收标准变了           | ✅ 正确 |
| "验收用 npm run lint" | 改 spec.md | 验收方式变了           | ✅ 正确 |
| "增加空值安全处理"    | 改 spec.md | 参数类型和行为约束变了 | ✅ 正确 |
| "去除 npm run lint"   | 改 spec.md | 验收标准变了           | ✅ 正确 |

**如果用户说**："把文件放在 `shared/` 而不是 `utils/"`

> **只改 plan.md**，因为功能没变，只是目录调整。

**如果用户说**："函数名从 `trim` 改成 `trimSpace`"

> **只改 plan.md**，因为接口命名属于技术细节。

---

### 9.5 新手常见疑问解答

#### Q1: 为什么这么简单的东西要走这么多步骤？

**A**: 因为这个功能简单，所以每一步都很短。但流程是一样的。如果是复杂功能（如文章评论系统），每一步的价值就会凸显：

- spec.md 确保不遗漏分页、权限、排序
- plan.md 确保前后端接口对齐
- tasks.md 确保团队成员可以并行开发

**简单功能走完整流程 = 练习；复杂功能走完整流程 = 救命。**

#### Q2: spec.md 和 plan.md 看起来很像，有什么区别？

**A**: 用餐厅比喻：

- **spec.md** = 菜单（顾客视角："我要一份牛排，七分熟，配黑胡椒酱"）
- **plan.md** = 厨房施工单（厨师视角："用西冷牛排，铁板温度 200℃，煎 4 分钟"）

顾客不关心铁板温度，厨师不关心顾客为什么点七分熟。

#### Q3: 我可以跳过 clarify 直接 plan 吗？

**A**: 可以，但不推荐。如果跳过 clarify：

- plan.md 可能会包含你不需要的测试代码
- 验收方式可能和你预期的不一样
- 空值处理可能不符合你的习惯

**Clarify 的本质 = 在写代码之前，花 2 分钟确认需求，避免写完后花 20 分钟返工。**

#### Q4: 为什么 plan.md 需要重新生成那么多次？

**A**: 因为 spec.md 是**源头**，plan.md 是**派生**。源头变了，派生必须跟着变。

Speckit 的设计哲学是：**保持所有文档的一致性**。如果 spec.md 说"支持 null"，但 plan.md 说"参数是 string"，那就是文档不一致，会导致实现出错。

#### Q5: tasks.md 里的任务都是 AI 执行的吗？

**A**: `/speckit-implement` 会自动执行 tasks.md 中的任务。但你也可以：

- 手动执行某个任务（自己打开 IDE 写代码）
- 修改 tasks.md 后再执行
- 跳过某些任务（比如不执行测试任务）

**tasks.md 是执行指南，不是强制命令。**

---

### 9.6 本次特性产出的所有文件清单

| 文件路径                                            | 类型     | 说明                                         |
| --------------------------------------------------- | -------- | -------------------------------------------- |
| `specs/001-string-utils/spec.md`                    | 需求文档 | 核心真相源，包含用户故事、验收场景、边界情况 |
| `specs/001-string-utils/plan.md`                    | 技术方案 | 实现蓝图，包含技术栈、目录结构、约束条件     |
| `specs/001-string-utils/research.md`                | 技术调研 | 决策记录（为什么用原生方法、为什么用 `??`）  |
| `specs/001-string-utils/data-model.md`              | 接口契约 | 函数类型签名（参数、返回值、约束）           |
| `specs/001-string-utils/quickstart.md`              | 使用指南 | 面向使用者的导入示例和类型说明               |
| `specs/001-string-utils/tasks.md`                   | 任务清单 | 可执行的任务列表，含编号和完成状态           |
| `specs/001-string-utils/checklists/requirements.md` | 质量检查 | 需求完整性验证清单                           |
| `apps/web/src/utils/string.ts`                      | 代码文件 | 最终交付物：trim / uppercase / lowercase     |

---

### 9.7 关键数字

| 指标           | 数值     | 说明                                                     |
| -------------- | -------- | -------------------------------------------------------- |
| 总步骤数       | 11       | specify → clarify ×4 → plan ×4 → tasks → implement       |
| 生成的文档数   | 7        | spec/plan/research/data-model/quickstart/tasks/checklist |
| 代码行数       | 27       | 3 个函数 + JSDoc 注释                                    |
| 澄清次数       | 4        | 单元测试、lint 验收、空值安全、去除 lint                 |
| 重新 plan 次数 | 4        | 每次 clarify 后都重新生成                                |
| 实际开发时间   | < 5 分钟 | 如果需求一开始就很明确，步骤会大幅减少                   |

---

**文档生成时间**：2026-05-16
**Speckit 版本**：0.8.11.dev0
**适用项目**：claude Monorepo 全栈博客项目
**实战特性**：specs/001-string-utils（前端字符串工具函数）
