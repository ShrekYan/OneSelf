# Spec Kit 单个 Feature 内任务执行与并发执行指南

## 背景

在 Spec Kit 工作流中，一个 feature 通常会包含多个用户故事、多个阶段和多条任务。

常见问题是：

1. 一个 feature 里有多个用户故事，是否必须一次性全部实现？
2. 能不能一个用户故事一个用户故事地执行？
3. 如果多个任务没有依赖关系，能不能让 Claude Code 并发执行？
4. 并发执行时如何避免文件冲突和上下文污染？

结论：

> **一个 feature 可以按用户故事增量执行；没有依赖且文件隔离的任务可以并发执行；共享配置、共享入口和最终集成任务应该串行执行。**

---

## 核心原则

### 1. 一个 feature 不等于必须一次性全部做完

一个 feature 可以包含多个用户故事，例如：

```text
Feature: 小贝工具库
├── US1: 字符串工具
├── US2: 数字工具
└── US3: 数组工具
```

可以按下面方式增量实现：

```text
先实现 US1 → 验证 → 提交
再实现 US2 → 验证 → 提交
再实现 US3 → 验证 → 提交
最后执行 Final Phase → 全量验证 → 提交
```

这样可以降低风险，方便回滚，也方便逐步验收。

### 2. 并发执行的前提是任务真正独立

任务可以并发，不代表所有任务都适合并发。

适合并发的任务必须同时满足：

- 没有前后依赖关系。
- 修改文件不重叠。
- 不同时修改共享入口文件。
- 可以独立验证。
- `tasks.md` 中最好明确标记 `[P]`。

### 3. 共享任务必须串行

下面这类任务不建议并发：

- 修改 `package.json`。
- 修改 lock 文件。
- 修改 `tsconfig.json`、`vite.config.ts` 等配置文件。
- 修改路由入口。
- 修改统一导出文件。
- 修改全局 store。
- 修改 Prisma schema 或 migration。
- 执行 Final Phase / Polish / Cross-Cutting Concerns。

---

## 推荐任务结构

一个适合增量执行和并发执行的 `tasks.md`，应该按 Phase 和用户故事组织：

```markdown
# Tasks: 小贝工具库

## Phase 1: Setup

- [ ] T001 创建基础目录结构

## Phase 2: Foundational

- [ ] T002 确认共享类型和工具目录

## Phase 3: User Story 1 - 字符串工具 (Priority: P1)

- [ ] T003 [P] [US1] 实现字符串工具函数，文件：apps/web/src/utils/string.ts

## Phase 4: User Story 2 - 数字工具 (Priority: P1)

- [ ] T004 [P] [US2] 实现数字工具函数，文件：apps/web/src/utils/number.ts

## Phase 5: User Story 3 - 数组工具 (Priority: P1)

- [ ] T005 [P] [US3] 实现数组工具函数，文件：apps/web/src/utils/array.ts

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T006 更新统一导出文件 apps/web/src/utils/index.ts
- [ ] T007 执行 lint 和 TypeScript 类型检查
```

这里的关键设计是：

- `T003`、`T004`、`T005` 修改不同文件，标记 `[P]`，可以并发。
- `T006` 修改共享导出文件，不能并发，放到 Final Phase。
- `T007` 是全局验证，必须最后执行。

---

## 串行增量执行方式

如果希望最稳妥，可以按用户故事一个一个执行。

### 第一步：先执行基础任务

```text
/speckit-implement 只执行 Setup 和 Foundational 阶段，完成后停止。
```

或者更精确：

```text
/speckit-implement 只执行 T001-T002，完成后停止。
```

### 第二步：只执行 US1

```text
/speckit-implement 只执行 [US1] 相关任务。完成 [US1] 后停止，不要执行 [US2]、[US3] 或 Final Phase。
```

### 第三步：验证 US1

根据当前 feature 类型执行对应验证。

前端常见验证：

```bash
cd apps/web && npm run lint
cd apps/web && npx tsc --noEmit
```

后端常见验证：

```bash
cd services/backend && npm run lint
cd services/backend && npm run build
```

### 第四步：执行 US2

```text
/speckit-implement 只执行 [US2] 相关任务。完成 [US2] 后停止，不要执行 [US3] 或 Final Phase。
```

### 第五步：执行 US3

```text
/speckit-implement 只执行 [US3] 相关任务。完成 [US3] 后停止，不要执行 Final Phase。
```

### 第六步：执行 Final Phase

```text
/speckit-implement 只执行 Final Phase / Polish / Cross-Cutting Concerns 相关任务。
```

---

## 并发执行方式

当多个用户故事之间没有依赖，并且修改文件完全隔离时，可以并发执行。

推荐顺序：

```text
Setup / Foundational 串行
  ↓
US1、US2、US3 并发
  ↓
Final Phase 串行
  ↓
最终验证
```

### 并发前检查清单

执行并发前必须确认：

- [ ] 任务之间没有依赖关系。
- [ ] 每个任务修改的文件不重叠。
- [ ] 不涉及共享配置文件。
- [ ] 不涉及统一导出、路由、全局 store 等共享入口。
- [ ] 每个任务都可以独立验证。
- [ ] `tasks.md` 中已用 `[P]` 标明可并行任务。

### 并发执行提示词模板

#### Agent A

```text
只执行 tasks.md 中 [US1] 且标记为 [P] 的任务。
只允许修改该任务明确列出的文件。
不要修改共享入口文件，不要执行 [US2]、[US3]，不要执行 Final Phase。
完成后停止，并报告修改文件和验证结果。
```

#### Agent B

```text
只执行 tasks.md 中 [US2] 且标记为 [P] 的任务。
只允许修改该任务明确列出的文件。
不要修改共享入口文件，不要执行 [US1]、[US3]，不要执行 Final Phase。
完成后停止，并报告修改文件和验证结果。
```

#### Agent C

```text
只执行 tasks.md 中 [US3] 且标记为 [P] 的任务。
只允许修改该任务明确列出的文件。
不要修改共享入口文件，不要执行 [US1]、[US2]，不要执行 Final Phase。
完成后停止，并报告修改文件和验证结果。
```

---

## 同一工作区并发的风险

即使任务逻辑上可以并行，也不建议多个 Agent 在同一个工作区同时修改代码。

主要风险包括：

- 后写入覆盖先写入。
- import 或 export 被误删。
- 共享文件出现冲突。
- Agent 互相看不到对方尚未完成的修改。
- lint/format 结果互相影响。
- `tasks.md` 勾选状态冲突。

因此，同一工作区更适合：

- 并发只读分析。
- 并发代码搜索。
- 并发方案设计。
- 串行写代码。

如果要并发写代码，优先使用独立 worktree。

---

## 推荐使用独立 worktree

真正并发写代码时，推荐每个并发任务使用独立 worktree。

示例：

```text
worktree-us1：只实现 US1
worktree-us2：只实现 US2
worktree-us3：只实现 US3
```

优点：

- 每个 Agent 在独立目录工作。
- 不会互相覆盖文件。
- 可以独立验证。
- 可以独立提交。
- 最后人工合并，冲突更可控。

适合场景：

- 大 feature。
- 多个用户故事相互独立。
- 多个 Agent 同时写代码。
- 希望降低单次上下文复杂度。

---

## 哪些任务可以标记 `[P]`

可以标记 `[P]` 的任务示例：

```markdown
- [ ] T010 [P] [US1] 新增登录页组件 apps/web/src/pages/Login/index.tsx
- [ ] T011 [P] [US2] 新增注册页组件 apps/web/src/pages/Register/index.tsx
- [ ] T012 [P] [US3] 新增找回密码页组件 apps/web/src/pages/ForgotPassword/index.tsx
```

前提是这些任务不同时修改：

```text
router/index.tsx
pages/index.ts
store/index.ts
api/index.ts
components/index.tsx
```

如果需要统一注册路由或导出，应拆成 Final Phase：

```markdown
- [ ] T020 在路由表中注册 Login/Register/ForgotPassword 页面
```

`T020` 不要标记 `[P]`。

---

## 哪些任务不能标记 `[P]`

不要标记 `[P]` 的任务示例：

```markdown
- [ ] T001 修改 package.json 添加依赖
- [ ] T002 修改 apps/web/src/router/index.tsx 注册路由
- [ ] T003 修改 apps/web/src/components/index.tsx 统一导出组件
- [ ] T004 修改 prisma/schema.prisma 新增模型
- [ ] T005 生成数据库 migration
- [ ] T006 执行全量 lint 和 TypeScript 检查
```

这些任务要么是共享入口，要么是全局验证，要么具有顺序依赖，应串行执行。

---

## 建议的执行节奏

### 最稳妥节奏

```text
1. /speckit-tasks 生成任务
2. 检查 tasks.md 是否按用户故事分组
3. 先执行 Setup / Foundational
4. 执行 US1
5. 验证 US1
6. 提交 US1
7. 执行 US2
8. 验证 US2
9. 提交 US2
10. 执行 US3
11. 验证 US3
12. 提交 US3
13. 执行 Final Phase
14. 全量验证
15. 最终提交
```

### 高效并发节奏

```text
1. /speckit-tasks 生成任务
2. 检查哪些任务有 [P]
3. 串行执行 Setup / Foundational
4. 为 US1、US2、US3 分别创建独立 worktree
5. 每个 worktree 只执行对应 [P] 任务
6. 各自验证
7. 合并回主工作区
8. 串行执行 Final Phase
9. 全量验证
10. 最终提交
```

---

## 常用提示词

### 只执行一个用户故事

```text
/speckit-implement 只执行 [US1] 相关任务。完成后停止，不要执行其他用户故事或 Final Phase。
```

### 只执行指定任务 ID

```text
/speckit-implement 只执行 T003-T005，完成后停止，不要执行其他任务。
```

### 只执行可并行任务

```text
/speckit-implement 只执行当前用户故事中标记为 [P] 的任务。只修改任务明确列出的文件，完成后停止。
```

### 执行最终集成

```text
/speckit-implement 只执行 Final Phase / Polish / Cross-Cutting Concerns，完成全局集成和验证。
```

---

## 判断是否可以并发的简单规则

可以用下面这句话判断：

> 如果两个任务改同一个文件，不能并发；如果一个任务依赖另一个任务的结果，不能并发；如果它们只改各自独立文件，并且能独立验证，可以并发。

更短的口诀：

```text
基础先串行，独立可并发，共享最后收口。
```

---

## 最佳实践总结

1. 一个 feature 可以拆成多个用户故事逐个执行。
2. 用户故事之间无依赖时，可以增量执行，也可以并发执行。
3. `[P]` 只表示逻辑上可并行，不代表可以安全地在同一工作区同时写文件。
4. 并发写代码优先使用独立 worktree。
5. 共享入口文件、配置文件、数据库 schema、Final Phase 应串行执行。
6. 每个用户故事完成后都应独立验证。
7. 最终必须执行全量验证，确保各用户故事集成后没有问题。
