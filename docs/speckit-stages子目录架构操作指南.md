# Speckit 从零开始 - Stages 子目录架构操作指南

---

## 文档信息

| 项目             | 内容                            |
| ---------------- | ------------------------------- |
| **文档版本**     | v1.0                            |
| **创建日期**     | 2026-05-23                      |
| **目标 Feature** | `specs/002-xiaobei-utils`       |
| **架构模式**     | Stages 子目录隔离架构           |
| **学习目标**     | 从零使用 speckit 构建小贝工具库 |

---

## 目录架构

```
┌─────────────────────────────────────────────────────────┐
│  specs/002-xiaobei-utils/                              │
│  ├── spec.md          ← 全局规格（不变）               │
│  ├── plan.md          ← 全局计划（不变）               │
│  ├── tasks.md         ← 全局任务编排（增量添加阶段）    │
│  ├── research.md      ← 全局研究（不变）               │
│  ├── data-model.md    ← 全局数据模型（不变）           │
│  ├── quickstart.md    ← 全局快速开始（不变）           │
│  ├── checklists/                                          │
│  │   └── requirements.md                                │
│  ├── contracts/                                           │
│  │   ├── string-utils.md                                │
│  │   ├── number-utils.md                                │
│  │   └── array-utils.md                                 │
│  └── stages/          ← 阶段目录（按需扩展）            │
│      ├── 01-string-utils/   ← 独立隔离                 │
│      │   ├── spec.md                                     │
│      │   ├── plan.md                                     │
│      │   ├── tasks.md                                    │
│      │   ├── contract.md                                 │
│      │   ├── data-model.md                               │
│      │   └── quickstart.md                               │
│      ├── 02-number-utils/   ← 独立隔离                 │
│      │   └── ...（同上）                                │
│      ├── 03-array-utils/    ← 独立隔离                 │
│      │   └── ...（同上）                                │
│      └── 10-xxx/          ← 独立隔离（未来扩展）       │
│          └── ...（同上）                                │
└─────────────────────────────────────────────────────────┘
```

---

## 工作流程概览

```
第1步：创建 Feature 分支
    ↓
第2步：生成全局规格（/speckit-specify）
    ↓
第3步：生成全局计划（/speckit-plan）
    ↓
第4步：为每个阶段生成阶段规格（/speckit-specify）
    ↓
第5步：为每个阶段生成阶段计划（/speckit-plan）
    ↓
第6步：为每个阶段生成阶段任务（/speckit-tasks）
    ↓
第7步：更新全局任务编排（tasks.md）
    ↓
第8步：执行实现（/speckit-implement）
```

---

## 第1步：创建 Feature 分支

### 给 AI 的提示词

```
请帮我创建一个 Speckit feature：

创建小贝工具库，包含三个阶段：
- Stage 01: 字符串工具（trim, uppercase, lowercase）
- Stage 02: 数字工具（add, multiply, formatNumber）
- Stage 03: 数组工具（unique, sort, filter）

要求：
- Feature 目录：specs/002-xiaobei-utils
- 不要创建三个独立 feature，只创建一个统一的 feature
- 三个阶段作为同一个 feature 下的三个 User Stories
- 目标代码目录：apps/web/src/utils/
- 不需要单元测试
```

### 预期结果

- 创建 Git 分支（如适用）
- 创建目录 `specs/002-xiaobei-utils/`
- 更新 `.specify/feature.json`

---

## 第2步：生成全局规格

### 2.1 给 AI 的提示词

```
请执行 /speckit-specify 命令来生成全局规格文档。

需求输入：
请阅读以下三个文档，然后为"小贝工具库"生成完整的 spec.md：
1. docs/小贝项目-阶段1-字符串工具.md
2. docs/小贝项目-阶段2-数字工具.md
3. docs/小贝项目-阶段3-数组工具.md

规格要求：
1. Feature 名称：小贝工具库
2. Feature 目录：specs/002-xiaobei-utils/
3. 包含三个 User Stories / Stages：
   - Stage 01：字符串工具（trim, uppercase, lowercase）- P1
   - Stage 02：数字工具（add, multiply, formatNumber）- P2
   - Stage 03：数组工具（unique, sort, filter）- P3
4. 每个 Stage 都要有独立的验收标准
5. 每个 Stage 都要有包含范围和不包含范围
6. Clarifications：去除单元测试要求
7. 目标代码目录：apps/web/src/utils/
8. 不要创建三个独立 feature，保持单一 feature
9. Stage Index 表格指向 stages/ 目录下的阶段文档
10. Success Criteria 要有 Measurable Outcomes
11. Assumptions 要说明三个阶段可并行执行
```

### 2.2 预期生成的文件

```
specs/002-xiaobei-utils/
└── spec.md                 ← 全局规格
```

### 2.3 spec.md 示例结构

```markdown
# Feature Specification: 小贝工具库

**Feature Branch**: `[20260321-xiaobei-utils]`

**Created**: [DATE]

**Status**: Draft

## Stage Index

| Stage ID | Stage Name | Priority | Stage Spec                                                       |
| -------- | ---------- | -------- | ---------------------------------------------------------------- |
| 01       | 字符串工具 | P1       | [stages/01-string-utils/spec.md](stages/01-string-utils/spec.md) |
| 02       | 数字工具   | P2       | [stages/02-number-utils/spec.md](stages/02-number-utils/spec.md) |
| 03       | 数组工具   | P3       | [stages/03-array-utils/spec.md](stages/03-array-utils/spec.md)   |

## Requirements

### Functional Requirements

- FR-001: 小贝工具库 MUST 作为一个单一 feature 组织...
- FR-002: 字符串工具集合 MUST 覆盖...
  ...

## Success Criteria

- SC-001: 使用者可以在一个 feature 规格中找到...
  ...
```

---

## 第3步：生成全局计划

### 3.1 给 AI 的提示词

```
请执行 /speckit-plan 命令来生成全局实现计划。

输入：specs/002-xiaobei-utils/spec.md

计划要求：
1. 生成 plan.md 到 specs/002-xiaobei-utils/plan.md
2. Technical Context：
   - Language/Version: TypeScript 5.5.3
   - Primary Dependencies: 无新增外部依赖
   - Testing: 不规划单元测试
   - Target Platform: 前端 H5 应用内部工具库
   - Project Type: web-application 前端内部 utils 模块
3. Stage Index 表格指向 stages/ 目录
4. Stage Execution Order：三个阶段可并行
5. Project Structure 包含：
   - 全局文档结构（spec.md, plan.md, tasks.md, stages/）
   - 源码结构（apps/web/src/utils/）
6. Global Validation：npm run lint, npx tsc --noEmit
7. 阶段文档结构：
   - stages/01-string-utils/plan.md
   - stages/02-number-utils/plan.md
   - stages/03-array-utils/plan.md
```

### 3.2 预期生成的文件

```
specs/002-xiaobei-utils/
├── plan.md              ← 全局计划
├── research.md          ← 全局研究
├── data-model.md        ← 全局数据模型
├── quickstart.md        ← 全局快速开始
└── contracts/           ← 接口契约目录
    ├── string-utils.md
    ├── number-utils.md
    └── array-utils.md
```

---

## 第4步：为每个阶段生成阶段规格

### 4.1 Stage 01 - 字符串工具

#### 给 AI 的提示词

```
请为 Stage 01 - 字符串工具生成阶段规格。

输入：
- docs/小贝项目-阶段1-字符串工具.md
- specs/002-xiaobei-utils/spec.md（全局规格）

要求：
1. 生成阶段目录：specs/002-xiaobei-utils/stages/01-string-utils/
2. 生成阶段规格：specs/002-xiaobei-utils/stages/01-string-utils/spec.md
3. 功能范围：
   - trim(str): string - 去除首尾空格
   - uppercase(str): string - 转为大写
   - lowercase(str): string - 转为小写
4. 目标文件：apps/web/src/utils/string.ts
5. 包含范围：
   - trim() 实现
   - uppercase() 实现
   - lowercase() 实现
   - 完整类型声明
   - JSDoc 注释
6. 不包含范围：
   - 单元测试
   - 其他字符串工具
7. 验收标准（至少4条）：
   - trim("  hello  ") === "hello"
   - uppercase("hello") === "HELLO"
   - lowercase("HELLO") === "hello"
   - 非字符串输入的行为定义
```

### 4.2 Stage 02 - 数字工具

#### 给 AI 的提示词

```
请为 Stage 02 - 数字工具生成阶段规格。

输入：
- docs/小贝项目-阶段2-数字工具.md
- specs/002-xiaobei-utils/spec.md（全局规格）

要求：
1. 生成阶段目录：specs/002-xiaobei-utils/stages/02-number-utils/
2. 生成阶段规格：specs/002-xiaobei-utils/stages/02-number-utils/spec.md
3. 功能范围：
   - add(a: number, b: number): number - 两数相加
   - multiply(a: number, b: number): number - 两数相乘
   - formatNumber(num: number): string - 格式化数字显示（千分位）
4. 目标文件：apps/web/src/utils/number.ts
5. 包含/不包含范围同上
6. 验收标准（至少4条）
```

### 4.3 Stage 03 - 数组工具

#### 给 AI 的提示词

```
请为 Stage 03 - 数组工具生成阶段规格。

输入：
- docs/小贝项目-阶段3-数组工具.md
- specs/002-xiaobei-utils/spec.md（全局规格）

要求：
1. 生成阶段目录：specs/002-xiaobei-utils/stages/03-array-utils/
2. 生成阶段规格：specs/002-xiaobei-utils/stages/03-array-utils/spec.md
3. 功能范围：
   - unique<T>(arr: T[]): T[] - 数组去重（使用 Set）
   - sort(arr: number[]): number[] - 数组排序（升序）
   - filter<T>(arr: T[], fn: (item: T) => boolean): T[] - 数组过滤
4. 目标文件：apps/web/src/utils/array.ts
5. 包含/不包含范围同上
6. 验收标准（至少4条）
```

### 4.4 预期生成的阶段规格

```
specs/002-xiaobei-utils/stages/
├── 01-string-utils/
│   └── spec.md          ← Stage 01 规格
├── 02-number-utils/
│   └── spec.md          ← Stage 02 规格
└── 03-array-utils/
    └── spec.md          ← Stage 03 规格
```

---

## 第5步：为每个阶段生成阶段计划

### 5.1 给 AI 的提示词（通用模板）

```
请为 {STAGE_NAME} 生成阶段实现计划。

输入：
- specs/002-xiaobei-utils/stages/{STAGE_ID}/spec.md
- specs/002-xiaobei-utils/plan.md（全局计划）

要求：
1. 生成阶段计划：specs/002-xiaobei-utils/stages/{STAGE_ID}/plan.md
2. 技术上下文：
   - Language/Version: TypeScript 5.5.3
   - Dependencies: 无新增依赖
   - Testing: 不规划单元测试
3. 目标文件：apps/web/src/utils/{MODULE}.ts
4. 项目结构：
   - 文档结构：specs/002-xiaobei-utils/stages/{STAGE_ID}/
   - 源码结构：apps/web/src/utils/{MODULE}.ts
5. 验证：npm run lint, npx tsc --noEmit
```

**具体执行时替换：**

- `{STAGE_NAME}`: 字符串工具/数字工具/数组工具
- `{STAGE_ID}`: 01-string-utils/02-number-utils/03-array-utils
- `{MODULE}`: string/number/array

### 5.2 预期生成的阶段计划

```
specs/002-xiaobei-utils/stages/
├── 01-string-utils/
│   └── plan.md          ← Stage 01 计划
├── 02-number-utils/
│   └── plan.md          ← Stage 02 计划
└── 03-array-utils/
    └── plan.md          ← Stage 03 计划
```

---

## 第6步：为每个阶段生成阶段任务

### 6.1 给 AI 的提示词（通用模板）

```
请为 {STAGE_NAME} 生成阶段任务清单。

输入：
- specs/002-xiaobei-utils/stages/{STAGE_ID}/spec.md
- specs/002-xiaobei-utils/stages/{STAGE_ID}/plan.md
- specs/002-xiaobei-utils/stages/{STAGE_ID}/contract.md

要求：
1. 生成阶段任务：specs/002-xiaobei-utils/stages/{STAGE_ID}/tasks.md
2. 使用严格的 checklist 格式：
   - [ ] S{STAGE_NUM}T001 任务描述 with file path
   - [ ] S{STAGE_NUM}T002 [P] 可并行任务 with file path
3. 阶段结构：
   - Phase 1: Implementation
   - Phase 2: Validation
4. 每个函数实现作为独立任务
5. 不包含单元测试任务
6. 所有任务都要有文件路径
```

**具体执行时替换：**

- `{STAGE_NAME}`: 字符串工具/数字工具/数组工具
- `{STAGE_ID}`: 01-string-utils/02-number-utils/03-array-utils
- `{STAGE_NUM}`: 01/02/03

### 6.2 阶段任务示例（Stage 01）

```markdown
# Tasks: 字符串工具

## Phase 1: Implementation

- [ ] S01T001 Implement trim() in apps/web/src/utils/string.ts
- [ ] S01T002 [P] Implement uppercase() in apps/web/src/utils/string.ts
- [ ] S01T003 [P] Implement lowercase() in apps/web/src/utils/string.ts

## Phase 2: Validation

- [ ] S01T004 Run npm run lint from apps/web/
- [ ] S01T005 Run npx tsc --noEmit from apps/web/
- [ ] S01T006 Verify JSDoc comments for all functions
```

### 6.3 预期生成的阶段任务

```
specs/002-xiaobei-utils/stages/
├── 01-string-utils/
│   └── tasks.md          ← Stage 01 任务
├── 02-number-utils/
│   └── tasks.md          ← Stage 02 任务
└── 03-array-utils/
    └── tasks.md          ← Stage 03 任务
```

---

## 第7步：更新全局任务编排

### 7.1 给 AI 的提示词

```
请更新全局任务编排文件。

输入：
- specs/002-xiaobei-utils/spec.md（全局规格）
- specs/002-xiaobei-utils/stages/01-string-utils/tasks.md
- specs/002-xiaobei-utils/stages/02-number-utils/tasks.md
- specs/002-xiaobei-utils/stages/03-array-utils/tasks.md

要求：
1. 更新 tasks.md：specs/002-xiaobei-utils/tasks.md
2. 全局任务编排包含：
   - Phase 1: Global Setup
   - Phase 2: Stage 01 - 字符串工具（引用阶段任务）
   - Phase 3: Stage 02 - 数字工具（引用阶段任务）
   - Phase 4: Stage 03 - 数组工具（引用阶段任务）
   - Final Phase: Global Validation
3. 每个阶段引用其独立的任务文件
4. 说明三个阶段可并行执行
```

### 7.2 全局 tasks.md 示例

```markdown
# Tasks: 小贝工具库

## Phase 1: Global Setup

- [ ] T001 Confirm global constraints in spec.md
- [ ] T002 Confirm target source directory apps/web/src/utils/

## Phase 2: Stage 01 - 字符串工具

**阶段任务**：见 [stages/01-string-utils/tasks.md](stages/01-string-utils/tasks.md)

## Phase 3: Stage 02 - 数字工具

**阶段任务**：见 [stages/02-number-utils/tasks.md](stages/02-number-utils/tasks.md)

## Phase 4: Stage 03 - 数组工具

**阶段任务**：见 [stages/03-array-utils/tasks.md](stages/03-array-utils/tasks.md)

## Final Phase: Global Validation

- [ ] T010 Run npm run lint from apps/web/
- [ ] T011 Run npx tsc --noEmit from apps/web/
- [ ] T012 Confirm no unit test files were added

## Stage Dependencies

- Stage 01: No dependency
- Stage 02: No dependency - 可与 Stage 01 并行
- Stage 03: No dependency - 可与 Stage 01/02 并行
```

---

## 第8步：执行实现

### 8.1 给 AI 的提示词（通用模板）

```
请执行 {STAGE_NAME} 的实现。

输入：
- specs/002-xiaobei-utils/stages/{STAGE_ID}/tasks.md
- specs/002-xiaobei-utils/stages/{STAGE_ID}/contract.md
- specs/002-xiaobei-utils/stages/{STAGE_ID}/plan.md

目标文件：apps/web/src/utils/{MODULE}.ts

实现要求：
1. 按 tasks.md 中的任务顺序执行
2. 实现三个函数：
   - {FUNC1}
   - {FUNC2}
   - {FUNC3}
3. 每个任务完成后标记为 - [X]
4. 实现完成后运行验证：npm run lint, npx tsc --noEmit

代码要求：
- 所有函数必须有完整的 TypeScript 类型声明
- 所有函数必须有 JSDoc 注释
- 使用 JavaScript 原生能力，不引入外部依赖
- 不创建单元测试文件
```

**具体执行时替换：**

#### Stage 01 - 字符串工具

```
{FUNC1}: trim(str: string): string
{FUNC2}: uppercase(str: string): string
{FUNC3}: lowercase(str: string): string
```

#### Stage 02 - 数字工具

```
{FUNC1}: add(a: number, b: number): number
{FUNC2}: multiply(a: number, b: number): number
{FUNC3}: formatNumber(num: number): string
```

#### Stage 03 - 数组工具

```
{FUNC1}: unique<T>(arr: T[]): T[]
{FUNC2}: sort(arr: number[]): number[]
{FUNC3}: filter<T>(arr: T[], fn: (item: T) => boolean): T[]
```

### 8.2 预期生成的源码

```
apps/web/src/utils/
├── string.ts              ← Stage 01 实现
├── number.ts             ← Stage 02 实现
├── array.ts              ← Stage 03 实现
├── security.ts           ← 现有文件（不修改）
└── secure-storage.ts     ← 现有文件（不修改）
```

---

## 完整目录结构

```
specs/002-xiaobei-utils/
├── spec.md                      ← 全局规格（Step 2）
├── plan.md                      ← 全局计划（Step 3）
├── tasks.md                     ← 全局任务编排（Step 7）
├── research.md                  ← 全局研究（Step 3）
├── data-model.md                ← 全局数据模型（Step 3）
├── quickstart.md                ← 全局快速开始（Step 3）
├── checklists/
│   └── requirements.md          ← 质量检查清单
├── contracts/
│   ├── string-utils.md          ← 接口契约（Step 3）
│   ├── number-utils.md          ← 接口契约（Step 3）
│   └── array-utils.md           ← 接口契约（Step 3）
└── stages/                      ← 阶段目录（按需扩展）
    ├── 01-string-utils/         ← Stage 01
    │   ├── spec.md              ← 阶段规格（Step 4）
    │   ├── plan.md              ← 阶段计划（Step 5）
    │   ├── tasks.md             ← 阶段任务（Step 6）
    │   ├── contract.md          ← 阶段契约（Step 5）
    │   ├── data-model.md        ← 阶段数据模型（Step 5）
    │   └── quickstart.md        ← 阶段快速开始（Step 5）
    ├── 02-number-utils/         ← Stage 02
    │   └── ...（同上）
    └── 03-array-utils/          ← Stage 03
        └── ...（同上）
```

---

## 三个初始需求文件

### docs/小贝项目-阶段1-字符串工具.md

```markdown
# 小贝项目 - 任务1：字符串工具函数

## 工具函数开发

### 字符串工具

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

### docs/小贝项目-阶段2-数字工具.md

```markdown
# 小贝项目 - 任务2：数字工具函数

## 工具函数开发

### 数字工具

- 目标描述
  - 实现 3 个简单的数字工具函数
- 上下文信息
  - add(a, b) - 两数相加
  - multiply(a, b) - 两数相乘
  - formatNumber(num) - 格式化数字显示
- 质量标准
  - 简单的单元测试
  - 类型声明完整
- 执行模式
  - plan-only
```

### docs/小贝项目-阶段3-数组工具.md

```markdown
# 小贝项目 - 任务3：数组工具函数

## 工具函数开发

### 数组工具

- 目标描述
  - 实现 3 个简单的数组工具函数
- 上下文信息
  - unique(arr) - 数组去重
  - sort(arr) - 数组排序
  - filter(arr, fn) - 数组过滤
- 质量标准
  - 简单的单元测试
  - 类型声明完整
- 执行模式
  - plan-only
```

---

## AI 提示词模板汇总

### Step 1: 创建 Feature

```
请帮我创建一个 Speckit feature：

创建小贝工具库，包含三个阶段：
- Stage 01: 字符串工具（trim, uppercase, lowercase）
- Stage 02: 数字工具（add, multiply, formatNumber）
- Stage 03: 数组工具（unique, sort, filter）

要求：
- Feature 目录：specs/002-xiaobei-utils
- 不要创建三个独立 feature，只创建一个统一的 feature
- 三个阶段作为同一个 feature 下的三个 User Stories
- 目标代码目录：apps/web/src/utils/
- 不需要单元测试
```

### Step 2: 全局规格

```
请执行 /speckit-specify 命令来生成全局规格文档。

需求输入：
docs/小贝项目-阶段1-字符串工具.md
docs/小贝项目-阶段2-数字工具.md
docs/小贝项目-阶段3-数组工具.md

规格要求：
1. Feature 名称：小贝工具库
2. Feature 目录：specs/002-xiaobei-utils/
3. 包含三个 User Stories / Stages（P1, P2, P3）
4. 每个 Stage 都要有独立的验收标准
5. Clarifications：去除单元测试要求
6. Stage Index 表格指向 stages/ 目录
```

### Step 3: 全局计划

```
请执行 /speckit-plan 命令来生成全局实现计划。

输入：specs/002-xiaobei-utils/spec.md

计划要求：
1. Technical Context: TypeScript 5.5.3, 无新增依赖
2. Testing: 不规划单元测试
3. Stage Index 指向 stages/ 目录
4. 三个阶段可并行执行
5. 生成 contracts/ 目录
```

### Step 4: 阶段规格（每个阶段单独执行）

```
请为 {STAGE_NAME} 生成阶段规格。

输入：
- docs/小贝项目-阶段{INDEX}-{STAGE_NAME}.md
- specs/002-xiaobei-utils/spec.md

要求：
1. 生成阶段目录：specs/002-xiaobei-utils/stages/{STAGE_ID}/
2. 生成阶段规格：specs/002-xiaobei-utils/stages/{STAGE_ID}/spec.md
3. 功能：{FUNCTIONS}
4. 目标文件：apps/web/src/utils/{MODULE}.ts
5. 包含/不包含范围清晰
6. 至少4条验收标准
```

### Step 5: 阶段计划（每个阶段单独执行）

```
请为 {STAGE_NAME} 生成阶段实现计划。

输入：
- specs/002-xiaobei-utils/stages/{STAGE_ID}/spec.md
- specs/002-xiaobei-utils/plan.md

要求：
1. 生成阶段计划：specs/002-xiaobei-utils/stages/{STAGE_ID}/plan.md
2. 技术上下文：TypeScript 5.5.3, 无新增依赖
3. 目标文件：apps/web/src/utils/{MODULE}.ts
4. 验证：npm run lint, npx tsc --noEmit
```

### Step 6: 阶段任务（每个阶段单独执行）

```
请为 {STAGE_NAME} 生成阶段任务清单。

输入：
- specs/002-xiaobei-utils/stages/{STAGE_ID}/spec.md
- specs/002-xiaobei-utils/stages/{STAGE_ID}/plan.md
- specs/002-xiaobei-utils/stages/{STAGE_ID}/contract.md

要求：
1. 生成阶段任务：specs/002-xiaobei-utils/stages/{STAGE_ID}/tasks.md
2. checklist 格式：- [ ] S{STAGE_NUM}TXXX
3. Phase 1: Implementation
4. Phase 2: Validation
5. 每个函数作为独立任务
```

### Step 7: 更新全局任务编排

```
请更新全局任务编排文件。

输入：
- specs/002-xiaobei-utils/spec.md
- specs/002-xiaobei-utils/stages/*/tasks.md

要求：
1. 更新 specs/002-xiaobei-utils/tasks.md
2. 引用每个阶段的独立任务文件
3. 说明三个阶段可并行执行
```

### Step 8: 执行实现（每个阶段单独执行）

```
请执行 {STAGE_NAME} 的实现。

输入：
- specs/002-xiaobei-utils/stages/{STAGE_ID}/tasks.md
- specs/002-xiaobei-utils/stages/{STAGE_ID}/contract.md

目标文件：apps/web/src/utils/{MODULE}.ts

实现要求：
1. 实现 {FUNCTIONS}
2. TypeScript 类型声明 + JSDoc 注释
3. 不引入外部依赖
4. 不创建单元测试文件
5. 完成后运行验证
```

---

## 验证与检查清单

### 全局文档验证

- [ ] `specs/002-xiaobei-utils/spec.md` 存在且完整
- [ ] `specs/002-xiaobei-utils/plan.md` 存在且完整
- [ ] `specs/002-xiaobei-utils/tasks.md` 存在且引用所有阶段
- [ ] `specs/002-xiaobei-utils/contracts/` 存在且包含 3 个契约

### 阶段文档验证（每个阶段）

- [ ] `stages/{STAGE_ID}/spec.md` 存在且完整
- [ ] `stages/{STAGE_ID}/plan.md` 存在且完整
- [ ] `stages/{STAGE_ID}/tasks.md` 存在且遵循格式
- [ ] `stages/{STAGE_ID}/contract.md` 存在
- [ ] `stages/{STAGE_ID}/data-model.md` 存在
- [ ] `stages/{STAGE_ID}/quickstart.md` 存在

### 源码验证

- [ ] `apps/web/src/utils/string.ts` 包含 3 个函数
- [ ] `apps/web/src/utils/number.ts` 包含 3 个函数
- [ ] `apps/web/src/utils/array.ts` 包含 3 个函数
- [ ] 所有函数都有 TypeScript 类型声明
- [ ] 所有函数都有 JSDoc 注释

### 质量验证

- [ ] `npm run lint` 通过
- [ ] `npx tsc --noEmit` 通过
- [ ] 没有创建单元测试文件

---

## 学习检查清单

完成整个流程后，你应当：

- [ ] 理解 stages 子目录架构的优势（独立隔离、按需扩展）
- [ ] 掌握如何从零开始创建完整的 feature 结构
- [ ] 掌握如何为每个阶段生成独立的规格、计划、任务
- [ ] 掌握如何更新全局任务编排引用阶段任务
- [ ] 理解三个阶段可并行执行的原因
- [ ] 能够独立执行完整的 speckit stages 工作流程

---

## 扩展性说明

### 添加新阶段

当需要添加新阶段时，只需：

1. 在 `stages/` 下创建新的阶段目录，如 `04-xxx-utils/`
2. 执行 Step 4-6 为新阶段生成文档
3. 执行 Step 7 更新全局任务编排
4. 执行 Step 8 实现新功能

**不影响已有阶段，独立隔离！**

### 架构优势

1. **独立隔离**：每个阶段有自己的完整文档集
2. **按需扩展**：可以随时添加新阶段
3. **并行开发**：多个阶段可以同时开发
4. **清晰引用**：全局文档引用阶段文档，层次分明

---

**文档结束**

---

**恭喜你完成了 Speckit Stages 子目录架构的完整学习！现在你可以从零开始，按照 stages 子目录的架构构建任何多阶段工具库！**
