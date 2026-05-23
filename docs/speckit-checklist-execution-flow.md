# Speckit Checklist 执行机制详解

> **目标读者**: 想了解 `/speckit-checklist` 命令内部执行机制的新手
> **文档性质**: 需求质量验证阶段技术手册
> **核心问题**: 如何为需求规格生成质量检查清单？
> **权威来源**: 项目内置 Skill 定义（`.claude/skills/speckit-checklist`）

---

## 一、Checklist 阶段定位

```
Specify → Clarify → Plan → Tasks → Implement
              ↓
         [Checklist]  ← 可以发生在任何阶段之后
```

**核心职责**: `Checklist` 是 Speckit 工作流中的**需求质量验证环节**。它为当前特性的规格说明书（spec.md）生成结构化的质量检查清单，验证需求本身的完整性、清晰度、一致性和可测量性。

**最关键的概念**:

> **Checklist = "Unit Tests for English"**
>
> Checklist 不是测试代码实现是否正确，而是测试**需求描述本身是否写得好**。

### 1.1 不是什么

| ❌ 不是       | 示例                                 |
| ------------- | ------------------------------------ |
| 不是实现验证  | "Verify the button clicks correctly" |
| 不是功能测试  | "Test error handling works"          |
| 不是 API 测试 | "Confirm the API returns 200"        |
| 不是代码审查  | "Check if code matches the spec"     |

### 1.2 是什么

| ✅ 是      | 示例                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| 完整性检查 | "Are visual hierarchy requirements defined for all card types?"            |
| 清晰度检查 | "Is 'prominent display' quantified with specific sizing?"                  |
| 一致性检查 | "Are hover state requirements consistent across all interactive elements?" |
| 覆盖度检查 | "Are accessibility requirements defined for keyboard navigation?"          |
| 边界检查   | "Does the spec define what happens when logo image fails to load?"         |

**类比**:

- `spec.md` = 用英文写的"代码"（需求描述）
- `checklist` = 这段"代码"的单元测试套件（验证需求写得对不对）

---

## 二、执行前准备（Pre-Execution Checks）

### 2.1 Extension Hooks 检查

```text
检查 .specify/extensions.yml 是否存在
    │
    ├── 不存在 → 静默跳过，继续执行
    │
    └── 存在 → 读取 hooks.before_checklist 配置
          │
          ├── 筛选：跳过 enabled: false 的钩子
          ├── 筛选：跳过有非空 condition 的钩子（由 HookExecutor 处理）
          └── 对每个可执行钩子：
                ├─ optional: true → 显示可选钩子，等用户决定是否执行
                └─ optional: false → 自动执行，等待结果后再继续
```

**钩子命令转换规则**: `speckit.git.commit` → `/speckit-git-commit`

### 2.2 Setup 脚本执行

**命令**: `.specify/scripts/bash/check-prerequisites.sh --json`

**输出字段**:

| 字段             | 含义         | 示例                                                |
| ---------------- | ------------ | --------------------------------------------------- |
| `FEATURE_DIR`    | 当前特性目录 | `specs/001-string-utils`                            |
| `AVAILABLE_DOCS` | 可用文档列表 | `["research.md", "data-model.md", "quickstart.md"]` |

**作用**: 定位当前特性的规格文件和已生成的设计文档。

---

## 三、核心执行流程（Execution Flow）

Checklist 的执行分为 **7 个步骤**：

```text
Step 1: Setup
    └── 运行 check-prerequisites.sh，获取 FEATURE_DIR 和 AVAILABLE_DOCS

Step 2: Clarify Intent（动态澄清）
    └── 生成最多 3 个上下文澄清问题，理解用户意图

Step 3: Understand User Request
    └── 结合 $ARGUMENTS + 澄清答案，推导 checklist 主题和聚焦领域

Step 4: Load Feature Context
    └── 从 FEATURE_DIR 读取 spec.md / plan.md / tasks.md

Step 5: Generate Checklist
    └── 创建 checklists/[domain].md，生成质量检查项

Step 6: Structure Reference
    └── 遵循 checklist-template.md 模板格式

Step 7: Report
    └── 输出文件路径、项数、创建或追加状态
```

---

## 四、Step 2: 动态澄清（Clarify Intent）

### 4.1 为什么需要澄清

Checklist 的聚焦领域非常广泛（UX、API、安全、性能等），AI 需要理解用户想要哪种类型的检查清单。

### 4.2 信号提取算法

AI 从用户输入和已有文档中提取以下信号：

```text
1. 特性领域关键词: auth, latency, UX, API, security...
2. 风险指标: "critical", "must", "compliance"...
3. 利益相关者暗示: "QA", "review", "security team"...
4. 明确的交付物: "a11y", "rollback", "contracts"...
```

### 4.3 聚类与排序

```text
将信号聚类为最多 4 个候选聚焦领域，按相关性排序
    │
    ├── 领域 1（最相关）
    ├── 领域 2
    ├── 领域 3
    └── 领域 4
```

### 4.4 问题原型（Question Archetypes）

AI 从以下原型中选择最多 3 个问题：

| 原型                                  | 示例                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Scope refinement**（范围细化）      | "Should this include integration touchpoints or stay limited to local module correctness?" |
| **Risk prioritization**（风险优先级） | "Which risk areas should receive mandatory gating checks?"                                 |
| **Depth calibration**（深度校准）     | "Is this a lightweight pre-commit sanity list or a formal release gate?"                   |
| **Audience framing**（受众定位）      | "Will this be used by the author only or peers during PR review?"                          |
| **Boundary exclusion**（边界排除）    | "Should we explicitly exclude performance tuning items this round?"                        |
| **Scenario class gap**（场景缺口）    | "No recovery flows detected—are rollback paths in scope?"                                  |

### 4.5 问题格式规则

- 选项以紧凑表格呈现：`Option | Candidate | Why It Matters`
- 最多 A~E 5 个选项
- 不询问用户已经说过的话
- 避免猜测（不 hallucination），不确定时直接问

### 4.6 默认值（当无法交互时）

| 维度                 | 默认值                                          |
| -------------------- | ----------------------------------------------- |
| **Depth**（深度）    | Standard                                        |
| **Audience**（受众） | Reviewer (PR) if code-related; Author otherwise |
| **Focus**（聚焦）    | Top 2 relevance clusters                        |

### 4.7 追问机制

如果 ≥2 个场景类别（Alternate / Exception / Recovery / Non-Functional）仍然不清晰，AI 可以追问最多 2 个针对性问题（Q4/Q5），但**总问题数不超过 5 个**。

---

## 五、Step 4: 加载特性上下文

### 5.1 读取的文档

| 文档       | 读取内容       | 用途                         |
| ---------- | -------------- | ---------------------------- |
| `spec.md`  | 功能需求和范围 | 核心输入，检查需求质量       |
| `plan.md`  | 技术细节和依赖 | 检查技术约束是否在需求中体现 |
| `tasks.md` | 实现任务       | 检查任务是否覆盖所有需求场景 |

### 5.2 加载策略

```text
上下文加载策略（避免全文倾倒）:
    ├── 仅加载与当前聚焦领域相关的部分
    ├── 长段落优先总结为简洁的场景/需求 bullet
    ├── 渐进式披露：发现缺口后再补充检索
    └── 大文档生成 interim summary items 而非嵌入原文
```

---

## 六、Step 5: 生成 Checklist（核心步骤）

### 6.1 文件创建规则

```text
目录: FEATURE_DIR/checklists/
文件名: [domain].md（短描述性名称）
    ├── 示例: ux.md, api.md, security.md, performance.md

文件处理行为:
    ├── 文件不存在 → 新建，编号从 CHK001 开始
    └── 文件存在 → 追加，从最后一个 CHK ID 继续（如 CHK015 后接 CHK016）

重要规则: 绝不删除或替换已有内容，始终保留并追加
```

### 6.2 核心原则：测试需求，不是测试实现

**Every checklist item MUST evaluate the REQUIREMENTS THEMSELVES for:**

| 质量维度                      | 检查内容                    |
| ----------------------------- | --------------------------- |
| **Completeness**（完整性）    | 所有必要需求是否都已存在？  |
| **Clarity**（清晰度）         | 需求是否无歧义且具体？      |
| **Consistency**（一致性）     | 需求之间是否相互对齐？      |
| **Measurability**（可测量性） | 需求是否可以客观验证？      |
| **Coverage**（覆盖度）        | 所有场景/边界是否都被覆盖？ |

### 6.3 分类结构

```markdown
## Requirement Completeness

## Requirement Clarity

## Requirement Consistency

## Acceptance Criteria Quality

## Scenario Coverage

## Edge Case Coverage

## Non-Functional Requirements

## Dependencies & Assumptions

## Ambiguities & Conflicts
```

### 6.4 项目结构格式

```markdown
- [ ] CHK001 - <问题形式的检查项> [<质量维度>, <追溯标记>]
```

**追溯标记（Traceability）**:

- `[Spec §X.Y]` - 引用 spec 的具体章节
- `[Gap]` - 发现缺失的需求
- `[Ambiguity]` - 发现歧义
- `[Conflict]` - 发现冲突
- `[Assumption]` - 发现未验证的假设

**最低要求**: ≥80% 的检查项必须包含至少一个追溯标记。

### 6.5 正确 vs 错误的写法

**❌ 错误（测试实现）**:

```markdown
- [ ] CHK001 - Verify landing page displays 3 episode cards
- [ ] CHK002 - Test hover states work correctly on desktop
- [ ] CHK003 - Confirm logo click navigates to home page
- [ ] CHK004 - Check that related episodes section shows 3-5 items
```

**✅ 正确（测试需求质量）**:

```markdown
- [ ] CHK001 - Are the number and layout of featured episodes explicitly specified? [Completeness, Spec §FR-1]
- [ ] CHK002 - Are hover state requirements consistently defined for all interactive elements? [Consistency, Spec §FR-3]
- [ ] CHK003 - Are navigation requirements clear for all clickable brand elements? [Clarity, Spec §FR-10]
- [ ] CHK004 - Is the selection criteria for related episodes documented? [Gap, Spec §FR-5]
- [ ] CHK005 - Are loading state requirements defined for asynchronous data? [Gap]
- [ ] CHK006 - Can "visual hierarchy" requirements be objectively measured? [Measurability, Spec §FR-1]
```

**关键区别**:

| 维度     | 错误                         | 正确                      |
| -------- | ---------------------------- | ------------------------- |
| 关注点   | 系统是否工作正确             | 需求是否写得正确          |
| 动词     | Verify, Test, Confirm, Check | Are, Is, Do, Can          |
| 对象     | 代码行为                     | 需求描述本身              |
| 问题形式 | "Does it do X?"              | "Is X clearly specified?" |

### 6.6 绝对禁止的写法

| 禁止类型                                    | 示例                                    |
| ------------------------------------------- | --------------------------------------- |
| 以 Verify/Test/Confirm/Check + 实现行为开头 | "Verify the button clicks correctly"    |
| 引用代码执行、用户操作、系统行为            | "Click login button", "Render the page" |
| 模糊的实现描述                              | "Displays correctly", "works properly"  |
| 测试用例/测试计划/QA 流程                   | "Test plan for login flow"              |
| 实现细节                                    | "Use React 19", "Call REST API"         |

### 6.7 必须使用的写法

| 必须模式                                                              | 示例                                                                 |
| --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| "Are [requirement type] defined/specified/documented for [scenario]?" | "Are error handling requirements defined for all API failure modes?" |
| "Is [vague term] quantified/clarified with specific criteria?"        | "Is 'fast loading' quantified with specific timing thresholds?"      |
| "Are requirements consistent between [section A] and [section B]?"    | "Do navigation requirements align across all pages?"                 |
| "Can [requirement] be objectively measured/verified?"                 | "Can 'balanced visual weight' be objectively verified?"              |
| "Are [edge cases/scenarios] addressed in requirements?"               | "Are requirements defined for zero-state scenarios?"                 |
| "Does the spec define [missing aspect]?"                              | "Does the spec define visual hierarchy for competing UI elements?"   |

---

## 七、按质量维度的示例

### 7.1 Completeness（完整性）

```markdown
- [ ] CHK001 - Are error handling requirements defined for all API failure modes? [Gap]
- [ ] CHK002 - Are accessibility requirements specified for all interactive elements? [Completeness]
- [ ] CHK003 - Are mobile breakpoint requirements defined for responsive layouts? [Gap]
- [ ] CHK004 - Are loading state requirements defined for asynchronous data? [Gap]
```

### 7.2 Clarity（清晰度）

```markdown
- [ ] CHK005 - Is 'fast loading' quantified with specific timing thresholds? [Clarity, Spec §NFR-2]
- [ ] CHK006 - Are 'related episodes' selection criteria explicitly defined? [Clarity, Spec §FR-5]
- [ ] CHK007 - Is 'prominent' defined with measurable visual properties? [Ambiguity, Spec §FR-4]
```

### 7.3 Consistency（一致性）

```markdown
- [ ] CHK008 - Do navigation requirements align across all pages? [Consistency, Spec §FR-10]
- [ ] CHK009 - Are card component requirements consistent between landing and detail pages? [Consistency]
```

### 7.4 Coverage（覆盖度）

```markdown
- [ ] CHK010 - Are requirements defined for zero-state scenarios (no episodes)? [Coverage, Edge Case]
- [ ] CHK011 - Are concurrent user interaction scenarios addressed? [Coverage, Gap]
- [ ] CHK012 - Are requirements specified for partial data loading failures? [Coverage, Exception Flow]
```

### 7.5 Measurability（可测量性）

```markdown
- [ ] CHK013 - Are visual hierarchy requirements measurable/testable? [Acceptance Criteria, Spec §FR-1]
- [ ] CHK014 - Can 'balanced visual weight' be objectively verified? [Measurability, Spec §FR-2]
```

---

## 八、场景分类与覆盖

### 8.1 场景类别检查

Checklist 需要检查需求是否覆盖了以下场景类别：

| 场景类别                         | 检查项示例                                                          |
| -------------------------------- | ------------------------------------------------------------------- |
| **Primary**（主流程）            | "Are primary flow requirements complete and clear?"                 |
| **Alternate**（替代流程）        | "Are alternate path requirements documented?"                       |
| **Exception/Error**（异常/错误） | "Are exception handling requirements defined?"                      |
| **Recovery**（恢复）             | "Are rollback requirements defined for migration failures? [Gap]"   |
| **Non-Functional**（非功能）     | "Are performance requirements specified for all critical journeys?" |

### 8.2 状态变更与韧性

当需求涉及状态变更时，必须检查：

```markdown
- [ ] CHK015 - Are rollback requirements defined for migration failures? [Gap]
- [ ] CHK016 - Are partial failure recovery paths specified? [Gap]
- [ ] CHK017 - Is state consistency guaranteed after rollback? [Consistency]
```

---

## 九、内容整合规则

### 9.1 数量控制

```text
原始候选项 > 40:
    └── 按风险/影响优先级排序，裁剪低优先级项

近重复项:
    └── 合并为一条检查项

低影响边界情况 > 5:
    └── 合并为一条: "Are edge cases X, Y, Z addressed in requirements? [Coverage]"
```

### 9.2 文件模板

```markdown
# Checklist: [Domain] Requirements Quality

**Purpose**: Validate [domain] requirements quality for [Feature Name]
**Created**: YYYY-MM-DD
**Feature**: [Link to spec.md]

## Requirement Completeness

- [ ] CHK001 - ...

## Requirement Clarity

- [ ] CHK002 - ...

## Requirement Consistency

- [ ] CHK003 - ...

## Acceptance Criteria Quality

- [ ] CHK004 - ...

## Scenario Coverage

- [ ] CHK005 - ...

## Edge Case Coverage

- [ ] CHK006 - ...

## Non-Functional Requirements

- [ ] CHK007 - ...

## Dependencies & Assumptions

- [ ] CHK008 - ...

## Ambiguities & Conflicts

- [ ] CHK009 - ...
```

---

## 十、常见问题类型示例

### 10.1 UX 需求质量（ux.md）

```markdown
- [ ] CHK001 - Are visual hierarchy requirements defined with measurable criteria? [Clarity, Spec §FR-1]
- [ ] CHK002 - Is the number and positioning of UI elements explicitly specified? [Completeness, Spec §FR-1]
- [ ] CHK003 - Are interaction state requirements (hover, focus, active) consistently defined? [Consistency]
- [ ] CHK004 - Are accessibility requirements specified for all interactive elements? [Coverage, Gap]
- [ ] CHK005 - Is fallback behavior defined when images fail to load? [Edge Case, Gap]
- [ ] CHK006 - Can 'prominent display' be objectively measured? [Measurability, Spec §FR-4]
```

### 10.2 API 需求质量（api.md）

```markdown
- [ ] CHK001 - Are error response formats specified for all failure scenarios? [Completeness]
- [ ] CHK002 - Are rate limiting requirements quantified with specific thresholds? [Clarity]
- [ ] CHK003 - Are authentication requirements consistent across all endpoints? [Consistency]
- [ ] CHK004 - Are retry/timeout requirements defined for external dependencies? [Coverage, Gap]
- [ ] CHK005 - Is versioning strategy documented in requirements? [Gap]
```

### 10.3 性能需求质量（performance.md）

```markdown
- [ ] CHK001 - Are performance requirements quantified with specific metrics? [Clarity]
- [ ] CHK002 - Are performance targets defined for all critical user journeys? [Coverage]
- [ ] CHK003 - Are performance requirements under different load conditions specified? [Completeness]
- [ ] CHK004 - Can performance requirements be objectively measured? [Measurability]
- [ ] CHK005 - Are degradation requirements defined for high-load scenarios? [Edge Case, Gap]
```

### 10.4 安全需求质量（security.md）

```markdown
- [ ] CHK001 - Are authentication requirements specified for all protected resources? [Coverage]
- [ ] CHK002 - Are data protection requirements defined for sensitive information? [Completeness]
- [ ] CHK003 - Is the threat model documented and requirements aligned to it? [Traceability]
- [ ] CHK004 - Are security requirements consistent with compliance obligations? [Consistency]
- [ ] CHK005 - Are security failure/breach response requirements defined? [Gap, Exception Flow]
```

---

## 十一、常见问题（FAQ）

### Q1: Checklist 和 Clarify 有什么区别？

**A**:

- **Clarify**: 交互式问答，消除 spec 中的模糊点，直接修改 spec.md
- **Checklist**: 生成质量检查清单，不修改 spec，而是列出"需求写得怎么样"的评估项

类比：

- Clarify = 编辑修改代码
- Checklist = 写单元测试来检查代码质量

### Q2: 为什么 checklist 不测试实现？

**A**: 因为实现的验证是测试人员或开发者的职责。Checklist 的职责是确保**需求本身写得足够好**，以至于后续的 Plan、Tasks、Implement 都有清晰、无歧义的依据。如果需求写得模糊，再好的实现也可能是错的。

### Q3: 可以生成多个 checklist 吗？

**A**: 可以。每个 `/speckit-checklist` 调用使用短描述性文件名：

- `ux.md` - UX 需求质量
- `api.md` - API 需求质量
- `security.md` - 安全需求质量
- `performance.md` - 性能需求质量

多个 checklist 并存，互不覆盖。

### Q4: 已有的 checklist 会被覆盖吗？

**A**: 不会。如果文件已存在，新项会**追加**到末尾，编号从最后一个 CHK ID 继续。这是为了保留历史检查项，支持增量完善。

### Q5: checklist 生成后需要谁来执行？

**A**:

- **作者**（写 spec 的人）: 在提交 spec 前自我检查
- **审阅者**（PR review 时）: 验证需求质量是否达标
- **QA**: 确认需求是否足够清晰以编写测试用例

### Q6: 追溯标记 `[Spec §X.Y]` 是强制要求吗？

**A**: 最低要求是 ≥80% 的检查项必须包含至少一个追溯标记。这是为了确保每个检查项都能追溯到 spec 的具体位置，便于定位和修复。

### Q7: 如果 spec 没有编号系统（FR-001 等），追溯标记怎么用？

**A**: 可以引用章节标题或段落，例如 `[Spec §User Stories]` 或 `[Spec §Edge Cases]`。如果完全无法追溯，使用 `[Gap]` 标记表示这是发现的新缺口。

---

## 十二、总结

### Checklist 阶段的核心特征

| 特征                       | 说明                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Unit Tests for English** | 测试需求描述本身，不是测试代码实现                                                                                 |
| **9 大质量维度**           | Completeness, Clarity, Consistency, Measurability, Coverage, Edge Cases, Non-Functional, Dependencies, Ambiguities |
| **问题形式**               | 所有检查项都是疑问句，聚焦"需求是否写清楚"                                                                         |
| **追溯标记**               | ≥80% 检查项必须关联 spec 章节或 Gap/Ambiguity/Conflict/Assumption 标记                                             |
| **多文件支持**             | 支持 ux.md, api.md, security.md 等多个领域 checklist 并存                                                          |
| **增量追加**               | 已有文件不覆盖，新项追加到最后                                                                                     |

### Checklist 的执行哲学

> **"If your spec is code written in English, the checklist is its unit test suite."**
>
> 如果你的 spec 是用英文写的"代码"，那么 checklist 就是这段"代码"的单元测试套件。

Checklist 回答的核心问题是：

1. 需求是否**完整**？（有没有漏掉什么）
2. 需求是否**清晰**？（会不会被理解成不同意思）
3. 需求是否**一致**？（不同章节之间是否矛盾）
4. 需求是否**可测量**？（能不能客观地验证是否达标）
5. 需求是否**覆盖全面**？（主流程、异常、边界、恢复都考虑了吗）

### 与上下游的关系

```text
spec.md（需求规格）
    │
    ├── 输入给 /speckit-checklist
    │     └── 生成 checklists/[domain].md
    │           └── 检查: 需求写得怎么样？
    │
    ├── 输入给 /speckit-clarify
    │     └── 发现模糊点 → 更新 spec.md
    │
    ├── 输入给 /speckit-plan
    │     └── 基于清晰的需求生成技术方案
    │
    └── 输入给 /speckit-implement
          └── 基于清晰的需求编写代码

注意: Checklist 不修改 spec.md，它只评估 spec.md 的质量。
      发现问题后，应该通过 /speckit-clarify 或直接编辑来修复 spec。
```

---

_本文档详细解析了 `/speckit-checklist` 命令的完整执行流程、"Unit Tests for English" 核心理念、9 大质量维度检查框架和正确/错误的写作规范。_
