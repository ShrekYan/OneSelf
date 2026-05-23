# Speckit Specify 执行机制详解

> **目标读者**: 想了解 `/speckit-specify` 命令内部执行机制的新手
> **文档性质**: 需求定义阶段技术手册
> **核心问题**: 用户的一句话需求，如何转化为结构化的规格说明书？

---

## 一、Specify 阶段定位

```
[Specify] → Clarify → Plan → Tasks → Implement
   ↑
你在这里
```

**核心职责**: `Specify` 是整个 Speckit 工作流的**起点和基石**。它将用户的自然语言描述转化为结构化的规格说明书（`spec.md`），成为后续所有阶段的**Single Source of Truth（唯一真相源）**。

**类比**: 如果后续阶段是"设计图纸→施工→验收"，Specify 就是"业主需求书"——它回答的是"**用户想要什么**"，而不是"**怎么实现**"。

**关键原则**:

- `spec.md` 只描述 **WHAT**（做什么）和 **WHY**（为什么做），不描述 **HOW**（怎么做）
- 所有下游文档（plan.md、tasks.md、代码）都基于 `spec.md` 生成
- `spec.md` 一旦变更，下游文档**必须**同步更新

---

## 二、执行前准备（Pre-Execution Checks）

在正式开始生成 spec 之前，AI 会先执行一系列前置检查。

### 2.1 Extension Hooks 检查

```text
检查 .specify/extensions.yml 是否存在
    │
    ├── 不存在 → 静默跳过，继续执行
    │
    └── 存在 → 读取 hooks.before_specify 配置
          │
          ├── 筛选：跳过 enabled: false 的钩子
          ├── 筛选：跳过有非空 condition 的钩子（由 HookExecutor 处理）
          └── 对每个可执行钩子：
                ├─ optional: true → 显示可选钩子，等用户决定是否执行
                └─ optional: false → 自动执行，等待结果后再继续
```

**钩子命令转换规则**: `speckit.git.commit` → `/speckit-git-commit`

**实际作用**: 常见的 `before_specify` 钩子是 Git 分支创建。例如自动创建并切换到特性分支 `001-string-utils`。

### 2.2 用户输入获取

`Specify` 的输入来源有两种：

| 来源             | 示例                                  | 处理方式                     |
| ---------------- | ------------------------------------- | ---------------------------- |
| **命令行参数**   | `/speckit-specify "实现用户登录功能"` | 直接作为 feature description |
| **Skill 上下文** | 用户之前在对话中描述的需求            | 从 Skill 调用上下文中提取    |

**关键规则**: 如果输入为空，直接报错 `"No feature description provided"`。

---

## 三、核心执行流程（Execution Flow）

### 3.1 第一步：生成 Short Name（特性简称）

**作用**: 从用户的自然语言描述中提取关键词，生成 2-4 个词的简称，用于目录命名和分支命名。

**生成规则**:

```text
输入: "apps/web/src/utils 中实现 3 个简单的字符串工具函数"
    │
    ├── 提取关键词: "字符串"、"工具函数"
    ├── 使用 action-noun 格式（动作-名词）
    └── 输出: "string-utils"
```

| 输入示例                                   | 输出示例                 | 规则               |
| ------------------------------------------ | ------------------------ | ------------------ |
| "I want to add user authentication"        | `user-auth`              | 提取核心动作和对象 |
| "Implement OAuth2 integration for the API" | `oauth2-api-integration` | 保留技术术语缩写   |
| "Create a dashboard for analytics"         | `analytics-dashboard`    | 动作-名词格式      |
| "Fix payment processing timeout bug"       | `fix-payment-timeout`    | 保留问题关键词     |

### 3.2 第二步：创建特性目录

**目录命名规则**:

```text
SPECS_DIR（默认 specs/）
    │
    ├── 检查 .specify/init-options.json 中的 branch_numbering
    │     ├── "timestamp" → 前缀 = YYYYMMDD-HHMMSS（当前时间戳）
    │     └── "sequential" 或不存在 → 前缀 = NNN（下一个可用 3 位数）
    │
    └── 构造目录名: <prefix>-<short-name>
          │
          ├── 示例（sequential）: specs/001-string-utils
          └── 示例（timestamp）: specs/20260319-143022-string-utils
```

**Sequential 编号逻辑**:

```text
扫描 specs/ 目录下所有子目录
    │
    ├── 提取数字前缀（如 001、002、015）
    ├── 找出最大值（如 015）
    └── 新编号 = 最大值 + 1（如 016）
```

**创建的文件结构**:

```text
specs/001-string-utils/
├── spec.md              ← 核心文件：规格说明书
└── checklists/
    └── requirements.md  ← 规格质量检查清单
```

**持久化配置**:

```text
将目录路径写入 .specify/feature.json:
{
  "feature_directory": "specs/001-string-utils"
}
```

这个文件让后续命令（`/speckit-plan`、`/speckit-tasks`）能自动找到当前特性目录。

### 3.3 第三步：加载模板

**模板来源**: `.specify/templates/spec-template.md`

**模板结构**:

```markdown
# Feature Specification: [FEATURE_NAME]

**Feature Branch**: [BRANCH_NAME]
**Created**: [DATE]
**Status**: Draft
**Input**: User description: "[USER_INPUT]"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - [标题] (Priority: P1)

[故事描述]
**Why this priority**: [理由]
**Independent Test**: [独立测试方式]
**Acceptance Scenarios**:

1. **Given** ... **When** ... **Then** ...

## Edge Cases

- [边界情况 1]
- [边界情况 2]

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: [需求描述]

### Key Entities _(include if feature involves data)_

- **[实体名]**: [描述]

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: [可测量的成功标准]

## Clarifications

### Session [DATE]

- **Q**: [问题] **A**: [答案]

## Assumptions

- [假设条件 1]
- [假设条件 2]
```

**模板作用**: 提供标准化的章节结构，确保每个 spec 都包含完整的信息，不遗漏关键内容。

### 3.4 第四步：解析用户输入并填充模板

这是 `Specify` 的核心步骤。AI 从用户的一句话描述中提取信息，填充到模板中。

#### 4.1 输入解析策略

```text
用户输入: "apps/web/src/utils 中实现 3 个简单的字符串工具函数"
    │
    ├── 提取关键概念:
    │     ├── 动作: "实现"
    │     ├── 对象: "字符串工具函数"
    │     ├── 数量: "3 个"
    │     ├── 位置: "apps/web/src/utils"
    │     └── 属性: "简单的"
    │
    ├── 识别隐含信息:
    │     ├── "工具函数" → 纯函数、无副作用
    │     ├── "字符串" → 涉及文本处理
    │     └── "apps/web/src/utils" → 前端项目内部模块
    │
    └── 推导用户故事:
          ├── 去除首尾空格（trim）
          ├── 转为大写（uppercase）
          └── 转为小写（lowercase）
```

#### 4.2 填充各章节

**User Scenarios & Testing（用户故事）**

```text
从用户描述中提取每个独立功能 → 生成一个用户故事
    │
    ├── 用户故事格式:
    │     "作为 [角色]，我需要 [功能]，以便 [价值]"
    │
    ├── 优先级分配:
    │     ├── P1（最高）: 核心功能、MVP 必备
    │     ├── P2（中等）: 重要但可延后
    │     └── P3（低）: 锦上添花
    │
    └── 验收场景格式（Given-When-Then）:
          Given [前置条件]
          When [操作]
          Then [预期结果]
```

**本案例生成示例**:

```markdown
### User Story 1 - 去除字符串首尾空格 (Priority: P1)

作为前端开发者，我需要 trim 函数来去除字符串的首尾空格，
以便清理用户输入数据，避免空格导致的匹配或显示异常。

**Why this priority**: 去除首尾空格是最常见的字符串预处理操作。

**Independent Test**: 向 trim 函数传入包含首尾空格的字符串，
验证返回结果已去除空格，且中间空格保留。

**Acceptance Scenarios**:

1. **Given** 输入字符串为 " hello world "，
   **When** 调用 trim 函数，
   **Then** 返回 "hello world"
2. **Given** 输入字符串为 "hello world"（无首尾空格），
   **When** 调用 trim 函数，
   **Then** 返回原字符串 "hello world"
```

**Edge Cases（边界情况）**

```text
从功能描述中推导可能的异常输入:
    ├── 空输入: 空字符串、null、undefined
    ├── 极端输入: 超长字符串、特殊字符
    ├── 类型边界: 非字符串输入（如果允许）
    └── 并发/性能: 大规模调用时的行为
```

**本案例生成示例**:

```markdown
## Edge Cases

- 传入 `null` 或 `undefined` 时，函数应返回空字符串 `""`，不抛出异常
- 输入字符串仅包含空格时，trim 函数应返回空字符串
- 输入字符串包含多语言字符时，函数行为应符合预期
```

**Requirements（功能需求）**

```text
将用户故事转化为可编号的功能需求:
    ├── FR-001: [第一个功能]
    ├── FR-002: [第二个功能]
    └── FR-003: [第三个功能]
```

**本案例生成示例**:

```markdown
### Functional Requirements

- **FR-001**: 系统必须提供 `trim` 函数，接收一个字符串参数，
  返回去除首尾空白字符后的字符串
- **FR-002**: 系统必须提供 `uppercase` 函数，接收一个字符串参数，
  返回全大写形式的字符串
- **FR-003**: 系统必须提供 `lowercase` 函数，接收一个字符串参数，
  返回全小写形式的字符串
- **FR-004**: 所有函数必须有显式、完整的类型声明
```

**Success Criteria（成功标准）**

```text
将需求转化为可测量的指标:
    ├── 时间指标: "30 秒内找到并使用"
    ├── 覆盖率指标: "100% 的函数调用获得类型提示"
    └── 行为一致性: "所有工具函数行为一致且可预测"
```

**关键规则**: 成功标准必须是 **技术无关** 的。不能写"使用 TypeScript 实现"，而要写"开发者可以在 30 秒内找到并使用"。

**Clarifications（澄清记录）**

```text
初始为空，后续通过 /speckit-clarify 填充
```

**Assumptions（假设条件）**

```text
记录开发前提假设:
    ├── 技术假设: "工具函数仅处理标准 Unicode 字符串"
    ├── 范围假设: "不对外发布为独立 npm 包"
    └── 质量假设: "本特性不包含单元测试"
```

### 3.5 第五步：生成 [NEEDS CLARIFICATION]（如需）

**作用**: 当 AI 发现用户描述中有模糊、不确定或可能影响实现的关键决策点时，会标记 `[NEEDS CLARIFICATION]`。

**触发条件**:

| 情况                   | 示例                        | 是否标记             |
| ---------------------- | --------------------------- | -------------------- |
| 多种合理理解且影响不同 | "快速处理" → 多快？         | ✅                   |
| 缺少关键信息           | 未提及是否支持空值          | ✅                   |
| 有合理默认值           | 数据保留期限 → 可用行业标准 | ❌                   |
| 纯技术细节             | "用 REST 还是 GraphQL"      | ❌（留给 Plan 阶段） |

**限制**: 最多 **3 个** `[NEEDS CLARIFICATION]` 标记。超过 3 个时，AI 会对低影响项做合理猜测。

**本案例**: 初始 Specify 时没有未澄清项（用户描述足够明确）。后续通过 `/speckit-clarify` 补充了 4 条澄清记录。

---

## 四、规格质量验证（Quality Validation）

生成初始 spec 后，AI 不会立即输出，而是先进行质量验证。

### 4.1 创建检查清单

**文件**: `specs/XXX/checklists/requirements.md`

**生成内容**:

```markdown
# Specification Quality Checklist: [FEATURE NAME]

**Purpose**: Validate specification completeness and quality
**Created**: [DATE]
**Feature**: [Link to spec.md]

## Content Quality

- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

## Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Success criteria are technology-agnostic
- [ ] All acceptance scenarios are defined
- [ ] Edge cases are identified
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

## Feature Readiness

- [ ] All functional requirements have clear acceptance criteria
- [ ] User scenarios cover primary flows
- [ ] Feature meets measurable outcomes
- [ ] No implementation details leak into specification

## Notes

- Items marked incomplete require spec updates
```

**本案例结果**: 所有 16 项检查通过，标记为 `[x]`。

### 4.2 运行验证检查

AI 逐条检查 spec.md 是否符合清单要求：

```text
检查项 1: "No implementation details"
    ├── 扫描 spec.md 中是否出现 "TypeScript"、"React"、"REST API" 等实现词汇
    ├── 本案例: spec.md 只说"字符串工具函数"，未提技术栈 ✅
    └── 标记: - [x]

检查项 2: "Requirements are testable"
    ├── 检查每个需求是否有明确的 Given-When-Then 验收场景
    ├── 本案例: 每个函数都有 3 个验收场景 ✅
    └── 标记: - [x]

检查项 3: "Success criteria are measurable"
    ├── 检查是否包含具体时间、百分比、数量指标
    ├── 本案例: "30 秒内"、"100%"、"行为一致" ✅
    └── 标记: - [x]
```

### 4.3 处理 [NEEDS CLARIFICATION]

如果 spec.md 中存在 `[NEEDS CLARIFICATION]` 标记：

```text
提取所有标记（最多保留 3 个最关键的）
    │
    ├── 对每个标记，生成问题选项：
    │     ├── Question 1: [主题]
    │     │     ├── Context: [引用相关 spec 段落]
    │     │     ├── 选项 A: [答案] → [影响]
    │     │     ├── 选项 B: [答案] → [影响]
    │     │     ├── 选项 C: [答案] → [影响]
    │     │     └── Custom: 用户自定义答案
    │     │
    │     ├── Question 2: ...
    │     └── Question 3: ...
    │
    └── 等待用户回答后：
          ├── 替换 spec.md 中的 [NEEDS CLARIFICATION] 标记
          ├── 更新相关章节（Requirements、Edge Cases 等）
          └── 重新运行验证（最多 3 轮）
```

**本案例**: 初始 Specify 时无未澄清项，所以跳过此步骤。

### 4.4 验证结果处理

| 结果                           | 行为                                    |
| ------------------------------ | --------------------------------------- |
| **所有检查通过**               | 标记 checklist 为完成，进入报告阶段     |
| **检查失败（非澄清项）**       | 自动修复 spec.md，重新验证（最多 3 轮） |
| **仍有 [NEEDS CLARIFICATION]** | 向用户提问，等待回答后更新              |

---

## 五、生成的文件体系

### 5.1 文件清单

| 文件                | 路径                                   | 作用             | 是否派生 |
| ------------------- | -------------------------------------- | ---------------- | -------- |
| **spec.md**         | `specs/XXX/spec.md`                    | 核心真相源       | ❌ 源头  |
| **requirements.md** | `specs/XXX/checklists/requirements.md` | 质量检查清单     | ✅ 派生  |
| **feature.json**    | `.specify/feature.json`                | 当前特性目录指针 | ✅ 派生  |

### 5.2 文件关系

```text
用户输入（自然语言）
    │
    ▼
/speckit-specify
    │
    ├── 生成 spec.md（核心文件）
    ├── 生成 checklists/requirements.md（质量门禁）
    └── 更新 .specify/feature.json（目录指针）
```

### 5.3 spec.md 的关键章节

```text
# Feature Specification

## User Scenarios & Testing      ← 谁要用、为什么用、怎么用（Given-When-Then）
## Edge Cases                     ← 异常情况处理（null、空字符串、超长输入）
## Requirements                   ← 功能需求编号（FR-001、FR-002...）
## Success Criteria               ← 可测量的成功标准（SC-001...）
## Clarifications                 ← 需求澄清问答历史
## Assumptions                    ← 开发前提假设
```

---

## 六、输入解析的底层逻辑

### 6.1 概念提取模型

AI 从用户输入中提取以下信息：

| 维度                    | 提取内容       | 本案例示例                         |
| ----------------------- | -------------- | ---------------------------------- |
| **Actors（角色）**      | 谁使用这个功能 | 前端开发者                         |
| **Actions（动作）**     | 要执行什么操作 | 实现、调用                         |
| **Data（数据）**        | 处理什么数据   | 字符串                             |
| **Constraints（约束）** | 有什么限制     | 在 apps/web/src/utils 中、3 个函数 |
| **Quality（质量）**     | 有什么标准     | 类型声明完整                       |

### 6.2 用户故事推导

```text
输入: "实现 trim、uppercase、lowercase"
    │
    ├── 功能拆分:
    │     ├── "trim" → "去除首尾空格"
    │     ├── "uppercase" → "转为大写"
    │     └── "lowercase" → "转为小写"
    │
    └── 为每个功能生成用户故事:
          "作为前端开发者，我需要 trim 函数来..."
```

### 6.3 验收场景生成

```text
功能: trim（去除首尾空格）
    │
    ├── 正向场景:
    │     ├── "  hello world  " → "hello world"（有空格）
    │     └── "hello world" → "hello world"（无空格）
    │
    ├── 边界场景:
    │     ├── "" → ""（空字符串）
    │     └── "   " → ""（纯空格）
    │
    └── 异常场景:
          └── null → ""（空值安全）
```

---

## 七、实战案例：string-utils 的 Specify 执行记录

### 7.1 用户输入

```text
- 目标描述
  - apps/web/src/utils 中实现 3 个简单的字符串工具函数
- 上下文信息
  - trim() - 去除首尾空格
  - uppercase() - 转为大写
  - lowercase() - 转为小写
- 质量标准
  - 类型声明完整
- 执行模式
  - plan-only
```

### 7.2 执行步骤

**Step 1: 生成 Short Name**

```text
输入: "apps/web/src/utils 中实现 3 个简单的字符串工具函数"
关键词: "字符串"、"工具函数"
输出: "string-utils"
```

**Step 2: 确定目录名**

```text
扫描 specs/ 目录 → 已有目录: 无（或最大编号为 000）
编号模式: sequential（默认）
新编号: 001
目录名: specs/001-string-utils
```

**Step 3: 创建文件结构**

```text
mkdir -p specs/001-string-utils/checklists
cp .specify/templates/spec-template.md specs/001-string-utils/spec.md
```

**Step 4: 填充 spec.md**

```text
Feature Name: 前端字符串工具函数
Branch: [20260320-string-utils]
Date: 2026-05-16

User Story 1: 去除字符串首尾空格 (P1)
User Story 2: 字符串转为大写 (P1)
User Story 3: 字符串转为小写 (P1)

Edge Cases:
  - 传入 null 或 undefined（后续通过 clarify 补充）
  - 输入仅包含空格
  - 多语言字符

Requirements:
  FR-001: 提供 trim 函数
  FR-002: 提供 uppercase 函数
  FR-003: 提供 lowercase 函数
  FR-004: 完整类型声明

Success Criteria:
  SC-001: 30 秒内找到并使用
  SC-002: 100% 类型提示
  SC-003: 行为一致可预测

Assumptions:
  - 工具函数仅处理标准 Unicode 字符串
  - 不对外发布为独立 npm 包
```

**Step 5: 生成检查清单**

```text
创建 specs/001-string-utils/checklists/requirements.md
共 16 项检查
```

**Step 6: 运行验证**

```text
逐条检查 spec.md 的 16 项指标
结果: 全部通过 ✅
```

**Step 7: 报告完成**

```text
输出:
  - SPECIFY_FEATURE_DIRECTORY: specs/001-string-utils
  - SPEC_FILE: specs/001-string-utils/spec.md
  - Checklist: 16/16 通过
  - 下一步建议: /speckit-clarify 或 /speckit-plan
```

### 7.3 初始 spec 与最终 spec 对比

| 章节             | 初始 Specify             | 经过 4 次 Clarify 后         |
| ---------------- | ------------------------ | ---------------------------- |
| Edge Cases       | 基本边界（空格、多语言） | **新增** null/undefined 处理 |
| Clarifications   | 空                       | **新增** 4 条问答记录        |
| Assumptions      | 基本假设                 | **新增** 空值安全处理假设    |
| Success Criteria | 3 条标准                 | 不变                         |
| Requirements     | 4 条需求                 | 不变                         |

---

## 八、常见场景与处理

### 8.1 场景一：需求非常明确

```text
用户: "实现一个用户登录功能，支持手机号+验证码"
    │
    ├── Short Name: user-login
    ├── 用户故事: 1 个核心故事
    ├── Edge Cases: 验证码过期、手机号格式错误
    └── NEEDS CLARIFICATION: 0 个（信息足够）
```

### 8.2 场景二：需求较模糊

```text
用户: "做个好看的首页"
    │
    ├── Short Name: homepage-design
    ├── NEEDS CLARIFICATION:
    │     ├── Q1: "好看"的定义是什么？（有设计稿还是 AI 自由发挥？）
    │     ├── Q2: 首页需要展示哪些内容？（文章列表？推荐？广告？）
    │     └── Q3: 是否需要响应式布局？（移动端适配？）
    └── 等待用户回答后更新 spec
```

### 8.3 场景三：需求范围过大

```text
用户: "做一个电商系统"
    │
    ├── Short Name: e-commerce-platform
    ├── AI 判断: 范围过大，需要拆分
    ├── 生成的用户故事可能包含:
    │     ├── US1: 用户注册登录
    │     ├── US2: 商品浏览搜索
    │     ├── US3: 购物车
    │     ├── US4: 订单系统
    │     └── US5: 支付系统
    └── 建议用户: "是否先聚焦核心功能？推荐从 US1 开始"
```

---

## 九、FAQ

### Q1: 为什么 spec.md 不能包含技术实现细节？

**A**: spec.md 是"需求层"，plan.md 才是"实现层"。如果 spec 里写了"用 TypeScript 实现"，就变成了实现细节泄漏。Spec 应该只回答"用户需要什么"，让 Plan 阶段来决定"用什么技术实现"。

### Q2: [NEEDS CLARIFICATION] 是谁来回答？

**A**: 用户（你）来回答。AI 会呈现问题和选项，你选择一个或给出自己的答案，AI 会将答案写入 spec.md 的 Clarifications 章节。

### Q3: 如果我不认同 AI 生成的用户故事怎么办？

**A**: 直接编辑 `spec.md` 修改用户故事，或者通过 `/speckit-clarify` 说明你的真实意图。`spec.md` 是文本文件，随时可以手动编辑。

### Q4: 为什么目录名是 `001-string-utils` 而不是 `string-utils`？

**A**: 数字前缀（`001`）用于确保目录按创建顺序排列，便于管理多个特性。编号模式可以是 sequential（顺序号）或 timestamp（时间戳），在 `.specify/init-options.json` 中配置。

### Q5: checklists/requirements.md 需要我手动维护吗？

**A**: 通常不需要。它由 `/speckit-specify` 自动生成，验证 spec 质量。如果后续修改了 spec，AI 会同步更新检查清单状态。

### Q6: 可以多次运行 `/speckit-specify` 吗？

**A**: 可以。每次运行会为同一个需求生成新的特性目录（如 `002-string-utils`），但通常不需要。更好的做法是：生成后用 `/speckit-clarify` 调整现有 spec。

### Q7: 用户故事中的 Priority 是怎么确定的？

**A**: AI 根据功能的核心程度自动判断：

- **P1**: 核心功能，没有它特性就不完整
- **P2**: 重要功能，但可以后续迭代
- **P3**: 增强功能，nice to have

你也可以在 clarify 阶段调整优先级。

---

## 十、总结

### Specify 阶段的核心特征

| 特征           | 说明                               |
| -------------- | ---------------------------------- |
| **工作流起点** | 所有后续阶段都依赖 spec.md         |
| **需求层**     | 只关心 WHAT，不关心 HOW            |
| **结构化转换** | 将自然语言转化为标准化的 spec 模板 |
| **质量门禁**   | 自动生成检查清单，确保规格达到标准 |
| **可澄清**     | 支持通过 clarify 迭代完善          |

### Specify 的执行哲学

> **"先把需求说明白，再动手写代码"**

很多开发问题（返工、理解不一致、遗漏边界情况）的根源是"需求没说清楚就开始写代码"。Specify 阶段强制你在写第一行代码之前，把以下问题想明白：

1. **谁**要用这个功能？（角色）
2. **什么场景下**用？（用户故事）
3. **怎么用**？（验收场景 Given-When-Then）
4. **出错了怎么办**？（边界情况）
5. **怎么算做好了**？（成功标准）

### 与后续阶段的关系

```text
spec.md（Specify 输出）
    │
    ├── 输入给 Plan → 决定"用什么技术实现"
    ├── 输入给 Tasks → 决定"具体做哪些事"
    ├── 输入给 Implement → 决定"代码要满足什么验收标准"
    └── 输入给 Test → 决定"测试用例覆盖哪些场景"
```

---

_本文档详细解析了 `/speckit-specify` 命令的完整执行流程、输入解析策略和规格质量验证机制。_
