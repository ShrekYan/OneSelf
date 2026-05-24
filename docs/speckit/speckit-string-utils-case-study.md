# Speckit 实战案例深度复盘：前端字符串工具函数

> **目标读者**: Speckit 新手
> **案例复杂度**: ⭐（入门级）
> **涉及阶段**: Specify → Clarify → Plan → Tasks → Implement（完整 5 阶段）
> **日期**: 2026-05-16

---

## 一、案例概述

### 1.1 原始需求

在 `apps/web/src/utils` 目录中实现 3 个简单的字符串工具函数：

| 函数        | 功能         | 原始需求描述             |
| ----------- | ------------ | ------------------------ |
| `trim`      | 去除首尾空格 | `trim()` - 去除首尾空格  |
| `uppercase` | 转为大写     | `uppercase()` - 转为大写 |
| `lowercase` | 转为小写     | `lowercase()` - 转为小写 |

**质量标准**: 类型声明完整

### 1.2 为什么选这个案例学习

这个案例虽然简单（最终代码只有 27 行），但它完整经历了 Speckit 工作流的 **全部 5 个阶段**，并且经历了 **4 次需求澄清（Clarify）**。对于新手来说，这是一个完美的"麻雀虽小，五脏俱全"的学习材料。

### 1.3 最终交付物

```typescript
// apps/web/src/utils/string.ts（27 行）
export function trim(str: string | null | undefined): string {
  return (str ?? '').trim();
}

export function uppercase(str: string | null | undefined): string {
  return (str ?? '').toUpperCase();
}

export function lowercase(str: string | null | undefined): string {
  return (str ?? '').toLowerCase();
}
```

**生成文件总数**: 8 个文档 + 1 个代码文件 = 9 个文件

---

## 二、需求变更完整时间线

这是本案例最有价值的部分。一个看似简单的需求，在实际迭代中经历了 **4 次澄清**，每次澄清都触发了 plan.md 的重新生成。

```
初始需求
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: /speckit-specify                                        │
│ 用户描述: "apps/web/src/utils 中实现 3 个简单的字符串工具函数"      │
│ 输出: spec.md（初版） + checklists/requirements.md              │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: /speckit-plan                                           │
│ 输出: plan.md + research.md + data-model.md + quickstart.md     │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: /speckit-clarify "去除单元测试"                          │
│ 变更: 明确本特性不编写单元测试                                   │
│ 影响: spec.md → Assumptions 更新                                 │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: /speckit-plan（重新生成）                                 │
│ 原因: spec 变了，plan 必须重新生成以保持一致                      │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: /speckit-clarify "测试使用 npm run lint 验证就行"          │
│ 变更: 验收方式改为用 lint 检查                                   │
│ 影响: spec.md → Clarifications 新增问答                         │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: /speckit-plan（重新生成）                                 │
│ 原因: spec 变了，plan 必须重新生成                               │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 7: /speckit-clarify "增加空值安全处理（允许传入 null/undefined）"│
│ 变更: 参数类型从 string 扩展为 string \| null \| undefined        │
│ 影响: spec.md → Edge Cases + Assumptions 更新                    │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 8: /speckit-plan（重新生成）                                 │
│ 原因: spec 变了，plan 必须重新生成                               │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 9: /speckit-clarify "去除 npm run lint"                     │
│ 变更: 取消 lint 验收，改为"代码实现正确即可"                      │
│ 影响: spec.md → Clarifications 更新                             │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 10: /speckit-plan（第 4 次重新生成）                          │
│ 原因: spec 变了，plan 必须重新生成                               │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 11: /speckit-tasks                                         │
│ 输出: tasks.md（5 个任务）                                       │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 12: /speckit-implement                                     │
│ 输出: apps/web/src/utils/string.ts（27 行代码）                  │
│ 结果: 所有任务标记为 [x] 完成                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 4 次 Clarify 对比表

| 次数 | 指令                             | 变更内容                | spec.md 影响位置         | plan.md 是否重新生成 |
| ---- | -------------------------------- | ----------------------- | ------------------------ | -------------------- |
| 1    | `去除单元测试`                   | 明确不编写测试          | Assumptions              | 是                   |
| 2    | `测试使用 npm run lint 验证就行` | 验收方式改为 lint       | Clarifications           | 是                   |
| 3    | `增加空值安全处理`               | 参数支持 null/undefined | Edge Cases + Assumptions | 是                   |
| 4    | `去除 npm run lint`              | 取消验收步骤            | Clarifications           | 是                   |

**关键教训**: 每次 `spec.md` 发生变化，`plan.md` **必须**重新生成，否则会出现"上游改了、下游没改"的不一致问题。

---

## 三、Speckit 工作流各阶段详解

### 3.1 阶段一：Specify（定义需求）

**命令**: `/speckit-specify`

**作用**: 将用户的一句话需求转化为结构化的规格说明书（spec.md）。这是整个工作流的**唯一真相源（Single Source of Truth）**。

**输入**:

```text
- 目标描述
  - apps/web/src/utils 中 实现 3 个简单的字符串工具函数
- 上下文信息
  - trim() - 去除首尾空格
  - uppercase() - 转为大写
  - lowercase() - 转为小写
- 质量标准
  - 类型声明完整
- 执行模式
  - plan-only
```

**生成的文件**:

| 文件            | 路径                                                | 作用                                                                 |
| --------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| spec.md         | `specs/001-string-utils/spec.md`                    | **核心真相源**。包含用户故事、验收场景、边界情况、澄清记录、假设条件 |
| requirements.md | `specs/001-string-utils/checklists/requirements.md` | 规格质量检查清单，16 项检查，全部通过才能进入 Plan 阶段              |

**spec.md 核心内容解析**:

```markdown
# Feature Specification: 前端字符串工具函数

## User Scenarios & Testing

# 每个函数一个用户故事，包含：

# - Priority（优先级，P1 为最高）

# - Why this priority（为什么是这个优先级）

# - Independent Test（独立测试方式）

# - Acceptance Scenarios（Given-When-Then 验收场景）

## Edge Cases

# 边界情况：null/undefined 处理、纯空格、多语言字符等

## Requirements

# 功能需求编号（FR-001、FR-002...）

## Success Criteria

# 成功标准（SC-001、SC-002...），必须可测量

## Clarifications

# 澄清记录：每次 /speckit-clarify 的问答都会记录在这里

## Assumptions

# 假设条件：开发前提假设
```

**为什么 spec.md 如此重要**:

- 它是 **plan.md** 的输入源（计划从规格派生）
- 它是 **tasks.md** 的输入源（任务从规格拆解）
- 它是 **data-model.md** 的输入源（数据模型从规格提取）
- 所有后续文档都基于 spec.md 生成，所以 spec.md 一旦变更，下游文档必须同步更新

---

### 3.2 阶段二：Clarify（澄清需求）

**命令**: `/speckit-clarify [你的问题或调整]`

**作用**: 检测并减少规格中的模糊点，将问答结果直接写回 spec.md。

**本案例中的 4 次澄清**:

#### 澄清 1：去除单元测试

```text
Q: 本特性是否需要编写单元测试？
A: 否，本特性不包含单元测试代码编写。
```

**影响**: spec.md 的 Assumptions 章节增加了一条假设。

#### 澄清 2：验收方式改为 lint

```text
Q: 本特性的验收方式是什么？
A: 使用 npm run lint 进行代码质量验证。
```

**影响**: spec.md 的 Clarifications 章节新增问答。

#### 澄清 3：增加空值安全处理

```text
隐含 Q: 函数参数是否允许传入 null/undefined？
A: 是，函数需对 null/undefined 做安全处理，返回空字符串 ""
```

**影响**: 这是 4 次澄清中**影响最大**的一次：

- Edge Cases 章节新增：`传入 null 或 undefined 时，函数应返回空字符串 ""`
- Assumptions 章节更新：`函数需对 null / undefined 做安全处理`
- 直接影响了 data-model.md 中所有函数的参数类型（从 `string` 变为 `string | null | undefined`）

#### 澄清 4：去除 lint 验收

```text
Q: 本特性的验收方式是什么？
A: 代码实现正确即可，无额外验收步骤。
```

**影响**: 覆盖了之前的 lint 验收方式。

**Clarify 的核心价值**:

- 将"口头的、模糊的"需求变成"书面的、明确的"记录
- 每次问答都被**永久记录**在 spec.md 中，避免后期扯皮
- 最多问 5 个问题，强制聚焦最关键的不确定性

---

### 3.3 阶段三：Plan（技术规划）

**命令**: `/speckit-plan`

**作用**: 基于 spec.md 生成技术实现方案。plan.md 是**派生文件**（derived document），spec 变了就必须重新生成。

**生成的文件**:

| 文件          | 路径                                   | 作用                                                           |
| ------------- | -------------------------------------- | -------------------------------------------------------------- |
| plan.md       | `specs/001-string-utils/plan.md`       | **技术方案总览**。包含技术上下文、架构约束检查、项目结构决策   |
| research.md   | `specs/001-string-utils/research.md`   | **技术调研记录**。记录为什么选择某种技术方案，拒绝哪些替代方案 |
| data-model.md | `specs/001-string-utils/data-model.md` | **接口契约**。定义函数的完整 TypeScript 类型签名（输入输出）   |
| quickstart.md | `specs/001-string-utils/quickstart.md` | **快速开始指南**。面向使用者的导入示例和用法说明               |

#### plan.md 详解

```markdown
# Implementation Plan: 前端字符串工具函数

## Summary

# 一句话总结：做什么、在哪里做、关键设计点

## Technical Context

# 技术上下文：语言版本、依赖、存储、测试方式、目标平台等

## Constitution Check

# 架构约束检查：是否符合项目的 Constitution（治理宪法）

## Project Structure

# 项目结构决策：新增哪些文件、放在哪里、为什么
```

**plan.md 的关键设计点**:

```text
在 apps/web/src/utils 目录下新增 string.ts 模块，提供 3 个纯 TypeScript 字符串工具函数。

关键设计点：函数参数类型为 string | null | undefined，内部做空值安全处理——
传入 null 或 undefined 时返回空字符串 ''，避免调用方因空值导致运行时异常。
```

#### research.md 详解

这是 4 个 plan 阶段文件中**最适合新手学习"如何做出技术决策"**的文件。

```markdown
# Research: 前端字符串工具函数实现方案

## 研究发现

### 1. 实现方式选择

决策: 直接使用 JavaScript 原生 String.prototype 方法封装
理由:

- trim()、toUpperCase()、toLowerCase() 均为 ES5+ 标准方法，浏览器兼容性极佳
- 无需引入 lodash、ramda 等第三方库，保持零依赖
- 原生方法经浏览器引擎高度优化，性能最优
  替代方案考虑:
- lodash trim / upperCase / lowerCase：功能冗余，增加包体积，拒绝
- 自定义正则实现：代码冗余，无性能优势，拒绝

### 2. 空值安全处理策略

决策: 函数内部使用 str ?? ''（空值合并运算符）做前置保护
理由:

- ?? 仅对 null 和 undefined 生效，不会误处理空字符串 '' 或数字 0
- 相比 || 更安全，避免 falsy 值被错误替换
  替代方案考虑:
- str || ''：会错误地将空字符串、0、false 也替换，拒绝
- 提前 throw Error：与 spec 要求的"返回空字符串"冲突，拒绝
```

**research.md 的价值**: 它不仅告诉你"选择了什么"，更重要的是告诉你"为什么这样选"和"拒绝了什么"。这对于团队协作和后期维护至关重要。

#### data-model.md 详解

```markdown
# Data Model: 前端字符串工具函数

## 函数接口

### trim

export function trim(str: string | null | undefined): string;
输入约束: 类型: string | null | undefined
输出: 类型: string（始终返回字符串，永不返回 null/undefined）

### uppercase

export function uppercase(str: string | null | undefined): string;

### lowercase

export function lowercase(str: string | null | undefined): string;

## 不变式

- 所有函数均为纯函数：相同输入始终产生相同输出
- 所有函数不产生副作用
- 所有函数返回值类型始终为 string，永不返回 null 或 undefined
```

**data-model.md 的本质**: 它是代码和规格之间的"合同"。开发者看了 data-model.md 就知道函数该怎么写，测试人员看了就知道该怎么测。

#### quickstart.md 详解

```markdown
# Quickstart: 字符串工具函数

## 导入

import { trim, uppercase, lowercase } from '@/utils/string';

## 使用示例

### trim - 去除首尾空格

trim(' hello world '); // => 'hello world'
trim(null); // => ''

### uppercase - 转为大写

uppercase('Hello World'); // => 'HELLO WORLD'

### lowercase - 转为小写

lowercase('Hello World'); // => 'hello world'
```

**quickstart.md 的读者**: 不是写代码的人，而是**使用**这些函数的人。它回答的是"怎么用"，不是"怎么实现"。

---

### 3.4 阶段四：Tasks（任务拆解）

**命令**: `/speckit-tasks`

**作用**: 将 plan.md 中的技术方案拆解为可执行的具体任务。

**生成的文件**:

| 文件     | 路径                              | 作用                                                            |
| -------- | --------------------------------- | --------------------------------------------------------------- |
| tasks.md | `specs/001-string-utils/tasks.md` | **任务清单**。按用户故事分组，每个任务包含 ID、优先级、文件路径 |

**tasks.md 的核心结构**:

```markdown
# Tasks: 前端字符串工具函数

## Phase 1: User Story 1 - 去除字符串首尾空格 (Priority: P1)

- [x] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts

## Phase 2: User Story 2 - 字符串转为大写 (Priority: P1)

- [x] T002 [US2] 实现 uppercase 函数于 apps/web/src/utils/string.ts

## Phase 3: User Story 3 - 字符串转为小写 (Priority: P1)

- [x] T003 [US3] 实现 lowercase 函数于 apps/web/src/utils/string.ts

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T004 确保 apps/web/src/utils/string.ts 中所有函数包含完整 JSDoc 注释
- [x] T005 确保导入排序遵循项目规范（@/ 别名）
```

**任务格式规范**:

```text
- [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
  │      │   │      └─ 具体做什么 + 在哪里做
  │      │   └─ 属于哪个用户故事
  │      └─ 任务 ID（执行顺序）
  └─ 复选框（完成后标记为 [x]）
```

**为什么任务要按用户故事分组**:

- 每个用户故事可以**独立实现和测试**
- 便于并行开发（不同故事可以由不同人做）
- MVP（最小可行产品）思维：先做 US1，做完就能用，不必等全部完成

---

### 3.5 阶段五：Implement（执行实现）

**命令**: `/speckit-implement`

**作用**: 按照 tasks.md 的任务清单，逐条执行实现。

**生成的文件**:

| 文件      | 路径                           | 作用                   |
| --------- | ------------------------------ | ---------------------- |
| string.ts | `apps/web/src/utils/string.ts` | **实际交付的代码文件** |

**实现策略**:

```text
MVP First（T001 即 MVP）:
1. T001: 创建 string.ts 并实现 trim → 立即可用
2. T002: 追加 uppercase → 立即可用
3. T003: 追加 lowercase → 立即可用
4. T004 + T005: 格式和注释检查
```

**最终代码**:

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

**代码解析**:

| 代码元素                                        | 意义                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `export function`                               | 命名导出，与现有 utils 风格一致，支持 tree-shaking                    |
| `string \| null \| undefined`                   | 参数类型，来自第 3 次 clarify 的空值安全需求                          |
| `str ?? ''`                                     | 空值合并运算符：仅对 `null`/`undefined` 生效，不误判 `''`/`0`/`false` |
| `.trim()` / `.toUpperCase()` / `.toLowerCase()` | JavaScript 原生方法，零依赖，性能最优                                 |
| JSDoc 注释                                      | 提供 IDE 智能提示，来自 T004 任务要求                                 |

---

## 四、所有生成文件的关系图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Single Source of Truth                         │
│                                  spec.md                                    │
│                              （核心真相源）                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                        ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   plan.md       │    │   checklists/   │    │  contracts/     │
    │  （技术方案）    │    │  （质量检查）    │    │ （接口契约）     │
    └────────┬────────┘    └─────────────────┘    └─────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│research.│    │ data-model. │    │ quickstart. │    │  tasks.md   │
│  md     │    │    md       │    │    md       │    │ （任务清单）  │
│(技术调研)│    │ (接口定义)   │    │ (使用指南)   │    └──────┬──────┘
└─────────┘    └─────────────┘    └─────────────┘           │
                                                            ▼
                                                   ┌─────────────────┐
                                                   │  string.ts      │
                                                   │ （实际代码文件）  │
                                                   └─────────────────┘
```

### 文件依赖关系说明

```text
spec.md
  ├── 输入给 /speckit-plan → 生成 plan.md
  │     ├── 生成 research.md（调研决策）
  │     ├── 生成 data-model.md（接口契约）
  │     └── 生成 quickstart.md（使用指南）
  │
  ├── 输入给 /speckit-tasks → 生成 tasks.md
  │     └── tasks.md 引用 plan.md 中的技术方案
  │
  └── 输入给 /speckit-implement → 生成 string.ts
        └── implement 读取 tasks.md 获取任务清单
```

**核心原则**: spec.md 是唯一的"上游"，其他所有文件都是"下游"。**上游变更，下游必须同步更新**。

---

## 五、核心判断法则：何时改 spec，何时改 plan

这是新手最容易困惑的问题。本案例经历了 4 次 clarify（改 spec）+ 4 次重新 plan，完美展示了判断法则。

### 5.1 口诀

> **功能变了 → 改 spec → 重新 plan**
> **技术细节调整 → 直接改 plan**

### 5.2 判断对照表

| 场景             | 改 spec？ | 改 plan？ | 本案例示例                 |
| ---------------- | --------- | --------- | -------------------------- |
| 增加/删除功能    | ✅        | 重新生成  | 增加空值安全处理           |
| 修改验收标准     | ✅        | 重新生成  | 去除单元测试、改 lint 验收 |
| 调整边界情况     | ✅        | 重新生成  | null/undefined 处理        |
| 修改技术实现方式 | ❌        | ✅ 直接改 | （本案例未发生）           |
| 调整文件路径     | ❌        | ✅ 直接改 | （本案例未发生）           |
| 修改导入方式     | ❌        | ✅ 直接改 | （本案例未发生）           |

### 5.3 详细解释

#### 需要改 spec（然后重新 plan）的情况

**1. 功能需求变化**

例如：原本只做 trim/uppercase/lowercase，现在要增加 `capitalize`（首字母大写）。

- 为什么改 spec：spec.md 的 User Stories 和 Functional Requirements 需要新增内容
- 为什么不直接改 plan：plan.md 是基于 spec 派生的，spec 变了 plan 的输入就变了
- 怎么做：`/speckit-clarify "增加 capitalize 函数"` → `/speckit-plan`

**2. 验收标准变化**

例如：本案例中"去除单元测试""改用 lint 验收""去除 lint 验收"。

- 为什么改 spec：Success Criteria 和 Clarifications 需要更新
- 怎么做：`/speckit-clarify "去除单元测试"` → `/speckit-plan`

**3. 边界情况变化**

例如：本案例中"增加空值安全处理"。

- 为什么改 spec：Edge Cases 和 Assumptions 需要更新
- 影响范围：不仅影响 spec，还直接影响 data-model.md 中的类型定义（`string` → `string | null | undefined`）
- 怎么做：`/speckit-clarify "增加空值安全处理"` → `/speckit-plan`

#### 不需要改 spec（直接改 plan）的情况

**1. 技术实现方式调整**

例如：plan.md 里写了用原生方法实现，后来想改用 lodash。

- 为什么不用改 spec：spec 只关心"做什么"，不关心"怎么做"
- 怎么做：直接编辑 plan.md 和 research.md，说明为什么改用 lodash

**2. 文件路径调整**

例如：plan.md 里决定放在 `apps/web/src/utils/string.ts`，后来想改到 `apps/web/src/utils/text.ts`。

- 为什么不用改 spec：spec 只说"在 utils 中实现"，没说具体文件名
- 怎么做：直接编辑 plan.md 的 Project Structure 章节

**3. 代码风格调整**

例如：plan.md 里写了用箭头函数，后来想改成普通函数声明。

- 为什么不用改 spec：spec 不关心代码风格
- 怎么做：直接编辑 plan.md 或直接在实现时调整

### 5.4 记忆技巧

想象一个瀑布：

```
        spec.md  ← 用户视角："我要什么"
           │
           ▼
        plan.md  ← 开发视角："我怎么实现"
           │
           ▼
      tasks.md   ← 执行视角："具体做哪些事"
           │
           ▼
      string.ts  ← 代码视角："实际写出来的代码"
```

- **上层动了，下层必须跟着动**（spec 变了 → plan 必须重新生成）
- **下层动了，不用通知上层**（plan 的技术细节调整 → 不用改 spec）

---

## 六、需求变更的影响链分析

以本案例第 3 次 clarify（增加空值安全处理）为例，展示一次需求变更如何层层传导：

### 6.1 变更前

```typescript
// data-model.md 中的函数签名（变更前）
export function trim(str: string): string;
export function uppercase(str: string): string;
export function lowercase(str: string): string;
```

### 6.2 变更后

```typescript
// data-model.md 中的函数签名（变更后）
export function trim(str: string | null | undefined): string;
export function uppercase(str: string | null | undefined): string;
export function lowercase(str: string | null | undefined): string;
```

### 6.3 影响链

```text
用户说："增加空值安全处理"
    │
    ▼
spec.md 更新
    ├── Edge Cases: 新增 "传入 null 或 undefined 时返回空字符串"
    └── Assumptions: 更新 "函数需对 null/undefined 做安全处理"
    │
    ▼
/speckit-plan 重新生成
    ├── plan.md: Technical Context 的 Constraints 更新
    ├── research.md: 新增 "空值安全处理策略" 章节
    │     ├── 决策: 使用 str ?? ''
    │     ├── 理由: ?? 仅对 null/undefined 生效
    │     └── 拒绝: str || ''（会误判 falsy 值）
    ├── data-model.md: 所有函数参数类型改为 string | null | undefined
    └── quickstart.md: 使用示例新增 null/undefined 示例
    │
    ▼
/speckit-tasks（基于新 plan 生成）
    └── tasks.md 无需改动（任务描述不涉及具体类型）
    │
    ▼
/speckit-implement
    └── string.ts 代码变化
        ├── 变更前: return str.trim();
        └── 变更后: return (str ?? '').trim();
```

**关键洞察**: 用户的一句话需求变更，通过 Speckit 工作流，**自动、完整、可追溯地**传导到了所有相关文档和最终代码。这就是 Speckit 的价值。

---

## 七、文件清单总表

| 序号 | 文件名          | 路径                                                | 所属阶段  | 文件作用                                 | 是否派生 |
| ---- | --------------- | --------------------------------------------------- | --------- | ---------------------------------------- | -------- |
| 1    | spec.md         | `specs/001-string-utils/spec.md`                    | Specify   | 核心真相源：用户故事、验收场景、边界情况 | ❌ 源头  |
| 2    | requirements.md | `specs/001-string-utils/checklists/requirements.md` | Specify   | 规格质量检查清单（16 项）                | ✅ 派生  |
| 3    | plan.md         | `specs/001-string-utils/plan.md`                    | Plan      | 技术方案总览                             | ✅ 派生  |
| 4    | research.md     | `specs/001-string-utils/research.md`                | Plan      | 技术调研与决策记录                       | ✅ 派生  |
| 5    | data-model.md   | `specs/001-string-utils/data-model.md`              | Plan      | 接口类型契约                             | ✅ 派生  |
| 6    | quickstart.md   | `specs/001-string-utils/quickstart.md`              | Plan      | 使用者快速开始指南                       | ✅ 派生  |
| 7    | tasks.md        | `specs/001-string-utils/tasks.md`                   | Tasks     | 可执行任务清单（5 个任务）               | ✅ 派生  |
| 8    | string.ts       | `apps/web/src/utils/string.ts`                      | Implement | **实际交付代码**（27 行）                | ✅ 派生  |

---

## 八、经验教训（新手必读）

### 8.1 关于 Clarify

1. **Clarify 不是一次性活动**: 本案例 clarify 了 4 次才达到满意状态，这是正常的
2. **越早 clarify 成本越低**: 如果在 Implement 阶段才发现需要空值处理，改起来成本更高
3. **Clarify 的答案要写入 spec**: 不要只记在脑子里，要写入 spec.md 的 Clarifications 章节

### 8.2 关于 Plan

1. **Plan 是派生文件**: spec 变了必须重新 plan，不能手动改 plan 来"追赶" spec 的变化
2. **Research.md 是最有价值的文件**: 它记录了"为什么这样选"，比"选了什么"更重要
3. **Data-model.md 是代码的合同**: 写代码前先定义好接口，减少返工

### 8.3 关于 Tasks

1. **按用户故事分组**: 便于独立测试和增量交付
2. **MVP 思维**: T001（trim）做完就能用，不需要等全部完成
3. **任务格式要规范**: `- [ ] T001 [US1] 描述 + 文件路径`

### 8.4 关于 Implement

1. **Implement 读取的是 tasks.md**: 不是直接读 plan.md
2. **完成后要标记任务**: 将 `- [ ]` 改为 `- [x]`
3. **代码要符合 plan 中的决策**: 比如本案例要求零依赖、使用 `??`、命名导出

### 8.5 关于需求变更

1. **用口诀判断**: "功能变了 → 改 spec → 重新 plan；技术细节调整 → 直接改 plan"
2. **不要跳过 clarify**: 即使是很小的调整，也建议用 clarify 记录，避免后期遗忘
3. **保持文档一致性**: 上游文档变更后，下游文档必须同步更新

---

## 九、FAQ（常见问题）

### Q1: 我已经改好了 plan.md，但发现 spec.md 也需要改，怎么办？

**A**: 先改 spec.md（用 `/speckit-clarify`），然后重新运行 `/speckit-plan`。不要反向操作（先改 plan 再改 spec），因为 plan 是派生文件。

### Q2: 我不想重新生成 plan，可以直接改 plan.md 吗？

**A**: 如果只是技术细节调整（如文件路径、实现方式），可以直接改 plan.md。但如果涉及功能、验收标准、边界情况，必须改 spec 并重新 plan。

### Q3: tasks.md 里的任务都完成了，但发现代码有个小 bug，要改哪里？

**A**: 直接改代码（string.ts），不需要重新跑任何 Speckit 命令。因为 bug 修复不影响需求规格。

### Q4: 我想在 string.ts 里再加一个函数，要走完整流程吗？

**A**: 如果是计划内的函数（spec 里已定义），直接实现即可。如果是新函数，建议先 `/speckit-clarify` 更新 spec，再重新 `/speckit-plan` 和 `/speckit-tasks`。

### Q5: checklists/requirements.md 是干嘛的？

**A**: 它是 spec 的质量检查清单，确保 spec 达到可以进入 Plan 阶段的标准。由 `/speckit-specify` 自动生成，通常不需要手动修改。

---

## 十、附录：完整命令清单

| 阶段      | 命令                      | 输入                    | 输出                                                  |
| --------- | ------------------------- | ----------------------- | ----------------------------------------------------- |
| Specify   | `/speckit-specify`        | 用户的一句话需求        | spec.md + checklists/                                 |
| Clarify   | `/speckit-clarify [问题]` | 对 spec 的疑问或调整    | 更新的 spec.md                                        |
| Plan      | `/speckit-plan`           | spec.md                 | plan.md + research.md + data-model.md + quickstart.md |
| Tasks     | `/speckit-tasks`          | plan.md + spec.md       | tasks.md                                              |
| Implement | `/speckit-implement`      | tasks.md + 所有设计文档 | 实际代码文件                                          |

---

_本文档由 Speckit 实战过程自动生成，记录了从一句话需求到 27 行代码的完整旅程。_
