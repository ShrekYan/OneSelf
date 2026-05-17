# Speckit Tasks 执行机制详解

> **目标读者**: 想了解 `/speckit-tasks` 命令内部执行机制的新手
> **文档性质**: 任务拆解阶段技术手册
> **核心问题**: 技术方案如何拆解为可执行的任务清单？
> **权威来源**: 项目内置 Skill 定义（`.claude/skills/speckit-tasks`）

---

## 一、Tasks 阶段定位

```
Specify → Clarify → Plan → [Tasks] → Implement
                              ↑
                            你在这里
```

**核心职责**: `Tasks` 是连接**技术规划**和**代码实现**的桥梁。它将 `plan.md` 中的技术方案转化为结构化的、可执行的任务清单（`tasks.md`），让后续的 `Implement` 阶段知道"**先做什么、后做什么、在哪里做**"。

**类比**:

- `plan.md` = 建筑结构设计图（技术方案）
- `tasks.md` = 施工任务清单（先打地基、再砌墙、最后装修）
- `Implement` = 工人按任务清单施工

**关键原则**:

- 任务必须**按用户故事分组**，便于独立实现和测试
- 每个任务必须有明确的**文件路径**和**可验证的输出**
- 任务格式必须严格遵守 checklist 规范（`- [ ] T001 [US1] 描述 + 路径`）

---

## 二、执行前准备（Pre-Execution Checks）

### 2.1 Extension Hooks 检查

```text
检查 .specify/extensions.yml 是否存在
    │
    ├── 不存在 → 静默跳过，继续执行
    │
    └── 存在 → 读取 hooks.before_tasks 配置
          │
          ├── 筛选：跳过 enabled: false 的钩子
          ├── 筛选：跳过有非空 condition 的钩子（由 HookExecutor 处理）
          └── 对每个可执行钩子：
                ├─ optional: true → 显示可选钩子，等用户决定是否执行
                └─ optional: false → 自动执行，等待结果后再继续
```

**钩子命令转换规则**: `speckit.git.commit` → `/speckit-git-commit`

### 2.2 Setup 脚本执行

**命令**: `.specify/scripts/bash/setup-tasks.sh --json`

**输出字段**:

| 字段             | 含义                         | 示例                                              |
| ---------------- | ---------------------------- | ------------------------------------------------- |
| `FEATURE_DIR`    | 当前特性目录（绝对路径）     | `/Users/.../specs/001-string-utils`               |
| `TASKS_TEMPLATE` | 任务模板文件路径（绝对路径） | `/Users/.../.specify/templates/tasks-template.md` |
| `AVAILABLE_DOCS` | 特性目录下可用文档列表       | `["plan.md", "spec.md", "data-model.md"]`         |

**作用**: 确定当前特性的工作目录和可用输入文档，为后续任务生成提供上下文。

---

## 三、核心执行流程（Execution Flow）

### 3.1 第一步：加载设计文档

AI 按以下优先级读取特性目录下的文档：

```text
┌─────────────────────────────────────────────────────────────┐
│  REQUIRED（必须读取）                                        │
│  ├── plan.md           ← 技术方案、项目结构、文件位置          │
│  └── spec.md           ← 用户故事、优先级、验收标准            │
├─────────────────────────────────────────────────────────────┤
│  IF EXISTS（如果存在则读取，用于丰富任务上下文）                │
│  ├── data-model.md     ← 实体定义、接口类型签名              │
│  ├── contracts/        ← API 契约、接口规范                  │
│  ├── research.md       ← 技术决策、依赖信息                  │
│  └── quickstart.md     ← 集成场景、使用示例                  │
└─────────────────────────────────────────────────────────────┘
```

**读取策略**:

- **plan.md** 提供"在哪里做"（文件路径、项目结构）
- **spec.md** 提供"做什么"（用户故事、功能需求、优先级）
- **data-model.md** 提供"接口长什么样"（类型定义）

### 3.2 第二步：解析文档结构

#### 从 plan.md 提取的信息

```text
plan.md 结构:
  ├── Summary            → 特性概述（一句话总结）
  ├── Technical Context  → 技术栈、依赖、测试方式
  ├── Project Structure  → 新增/修改的文件路径
  └── Constitution Check → 架构约束
```

**提取内容**:

- 技术栈（TypeScript 5.5.3、零依赖等）
- 目标文件路径（`apps/web/src/utils/string.ts`）
- 项目结构决策（与现有 utils 并列）
- 约束条件（纯函数、空值安全处理）

#### 从 spec.md 提取的信息

```text
spec.md 结构:
  ├── User Scenarios & Testing  → 用户故事（US1、US2、US3...）
  │     └── 每个故事包含: Priority、Acceptance Scenarios
  ├── Edge Cases               → 边界情况
  ├── Requirements             → 功能需求编号（FR-001...）
  └── Success Criteria         → 成功标准
```

**提取内容**:

- 用户故事列表（按优先级 P1、P2、P3 排序）
- 每个故事的验收场景（Given-When-Then）
- 边界情况（null/undefined 处理等）
- 功能需求与故事的映射关系

#### 从 data-model.md 提取的信息

```text
data-model.md 结构:
  ├── 实体定义 / 函数接口
  │     └── 每个接口: 类型签名、输入约束、输出定义
  └── 不变式（Invariants）
```

**提取内容**:

- 函数类型签名（参数类型、返回值类型）
- 实体字段和关系（如涉及数据库）
- 业务规则约束

### 3.3 第三步：生成任务结构

#### Phase 划分策略

```text
Phase 1: Setup（项目初始化）
    └── 依赖 spec.md 的 Assumptions 和 plan.md 的 Technical Context
    └── 示例: 创建目录、安装依赖、初始化配置

Phase 2: Foundational（基础准备 - 可选）
    └── 所有用户故事共享的前提工作
    └── 示例: 创建基础类型定义、共享组件

Phase 3+: User Stories（按优先级排序）
    ├── Phase 3: US1（P1 优先级）
    ├── Phase 4: US2（P1 优先级）
    ├── Phase 5: US3（P2 优先级）
    └── ...

Final Phase: Polish & Cross-Cutting Concerns（打磨）
    └── 代码风格、注释、导入排序、类型检查等
```

**Phase 命名规则**:

- Setup 和 Foundational 阶段**不需要** Story 标签
- 用户故事阶段**必须**标注 Story 标签 `[US1]`、`[US2]` 等
- Polish 阶段**不需要** Story 标签

#### 任务映射规则

```text
每个用户故事内部的任务顺序:
  Tests（如果请求了测试）→ Models → Services → Endpoints → Integration

本案例（无测试）:
  Implementation Only → T001(trim)、T002(uppercase)、T003(lowercase)
```

### 3.4 第四步：任务格式规范

**严格的 Checklist 格式**:

```text
- [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
  │   │    │   │      └─ 描述: 具体做什么 + 在哪里做（必须包含文件路径）
  │   │    │   └─ [Story] 标签: [US1]、[US2]...（用户故事阶段必须）
  │   │    └─ [P] 标记: 仅当任务可并行时标注（不同文件、无依赖）
  │   └─ Task ID: T001、T002...（执行顺序编号）
  └─ Checkbox: - [ ]（未执行）/ - [x]（已完成）
```

**正确 vs 错误示例**:

| 格式                                                                 | 是否正确 | 说明                  |
| -------------------------------------------------------------------- | -------- | --------------------- |
| `- [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts`     | ✅ 正确  | 完整格式              |
| `- [ ] T005 [P] Implement auth middleware in src/middleware/auth.py` | ✅ 正确  | 含 [P] 并行标记       |
| `- [ ] T012 [P] [US1] Create User model in src/models/user.py`       | ✅ 正确  | 含 [P] 和 [US1]       |
| `- [ ] Create User model`                                            | ❌ 错误  | 缺少 ID 和 Story 标签 |
| `T001 [US1] Create model`                                            | ❌ 错误  | 缺少 checkbox         |
| `- [ ] [US1] Create User model`                                      | ❌ 错误  | 缺少 Task ID          |
| `- [ ] T001 [US1] Create model`                                      | ❌ 错误  | 缺少文件路径          |

### 3.5 第五步：依赖关系分析

#### Phase 依赖

```text
Setup → Foundational → US1 → US2 → US3 → Polish
   │         │          │     │     │      │
   └─────────┴──────────┴─────┴─────┴──────┘
              │
              ▼
         必须完成前一 Phase，才能进入下一 Phase
```

**本案例示例**:

```text
Phase 1: User Story 1 (trim)
  └── T001 [US1] 实现 trim 函数...

Phase 2: User Story 2 (uppercase)
  └── T002 [US2] 实现 uppercase 函数...
  （可在 Phase 1 后或并行进行——同一文件追加更稳妥）

Phase 3: User Story 3 (lowercase)
  └── T003 [US3] 实现 lowercase 函数...

Phase 4: Polish
  ├── T004 确保 JSDoc 完整
  └── T005 确保导入排序
```

#### 并行机会识别

| 场景             | 是否可并行  | 原因                                         |
| ---------------- | ----------- | -------------------------------------------- |
| 不同文件的任务   | ✅ 可并行   | T001 写 string.ts，T002 写 config.ts         |
| 同一文件追加     | ⚠️ 建议串行 | T001 创建 string.ts，T002 在同一文件追加函数 |
| 有依赖关系的任务 | ❌ 必须串行 | T002 依赖 T001 创建的目录结构                |

**本案例的并行策略**:

```text
理论: trim/uppercase/lowercase 三个函数可并行（不同文件时）
实际: 位于同一文件 string.ts，建议串行执行 T001 → T002 → T003
```

---

## 四、任务生成规则详解

### 4.1 从 User Stories 生成任务（PRIMARY）

```text
spec.md 中的每个用户故事 → 对应一个 Phase

用户故事结构:
  ### User Story 1 - 去除字符串首尾空格 (Priority: P1)
  作为前端开发者，我需要 trim 函数...
  **Acceptance Scenarios**:
  1. Given "  hello  ", When 调用 trim, Then 返回 "hello"

生成的任务:
  ## Phase 1: User Story 1 - 去除字符串首尾空格 (Priority: P1) 🎯 MVP
  **Goal**: 实现 trim 函数，支持 string | null | undefined 输入...
  **Independent Test**: 在 IDE 中导入并调用 trim('  hello  ')...

  ### Implementation for User Story 1
  - [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
```

**任务内容推导**:

- 从用户故事的"Goal"推导任务目标
- 从"Acceptance Scenarios"推导独立测试标准
- 从 plan.md 的"Project Structure"推导文件路径
- 从 data-model.md 推导类型签名（在任务描述中隐含）

### 4.2 从 Contracts 生成任务（如存在）

```text
contracts/ 目录下的接口定义 → 对应的契约测试或实现任务

每个接口契约 → 一个 [P] 标记的任务（可与其他任务并行）
```

**本案例**: 无 contracts 目录（纯前端内部工具，无外部接口）。

### 4.3 从 Data Model 生成任务

```text
data-model.md 中的实体 → 模型创建任务

如果实体服务于多个故事:
  → 放入最早的 Story Phase 或 Setup Phase
```

**本案例**: data-model.md 定义的是函数接口而非实体，任务直接映射到函数实现。

### 4.4 Polish Phase 生成规则

```text
在**所有用户故事实现完成后**执行:

- 代码风格一致性检查
- 注释完整性检查（JSDoc）
- 导入排序检查
- 类型检查
- 性能优化（如适用）
- 文档更新
```

**本案例的 Polish 任务**:

```text
- [ ] T004 确保 apps/web/src/utils/string.ts 中所有函数包含完整 JSDoc 注释
- [ ] T005 确保导入排序遵循项目规范（@/ 别名）
```

---

## 五、文档结构总览

### 5.1 tasks.md 的完整结构

```markdown
# Tasks: [特性名称]

**Input**: Design documents from `specs/XXX/`
**Prerequisites**: plan.md, spec.md, data-model.md
**Tests**: [有/无（已通过 clarify 确认）]
**Organization**: 任务按用户故事分组

---

## Phase 1: User Story 1 - [标题] (Priority: P1) 🎯 MVP

**Goal**: [这个 Phase 要达成什么目标]
**Independent Test**: [如何独立验证这个 Phase 已完成]

### Implementation for User Story 1

- [ ] T001 [US1] [任务描述] 于 [文件路径]

**Checkpoint**: [完成后的验证点]

---

## Phase 2: User Story 2 - [标题] (Priority: P1)

...

## Phase N: Polish & Cross-Cutting Concerns

...

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1**: 可直接开始
- **User Story 2**: 可在 Phase 1 后或并行进行
- **Polish**: 所有函数实现完成后执行

### User Story Dependencies

- 三个用户故事之间**无依赖**，可独立实现
- 由于位于同一文件，实际操作中按顺序追加更稳妥

### Parallel Opportunities

- 理论上三个函数可并行（不同文件时）
- 实际位于同一文件，建议顺序执行

---

## Implementation Strategy

### MVP First

1. T001: 创建文件并实现核心功能 → 立即可用
2. T002: 追加功能 → 立即可用
3. T003: 追加功能 → 立即可用
4. T004 + T005: 格式和注释检查

### 增量交付

- 每完成一个函数，文件即可被其他模块导入使用
- 不需要等待所有任务完成才可用

---

## Notes

- 所有任务操作同一文件 `apps/web/src/utils/string.ts`
- 每个函数需包含：JSDoc 注释、显式类型声明、空值安全处理
- 导出方式为命名导出：`export function`
```

### 5.2 与其他文档的关系

```text
plan.md（输入）
  ├── Technical Context    → 决定技术栈和约束
  ├── Project Structure    → 决定文件路径
  └── Summary              → 决定特性概述
      │
      ▼
spec.md（输入）
  ├── User Stories         → 决定 Phase 分组
  ├── Priority (P1/P2/P3)  → 决定 Phase 排序
  ├── Acceptance Scenarios → 决定 Independent Test
  └── Edge Cases           → 决定边界处理任务
      │
      ▼
data-model.md（输入，如存在）
  ├── 接口签名             → 隐含在任务描述中
  └── 实体定义             → 生成模型创建任务
      │
      ▼
tasks.md（输出）
  ├── Phase 分组           ← 来自 User Stories
  ├── 任务列表             ← 来自功能拆解
  ├── 依赖关系             ← 来自文件分析和故事依赖
  └── 执行策略             ← 来自 MVP 和增量交付原则
```

---

## 六、实战案例：string-utils 的 Tasks 生成记录

### 6.1 输入文档状态

**plan.md 提供**:

- 技术栈: TypeScript 5.5.3，零依赖
- 文件位置: `apps/web/src/utils/string.ts`
- 导出方式: 命名导出
- 约束: 纯函数、空值安全处理

**spec.md 提供**:

- US1: 去除字符串首尾空格（P1）
- US2: 字符串转为大写（P1）
- US3: 字符串转为小写（P1）
- Edge Cases: null/undefined 返回空字符串
- Assumptions: 不包含单元测试

**data-model.md 提供**:

- `trim(str: string | null | undefined): string`
- `uppercase(str: string | null | undefined): string`
- `lowercase(str: string | null | undefined): string`

### 6.2 任务生成过程

**Step 1: 确定 Phase 数量**

```text
3 个用户故事 + 1 个 Polish Phase = 4 个 Phase
（无 Setup/Foundational，因为不需要初始化项目结构）
```

**Step 2: 为每个用户故事生成任务**

```text
US1 (trim):
  Goal: 实现 trim 函数，支持 string | null | undefined，返回去除首尾空白后的字符串
  Test: 在 IDE 中调用 trim('  hello  ') 验证返回 'hello'
  File: apps/web/src/utils/string.ts
  Task: - [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts

US2 (uppercase):
  Goal: 实现 uppercase 函数...
  Task: - [ ] T002 [US2] 实现 uppercase 函数于 apps/web/src/utils/string.ts

US3 (lowercase):
  Goal: 实现 lowercase 函数...
  Task: - [ ] T003 [US3] 实现 lowercase 函数于 apps/web/src/utils/string.ts
```

**Step 3: 生成 Polish 任务**

```text
从 plan.md 的质量标准推导:
  - "完整类型声明" → 已由 data-model.md 保障
  - "JSDoc 注释" → T004: 确保 JSDoc 完整
  - "导入排序" → T005: 确保导入排序遵循规范
```

**Step 4: 分析依赖关系**

```text
Phase 依赖:
  US1 → US2 → US3 → Polish

文件协调:
  T001/T002/T003 都操作 string.ts → 建议串行

用户故事依赖:
  US1/US2/US3 无功能依赖 → 理论上可独立实现
```

**Step 5: 生成执行策略**

```text
MVP First:
  T001: 创建 string.ts 并实现 trim → 立即可用
  T002: 追加 uppercase → 立即可用
  T003: 追加 lowercase → 立即可用
  T004/T005: 格式和注释检查
```

### 6.3 最终 tasks.md

```markdown
# Tasks: 前端字符串工具函数

**Input**: Design documents from `specs/001-string-utils/`
**Prerequisites**: plan.md, spec.md, data-model.md
**Tests**: 无（已通过 clarify 确认不编写单元测试）
**Organization**: 任务按用户故事分组。所有函数位于同一文件，可在同一 phase 内完成。

---

## Phase 1: User Story 1 - 去除字符串首尾空格 (Priority: P1) 🎯 MVP

**Goal**: 实现 trim 函数，支持 string | null | undefined 输入，返回去除首尾空白后的字符串

**Independent Test**: 在 IDE 中导入并调用 trim(' hello ')，验证返回 'hello'

### Implementation for User Story 1

- [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts

**Checkpoint**: trim 函数可在 IDE 中直接导入使用

---

## Phase 2: User Story 2 - 字符串转为大写 (Priority: P1)

...

- [ ] T002 [US2] 实现 uppercase 函数于 apps/web/src/utils/string.ts

## Phase 3: User Story 3 - 字符串转为小写 (Priority: P1)

...

- [ ] T003 [US3] 实现 lowercase 函数于 apps/web/src/utils/string.ts

## Phase 4: Polish & Cross-Cutting Concerns

- [ ] T004 确保 apps/web/src/utils/string.ts 中所有函数包含完整 JSDoc 注释
- [ ] T005 确保导入排序遵循项目规范（@/ 别名）

---

## Dependencies & Execution Order

### Phase Dependencies

- US1: 可直接开始，创建 string.ts 文件并实现 trim
- US2: 可在 Phase 1 后或并行进行（同一文件追加函数）
- US3: 可在 Phase 2 后或并行进行
- Polish: 所有函数实现完成后执行

### Parallel Opportunities

- 理论上三个函数可并行（不同文件时）
- 实际位于同一文件 string.ts，建议顺序执行 T001 → T002 → T003

---

## Implementation Strategy

### MVP First

1. T001: 创建 string.ts 并实现 trim → 立即可用
2. T002: 追加 uppercase → 立即可用
3. T003: 追加 lowercase → 立即可用
4. T004 + T005: 格式和注释检查

### 增量交付

- 每完成一个函数，文件即可被其他模块导入使用
- 不需要等待所有任务完成才可用
```

---

## 七、常见场景与处理

### 7.1 场景一：有单元测试

```text
spec.md 中明确需要测试:

## Phase 1: User Story 1
### Tests for User Story 1
- [ ] T001 [P] [US1] 编写 trim 函数的单元测试于 src/utils/__tests__/string.test.ts

### Implementation for User Story 1
- [ ] T002 [US1] 实现 trim 函数于 src/utils/string.ts
```

**规则**: Tests 任务标记 `[P]`（可并行），并且放在 Implementation **之前**，遵循 TDD 原则。

### 7.2 场景二：有数据模型

```text
data-model.md 中定义了 User 实体:

## Phase 1: Setup
- [ ] T001 创建 User 模型于 src/models/user.ts

## Phase 2: User Story 1
- [ ] T002 [US1] 实现 UserService 于 src/services/user_service.ts
```

**规则**: 共享实体放入 Setup 或 Foundational Phase，确保在需要它的 Story 之前完成。

### 7.3 场景三：多文件可并行

```text
## Phase 1: User Story 1
- [ ] T001 [P] [US1] 实现前端组件于 src/components/UserForm.tsx
- [ ] T002 [P] [US1] 实现 API 接口于 src/api/user.ts
```

**规则**: 不同文件的任务标记 `[P]`，表示可以并行执行。

---

## 八、Tasks 与 Implement 的衔接

### 8.1 Implement 如何读取 Tasks

```text
/speckit-implement 执行时:

1. 读取 tasks.md
2. 按 Phase 顺序遍历:
     ├── 对每个未完成的任务（- [ ]）:
     │     ├── 解析任务描述 → 确定目标文件
     │     ├── 查询 plan.md → 获取技术约束
     │     ├── 查询 data-model.md → 获取类型定义
     │     └── 生成/修改代码 → 标记任务完成 [x]
     └── Phase 完成后 → Checkpoint 验证

3. 所有 Phase 完成后 → Completion Validation
```

### 8.2 任务标记的状态流转

```text
初始状态:     - [ ] T001 [US1] 实现 trim 函数于...
                    │
                    ▼
Implement 执行: AI 生成 trim 函数代码
                    │
                    ▼
完成状态:     - [x] T001 [US1] 实现 trim 函数于...
```

**重要**: AI 会自动将已完成的任务标记为 `[x]`，用户无需手动修改。

---

## 九、FAQ

### Q1: 我可以手动编辑 tasks.md 吗？

**A**: 可以。`tasks.md` 是文本文件，你可以：

- 添加新任务（注意保持格式规范）
- 修改任务描述（但不要改变已执行任务的含义）
- 调整任务顺序（注意依赖关系）

但如果做了较大改动，建议重新运行 `/speckit-tasks` 保持一致性。

### Q2: tasks.md 和 plan.md 有什么区别？

**A**:

| 维度     | plan.md                      | tasks.md                       |
| -------- | ---------------------------- | ------------------------------ |
| 内容     | 技术方案、架构决策、项目结构 | 可执行的任务清单               |
| 读者     | 开发者、架构师               | 开发者、AI（Implement 阶段）   |
| 格式     | 自由 markdown                | 严格的 checklist 格式          |
| 更新时机 | spec 变更后重新生成          | plan 或 spec 变更后重新生成    |
| 作用     | 回答"怎么做"                 | 回答"具体做哪些事、按什么顺序" |

### Q3: 为什么任务要按用户故事分组？

**A**: 三个原因：

1. **独立测试**: 每个故事可以单独验证是否完成
2. **增量交付**: 做完 US1 就能用，不用等全部完成
3. **并行开发**: 不同故事可以分配给不同开发者

### Q4: `[P]` 标记是什么意思？

**A**: `[P]` = Parallelizable（可并行）。表示这个任务与其他 `[P]` 任务没有依赖关系，可以同时执行。通常用于操作不同文件的任务。

### Q5: 如果 Implement 阶段发现 tasks.md 有遗漏怎么办？

**A**: 有两种处理方式：

1. **直接补充**: 如果遗漏的是简单的 Polish 任务（如"加注释"），可以直接在代码中完成，然后手动在 tasks.md 中补标记 `[x]`
2. **重新生成**: 如果遗漏的是核心功能任务，建议更新 spec.md → 重新 plan → 重新 tasks

### Q6: tasks.md 可以跳过某些任务吗？

**A**: 可以。在 Implement 阶段，你可以明确告诉 AI"只执行 T001 和 T002"。但建议保持 tasks.md 的完整性，作为完整的任务记录。

---

## 十、总结

### Tasks 阶段的核心特征

| 特征           | 说明                                                      |
| -------------- | --------------------------------------------------------- |
| **桥梁作用**   | 连接 Plan（技术方案）和 Implement（代码实现）             |
| **严格格式**   | 必须遵守 `- [ ] T001 [US1] 描述 + 路径` 的 checklist 格式 |
| **按故事分组** | 每个用户故事一个 Phase，便于独立测试和增量交付            |
| **依赖明确**   | Phase 之间有依赖顺序，同 Phase 内可标记 `[P]` 并行        |
| **MVP 优先**   | 核心故事在前，Polish 在后，确保先可用、后完善             |

### Tasks 与上下游的关系

```text
plan.md（技术方案）
  ├── 提供: 文件路径、技术栈、项目结构
  │
spec.md（需求规格）
  ├── 提供: 用户故事、优先级、验收标准、边界情况
  │
data-model.md（数据模型）
  ├── 提供: 接口签名、实体定义
  │
  ▼
tasks.md（任务清单）
  ├── 输出: 按 Phase 组织的可执行任务
  │
  ▼
Implement（代码实现）
  └── 读取: tasks.md 的执行顺序和任务描述
```

### Tasks 的执行哲学

> **"把大目标拆成小任务，把复杂方案变成可执行的清单"**

一个技术方案（plan.md）可能涉及数十个文件和多个模块，直接让 AI "去实现"很容易遗漏步骤。Tasks 阶段强制将方案拆解为：

- **做什么**（任务描述）
- **在哪里做**（文件路径）
- **按什么顺序做**（Phase 和依赖关系）
- **怎么算完成**（Independent Test 和 Checkpoint）

这让 Implement 阶段像"打勾清单"一样简单明了，大大降低遗漏和返工的风险。

---

_本文档详细解析了 `/speckit-tasks` 命令的完整执行流程、任务生成规则、格式规范和与上下游的衔接机制。_
