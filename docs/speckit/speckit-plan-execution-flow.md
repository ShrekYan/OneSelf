# Speckit Plan 执行机制详解

> **目标读者**: 想了解 `/speckit-plan` 命令内部执行机制的新手
> **文档性质**: 技术规划阶段技术手册
> **核心问题**: 需求规格如何转化为技术实现方案？
> **权威来源**: 项目内置 Skill 定义（`.claude/skills/speckit-plan`）

---

## 一、Plan 阶段定位

```
Specify → Clarify → [Plan] → Tasks → Implement
                     ↑
                   你在这里
```

**核心职责**: `Plan` 是连接**需求规格**和**代码实现**的技术桥梁。它将 `spec.md` 中的用户故事和功能需求转化为技术实现方案（`plan.md`），并生成配套的技术设计文档（`research.md`、`data-model.md`、`quickstart.md`）。

**类比**:

- `spec.md` = 业主需求书（"我要一栋三室两厅的房子"）
- `plan.md` = 建筑结构设计图（"用钢筋混凝土框架，层高 3 米，南北通透"）
- `research.md` = 材料选型报告（"为什么用钢筋而不是木材"）
- `data-model.md` = 户型设计图（"客厅 30 平米，主卧带独立卫生间"）
- `quickstart.md` = 入住指南（"这是门禁卡，这是水电开关位置"）

**关键原则**:

- `plan.md` 是 **派生文件（Derived Document）**，`spec.md` 变了必须重新生成
- 回答 **HOW**（怎么做），不重复 **WHAT**（做什么）
- 所有技术决策必须有依据，记录在 `research.md` 中

---

## 二、执行前准备（Pre-Execution Checks）

### 2.1 Extension Hooks 检查

```text
检查 .specify/extensions.yml 是否存在
    │
    ├── 不存在 → 静默跳过，继续执行
    │
    └── 存在 → 读取 hooks.before_plan 配置
          │
          ├── 筛选：跳过 enabled: false 的钩子
          ├── 筛选：跳过有非空 condition 的钩子（由 HookExecutor 处理）
          └── 对每个可执行钩子：
                ├─ optional: true → 显示可选钩子，等用户决定是否执行
                └─ optional: false → 自动执行，等待结果后再继续
```

**钩子命令转换规则**: `speckit.git.commit` → `/speckit-git-commit`

### 2.2 Setup 脚本执行

**命令**: `.specify/scripts/bash/setup-plan.sh --json`

**输出字段**:

| 字段           | 含义                    | 示例                                  |
| -------------- | ----------------------- | ------------------------------------- |
| `FEATURE_SPEC` | 当前特性的 spec.md 路径 | `specs/001-string-utils/spec.md`      |
| `IMPL_PLAN`    | 实现计划模板路径        | `.specify/templates/plan-template.md` |
| `SPECS_DIR`    | 特性目录根目录          | `specs/`                              |
| `BRANCH`       | 当前 Git 分支名         | `20260319-string-utils`               |

**作用**: 定位当前特性的规格文件、加载实现计划模板、确认工作分支。

### 2.3 加载上下文

```text
读取 FEATURE_SPEC（spec.md）
    │
    ├── 提取：用户故事、功能需求、验收标准、边界情况
    └── 验证：spec 是否完整，是否有未解决的 NEEDS CLARIFICATION
         │
         ├── 有未解决的 NEEDS CLARIFICATION → 报错，要求先 clarify
         └── 完整 → 继续

读取 .specify/memory/constitution.md（如存在）
    │
    └── 提取：项目治理约束、技术规范、架构原则
```

---

## 三、核心执行流程（Execution Flow）

Plan 阶段的执行分为两大阶段：**Phase 0（调研）**和 **Phase 1（设计）**。

```text
Phase 0: Outline & Research
    │
    ├── 提取 Technical Context 中的未知项
    ├── 为每个未知项生成研究任务
    ├── 执行技术调研
    └── 输出: research.md
    │
    ▼
Phase 1: Design & Contracts
    │
    ├── 提取实体定义 → data-model.md
    ├── 定义接口契约 → contracts/（如适用）
    ├── 生成使用指南 → quickstart.md
    └── 更新 Agent 上下文 → CLAUDE.md
    │
    ▼
Phase 2: 生成 plan.md（主文档）
    │
    └── 汇总所有设计决策到 plan.md
```

### 3.1 Phase 0: Outline & Research（调研阶段）

#### 提取未知项（Unknowns）

AI 从 `spec.md` 和项目上下文中提取所有"需要调研才能确定"的技术问题：

```text
扫描 spec.md:
    ├── 技术栈未指定 → "Research 最佳技术栈"
    ├── 依赖未确定 → "Research 第三方库选择"
    ├── 集成方式未确定 → "Research 集成模式"
    ├── 性能目标未确定 → "Research 性能基准"
    └── [NEEDS CLARIFICATION] 残留 → 报错（必须先 clarify）
```

**本案例提取的未知项**:

| 未知项                       | 研究任务                                   |
| ---------------------------- | ------------------------------------------ |
| 字符串工具函数的最佳实现方式 | Research: 原生方法 vs lodash vs 自定义实现 |
| null/undefined 空值安全处理  | Research: `??` vs `\|\|` vs 其他方案       |
| 导出方式选择                 | Research: 命名导出 vs 默认导出             |
| 类型声明策略                 | Research: 显式声明 vs 类型推断             |

#### 执行技术调研

对每个未知项，AI 基于项目上下文和通用最佳实践做出决策：

```text
调研任务 1: "字符串工具函数的最佳实现方式"
    │
    ├── 分析项目现有代码:
    │     └── 检查 apps/web/src/utils/ 已有模块（security.ts、secure-storage.ts）
    │         └── 发现: 现有 utils 均为零依赖设计
    │
    ├── 评估替代方案:
    │     ├── 方案 A: 原生 String.prototype 方法
    │     │     ├── 优点: 零依赖、浏览器兼容性好、性能最优
    │     │     └── 缺点: 无
    │     ├── 方案 B: lodash
    │     │     ├── 优点: 功能更丰富
    │     │     └── 缺点: 增加包体积、功能冗余
    │     └── 方案 C: 自定义正则实现
    │         ├── 优点: 可控
    │         └── 缺点: 代码冗余、无性能优势
    │
    └── 决策: 使用原生方法（方案 A）
        理由: 与现有 utils 风格一致、零依赖、性能最优
```

#### 输出 research.md

```markdown
# Research: [特性名称] 实现方案

## 研究问题

1. [问题 1]
2. [问题 2]

## 研究发现

### 1. [决策主题]

**决策**: [选择了什么]
**理由**:

- [理由 1]
- [理由 2]
  **替代方案考虑**:
- [方案 A]: [为什么拒绝]
- [方案 B]: [为什么拒绝]

## 结论

[总结性陈述]
```

**本案例的 research.md 核心内容**:

```markdown
# Research: 前端字符串工具函数实现方案

## 研究发现

### 1. 实现方式选择

**决策**: 直接使用 JavaScript 原生 String.prototype 方法封装
**理由**:

- trim()、toUpperCase()、toLowerCase() 均为 ES5+ 标准方法
- 无需引入 lodash，保持零依赖
- 原生方法经浏览器引擎高度优化
- 项目现有 utils 模块均为零依赖设计
  **替代方案考虑**:
- lodash: 功能冗余，增加包体积，拒绝
- 自定义正则: 代码冗余，无性能优势，拒绝

### 2. 空值安全处理策略

**决策**: 函数内部使用 str ?? ''（空值合并运算符）
**理由**:

- ?? 仅对 null 和 undefined 生效，不会误处理空字符串 ''
- 相比 || 更安全，避免 falsy 值被错误替换
  **替代方案考虑**:
- str || '': 会错误地将空字符串、0、false 也替换，拒绝
- throw Error: 与 spec 要求的"返回空字符串"冲突，拒绝

### 3. 导出方式

**决策**: 命名导出（named export）
**理由**:

- 与现有 utils 模块一致（security.ts 使用 export function）
- 便于 tree-shaking，按需引用
```

**research.md 的核心价值**: 它不仅告诉你"选了什么"，更重要的是"为什么这样选"和"拒绝了什么"。这是团队知识沉淀的关键文档。

### 3.2 Phase 1: Design & Contracts（设计阶段）

#### 提取实体定义 → data-model.md

从 `spec.md` 的功能需求和用户故事中提取数据结构定义：

```text
spec.md 中的实体:
    ├── "输入字符串" → 定义参数类型
    ├── "输出字符串" → 定义返回值类型
    └── 关系: 输入 → 处理 → 输出

生成的 data-model.md:
    ├── 每个函数一个接口定义
    ├── 输入约束（类型、范围）
    ├── 输出定义（类型、值）
    └── 不变式（Invariants）
```

**本案例的 data-model.md**:

````markdown
# Data Model: 前端字符串工具函数

## 函数接口

### trim

```typescript
export function trim(str: string | null | undefined): string;
```
````

**输入约束**: 类型: string | null | undefined
**输出**: 类型: string（始终返回字符串）

### uppercase

```typescript
export function uppercase(str: string | null | undefined): string;
```

### lowercase

```typescript
export function lowercase(str: string | null | undefined): string;
```

## 不变式

- 所有函数均为纯函数：相同输入始终产生相同输出
- 所有函数不产生副作用
- 所有函数返回值类型始终为 string，永不返回 null 或 undefined

````

**data-model.md 的本质**: 它是**代码的合同**。开发者看了就知道函数该怎么写，测试人员看了就知道该怎么测。

#### 定义接口契约 → contracts/（如适用）

```text
如果项目有外部接口（API、CLI、UI 组件等）:
    ├── 识别项目暴露给用户的接口
    ├── 确定契约格式（OpenAPI、TypeScript 类型、CLI 参数等）
    └── 在 contracts/ 目录下生成契约文件

如果项目纯内部（如本案例的工具函数）:
    └── 跳过此步骤（contracts/ 标记为 N/A）
````

**本案例**: 纯前端内部工具函数，无外部接口，跳过 contracts。

#### 生成使用指南 → quickstart.md

```text
基于 data-model.md 和 spec.md 的使用场景:
    ├── 编写导入示例
    ├── 编写每个函数的使用示例
    ├── 编写边界情况示例（null/undefined 等）
    └── 编写类型提示说明
```

**本案例的 quickstart.md**:

````markdown
# Quickstart: 字符串工具函数

## 导入

```typescript
import { trim, uppercase, lowercase } from '@/utils/string';
```
````

## 使用示例

### trim

```typescript
trim('  hello world  '); // => 'hello world'
trim(null); // => ''
```

### uppercase

```typescript
uppercase('Hello World'); // => 'HELLO WORLD'
uppercase(null); // => ''
```

````

**quickstart.md 的读者**: 不是写代码的人，而是**使用**这些函数的人。

#### 更新 Agent 上下文 → CLAUDE.md

```text
在 CLAUDE.md 的 <!-- SPECKIT START --> 和 <!-- SPECKIT END --> 标记之间:
    └── 更新 plan 引用路径，指向新生成的 plan.md
````

**作用**: 让 Claude Code 的 Agent 在后续对话中能自动加载当前特性的 plan.md。

### 3.3 生成 plan.md（主文档）

#### 模板结构

```markdown
# Implementation Plan: [特性名称]

**Branch**: [分支名] | **Date**: [日期] | **Spec**: [spec.md 链接]
**Input**: Feature specification from `specs/XXX/spec.md`

## Summary

[一句话总结]

## Technical Context

**Language/Version**: [语言/版本]
**Primary Dependencies**: [主要依赖]
**Storage**: [存储方案]
**Testing**: [测试策略]
**Target Platform**: [目标平台]
**Project Type**: [项目类型]
**Performance Goals**: [性能目标]
**Constraints**: [约束条件]
**Scale/Scope**: [规模/范围]

## Constitution Check

_GATE: Must pass before Phase 0 research_
[项目治理约束检查结果]

## Project Structure

### Documentation (this feature)

[特性目录下的文档结构]

### Source Code (repository root)

[项目源码结构]

**Structure Decision**: [结构决策说明]

## Complexity Tracking

[复杂度评估（可选）]
```

#### 填充内容

**Summary（总结）**:

```text
从 spec.md 的输入和 plan.md 的技术决策中提取一句话:

"在 apps/web/src/utils 目录下新增 string.ts 模块，提供 3 个纯 TypeScript
字符串工具函数：trim、uppercase、lowercase。所有函数均为纯函数，具备完整
类型声明，采用命名导出方式，与现有 utils 模块风格保持一致。"
```

**Technical Context（技术上下文）**:

```text
从 spec.md 的需求和 research.md 的决策中提取:

- Language/Version: TypeScript 5.5.3（从项目配置读取）
- Primary Dependencies: 无外部依赖（从 research.md 决策）
- Storage: N/A（纯函数，无持久化）
- Testing: 无单元测试（从 spec.md Assumptions）
- Target Platform: 浏览器环境（H5 移动端）
- Project Type: web-application 前端内部工具库
- Performance Goals: 单次调用耗时 < 1ms
- Constraints: 纯函数无副作用；参数 string | null | undefined
- Scale/Scope: 3 个函数，约 30 行实现代码
```

**Constitution Check（架构约束检查）**:

```text
读取 .specify/memory/constitution.md（如存在）
    │
    ├── 检查项目治理约束:
    │     ├── 技术栈约束（如必须用 React 19）
    │     ├── 安全约束（如必须用 HttpOnly Cookie）
    │     └── 架构约束（如必须分 Controller/Service/Module）
    │
    └── 评估当前特性是否满足:
          ├── 满足 → "Constitution Check 通过，无违规项"
          └── 不满足 → ERROR，要求调整方案或解释原因
```

**本案例结果**: Constitution 文件为初始模板，未配置具体约束。本特性满足通用原则（单一职责、纯函数、自包含），Constitution Check 通过。

**Project Structure（项目结构）**:

```text
从 plan.md 的技术决策和 spec.md 的需求中推导:

Documentation:
    specs/001-string-utils/
    ├── plan.md              # This file
    ├── research.md          # Phase 0 output
    ├── data-model.md        # Phase 1 output
    ├── quickstart.md        # Phase 1 output
    └── contracts/           # N/A - 无外部接口

Source Code:
    apps/web/src/utils/
    ├── string.ts            # 新增
    ├── security.ts          # 现有
    └── secure-storage.ts    # 现有
```

---

## 四、Constitution Check 详解

### 4.1 什么是 Constitution

`Constitution`（宪法/治理文件）是项目的**技术治理约束**，定义了所有特性必须遵守的架构原则和技术规范。

**文件位置**: `.specify/memory/constitution.md`

### 4.2 检查时机

```text
Phase 0 之前: 初筛，确保不违反硬性约束
Phase 1 之后: 复筛，确保设计方案不违反约束
```

### 4.3 检查内容（示例）

```text
Constitution 可能包含的约束:
    ├── 认证安全: HttpOnly Cookie、Argon2id 密码加密
    ├── 数据库规范: Prisma PascalCase 命名、BigInt 时间戳
    ├── 微服务边界: auth-service / backend / log-service 职责划分
    ├── 前端技术栈: React 19 + MobX + Ant Design Mobile
    ├── 状态管理: MobX 双轨架构 + useObserver Hook
    └── 异常处理: 三层过滤器、统一响应格式
```

### 4.4 本案例的检查结果

```text
Constitution 文件为初始模板，未配置具体约束。

本特性满足以下通用原则:
- 单一职责: 每个函数只做一件事
- 纯函数: 无副作用，输入相同则输出相同
- 自包含: 不依赖外部状态或全局变量
- 防御式编程: 对 null/undefined 做安全处理

结论: Constitution Check 通过，无违规项。
```

---

## 五、生成的文件体系

### 5.1 文件清单

| 文件              | 路径                      | 作用                   | 生成阶段 | 是否派生             |
| ----------------- | ------------------------- | ---------------------- | -------- | -------------------- |
| **plan.md**       | `specs/XXX/plan.md`       | 技术方案总览           | Phase 2  | ✅ 派生（from spec） |
| **research.md**   | `specs/XXX/research.md`   | 技术调研与决策记录     | Phase 0  | ✅ 派生（from spec） |
| **data-model.md** | `specs/XXX/data-model.md` | 接口类型契约           | Phase 1  | ✅ 派生（from spec） |
| **quickstart.md** | `specs/XXX/quickstart.md` | 使用者快速开始指南     | Phase 1  | ✅ 派生（from spec） |
| **contracts/**    | `specs/XXX/contracts/`    | 外部接口契约（如适用） | Phase 1  | ✅ 派生（from spec） |

### 5.2 文件关系图

```text
spec.md（输入）
    │
    ├── Phase 0: Research
    │     └── research.md（技术调研）
    │
    ├── Phase 1: Design
    │     ├── data-model.md（数据模型/接口定义）
    │     ├── quickstart.md（使用指南）
    │     └── contracts/（外部契约，如适用）
    │
    └── Phase 2: Summary
          └── plan.md（汇总所有技术决策）
```

### 5.3 plan.md 与其他文档的关系

```text
plan.md（主文档）
    ├── 引用 research.md: "技术决策详见 research.md"
    ├── 引用 data-model.md: "接口定义详见 data-model.md"
    ├── 引用 quickstart.md: "使用指南详见 quickstart.md"
    └── 引用 spec.md: "需求规格详见 spec.md"

research.md（配套）
    └── 支撑 plan.md 中的技术决策

data-model.md（配套）
    └── 支撑 plan.md 中的类型定义和接口设计
```

---

## 六、Plan 与上下游的衔接

### 6.1 上游输入：spec.md

```text
spec.md 提供:
    ├── User Stories → 确定功能范围
    ├── Requirements → 确定技术约束
    ├── Edge Cases → 确定边界处理策略
    ├── Success Criteria → 确定验收标准
    └── Assumptions → 确定前提条件
```

### 6.2 下游输出：Tasks 阶段

```text
plan.md 被 Tasks 阶段读取:
    ├── Project Structure → 确定文件路径
    ├── Technical Context → 确定技术栈和约束
    └── Summary → 确定特性概述
```

### 6.3 重新生成规则

```text
spec.md 发生变化:
    │
    ├── 功能变更（增删用户故事）
    ├── 边界变更（修改 Edge Cases）
    ├── 验收标准变更（修改 Success Criteria）
    └── 假设条件变更（修改 Assumptions）
    │
    └── 必须重新运行 /speckit-plan
         │
         └── 重新生成:
               ├── plan.md（更新技术方案）
               ├── research.md（重新评估技术决策）
               ├── data-model.md（更新接口定义）
               └── quickstart.md（更新使用指南）
```

**本案例中的重新生成**: 由于 spec.md 经过 4 次 Clarify，`plan.md` 被重新生成了 4 次。

---

## 七、实战案例：string-utils 的 Plan 执行记录

### 7.1 执行前输入

**spec.md 状态**（经过 4 次 Clarify 后的最终版本）:

```text
User Stories:
  - US1: 去除字符串首尾空格（P1）
  - US2: 字符串转为大写（P1）
  - US3: 字符串转为小写（P1）

Edge Cases:
  - 传入 null 或 undefined 时返回空字符串
  - 输入仅包含空格时 trim 返回空字符串

Requirements:
  - FR-001: 提供 trim 函数
  - FR-002: 提供 uppercase 函数
  - FR-003: 提供 lowercase 函数
  - FR-004: 完整类型声明

Assumptions:
  - 函数需对 null/undefined 做安全处理
  - 不包含单元测试
  - 无额外验收步骤
```

### 7.2 Phase 0: Research 执行

**提取未知项**:

| #   | 未知项   | 调研结论                                     |
| --- | -------- | -------------------------------------------- |
| 1   | 实现方式 | 原生方法（零依赖，与现有 utils 风格一致）    |
| 2   | 空值处理 | `??` 空值合并运算符（仅处理 null/undefined） |
| 3   | 类型声明 | 显式函数声明 + JSDoc（符合项目规范）         |
| 4   | 导出方式 | 命名导出（与 security.ts 一致）              |

**输出**: `research.md`

### 7.3 Phase 1: Design 执行

**生成 data-model.md**:

```typescript
// 3 个函数的完整类型签名
export function trim(str: string | null | undefined): string;
export function uppercase(str: string | null | undefined): string;
export function lowercase(str: string | null | undefined): string;
```

**生成 quickstart.md**:

```markdown
# Quickstart: 字符串工具函数

## 导入

import { trim, uppercase, lowercase } from '@/utils/string';

## trim

trim(' hello '); // => 'hello'
trim(null); // => ''
```

**跳过 contracts/**: 纯内部工具，无外部接口。

### 7.4 Phase 2: plan.md 汇总

**生成的 plan.md 核心内容**:

```markdown
# Implementation Plan: 前端字符串工具函数

**Branch**: `[20260320-string-utils]` | **Date**: 2026-05-16

## Summary

在 apps/web/src/utils 目录下新增 string.ts 模块，提供 3 个纯 TypeScript
字符串工具函数。关键设计点：函数参数类型为 string | null | undefined，
内部做空值安全处理。

## Technical Context

**Language/Version**: TypeScript 5.5.3
**Primary Dependencies**: 无外部依赖
**Storage**: N/A
**Testing**: 无单元测试
**Target Platform**: 浏览器环境（H5 移动端）
**Constraints**: 纯函数无副作用；参数 string | null | undefined
**Scale/Scope**: 3 个函数，约 30 行实现代码

## Constitution Check

Constitution 文件为初始模板，未配置具体约束。
本特性满足通用原则：单一职责、纯函数、自包含、防御式编程。
**结论**: Constitution Check 通过，无违规项。

## Project Structure

### Documentation

specs/001-string-utils/
├── plan.md # This file
├── research.md # Phase 0 output
├── data-model.md # Phase 1 output
├── quickstart.md # Phase 1 output
└── contracts/ # N/A

### Source Code

apps/web/src/utils/
├── string.ts # 新增
├── security.ts # 现有
└── secure-storage.ts # 现有
```

---

## 八、常见问题（FAQ）

### Q1: 为什么 plan.md 是"派生文件"？

**A**: 因为 plan.md 的所有内容都是从 spec.md 推导出来的。spec.md 是"需求层"，plan.md 是"实现层"。需求变了，实现方案必须跟着变。如果手动改 plan.md 而不改 spec.md，就会出现"上游改了、下游没改"的不一致问题。

### Q2: 我可以直接修改 plan.md 吗？

**A**: 可以，但要分情况：

- **技术细节调整**（如文件路径、实现方式）→ ✅ 直接改 plan.md
- **功能需求变更**（如增加函数、修改参数类型）→ ❌ 必须先改 spec.md（用 clarify），然后重新 plan

### Q3: research.md 里的决策可以改吗？

**A**: 可以。如果后期发现某个技术决策不合理（比如原本用原生方法，后来发现确实需要 lodash），可以直接修改 research.md，记录新的决策和理由。但如果这个变更影响了 spec.md 中定义的功能范围，就需要先 clarify。

### Q4: data-model.md 和实际代码不一致怎么办？

**A**: 以 data-model.md 为准。Implement 阶段会读取 data-model.md 作为类型契约。如果代码和 data-model 不一致，说明实现有问题，应该修改代码。如果 data-model 本身设计有误，应该修改 data-model.md（并同步更新 plan.md 中的相关描述）。

### Q5: 为什么每次 clarify 后都要重新 plan？

**A**: 因为 clarify 修改了 spec.md，而 plan.md 是派生文件。例如本案例中：

- 第 3 次 clarify 增加了"空值安全处理"→ spec.md 的 Edge Cases 和 Assumptions 变了
- 这个变化传导到 plan.md → Technical Context 的 Constraints 需要更新
- 传导到 data-model.md → 参数类型从 `string` 变为 `string | null | undefined`
- 传导到 research.md → 新增"空值安全处理策略"章节

如果不重新 plan，这些文档就会和 spec.md 不一致。

### Q6: quickstart.md 是给谁看的？

**A**: 给**使用**这个特性的人看，不是给**实现**的人看。比如：

- 你实现了 string.ts，其他开发者想调用你的函数
- 他们不需要看 plan.md（技术方案），也不需要看 data-model.md（类型定义）
- 他们只需要看 quickstart.md：怎么导入、怎么调用、有什么注意事项

### Q7: Constitution Check 失败了怎么办？

**A**: 有两种处理方式：

1. **调整方案**: 修改 plan 中的技术决策，使其符合 Constitution
2. **解释原因**: 如果确实需要违反某个约束，在 Constitution Check 中详细说明理由，获得架构层面的认可

**注意**: Constitution Check 是**硬性门禁**，未通过不能进入后续阶段。

---

## 九、总结

### Plan 阶段的核心特征

| 特征                  | 说明                                                  |
| --------------------- | ----------------------------------------------------- |
| **派生文件**          | plan.md 基于 spec.md 生成，spec 变了必须重新 plan     |
| **两阶段执行**        | Phase 0（Research）+ Phase 1（Design）                |
| **多文档输出**        | plan.md + research.md + data-model.md + quickstart.md |
| **Constitution 门禁** | 必须通过架构约束检查才能继续                          |
| **技术决策记录**      | research.md 永久保存"为什么这样选"                    |

### Plan 与上下游的关系

```text
spec.md（需求规格）
    │
    ├── 输入: User Stories、Requirements、Edge Cases
    │
    ▼
/speckit-plan
    │
    ├── Phase 0: 技术调研 → research.md
    ├── Phase 1: 架构设计 → data-model.md + quickstart.md
    └── Phase 2: 方案汇总 → plan.md
    │
    ▼
tasks.md（任务清单）
    └── 读取: plan.md 的文件路径和技术约束
```

### Plan 的执行哲学

> **"先调研、再设计、后汇总"**

Plan 阶段不是"拍脑袋写方案"，而是：

1. **Phase 0（调研）**: 把未知变成已知，记录决策依据
2. **Phase 1（设计）**: 把已知变成设计，定义接口和数据结构
3. **Phase 2（汇总）**: 把设计变成文档，形成可执行的技术方案

这个过程确保了技术方案的**可追溯性**（为什么这样选）和**可验证性**（接口定义是否满足需求）。

---

_本文档详细解析了 `/speckit-plan` 命令的完整执行流程、Phase 0/1/2 的分阶段机制、Constitution Check 门禁和与上下游的衔接关系。_
