# Speckit 全流程操作教程

> **目标读者**: 已了解各阶段技术细节，希望从全局视角掌握完整工作流的学习者
> **前置阅读**: `speckit-specify-execution-flow.md`、`speckit-clarify-execution-flow.md`、`speckit-plan-execution-flow.md`、`speckit-tasks-execution-flow.md`、`speckit-implement-execution-flow.md`
> **配套案例**: `speckit-string-utils-case-study.md`

---

## 一、你的理解对吗？

### 1.1 标准流程

```text
Specify → Clarify → Plan → Tasks → Implement
   ↑         ↑        ↑       ↑         ↑
  定义      澄清      规划     拆解      实现
```

**你的理解完全正确。** 这就是 Speckit SDD（Structured Demand-Driven Development）的标准五阶段工作流。

### 1.2 各阶段一句话定位

| 阶段          | 命令                 | 回答的核心问题         | 类比           |
| ------------- | -------------------- | ---------------------- | -------------- |
| **Specify**   | `/speckit-specify`   | "用户想要什么？"       | 业主需求书     |
| **Clarify**   | `/speckit-clarify`   | "有哪些地方没说清楚？" | 设计师确认细节 |
| **Plan**      | `/speckit-plan`      | "技术上怎么实现？"     | 建筑结构设计图 |
| **Tasks**     | `/speckit-tasks`     | "具体要做哪些事？"     | 施工任务清单   |
| **Implement** | `/speckit-implement` | "动手写代码"           | 工人按图施工   |

### 1.3 非标准路径（何时可以跳过/简化）

```text
标准路径: Specify → Clarify → Plan → Tasks → Implement
              ↑
          （可以循环）

简化路径 1: Specify ──→ Plan ──→ Tasks ──→ Implement
                  （跳过 Clarify，适合需求极明确的场景）

简化路径 2: 直接改代码
                  （只改 bug 或微调，不涉及需求变更）

循环路径: Specify → Clarify → Plan → Tasks → Implement
              ↑                              │
              └──── /speckit-clarify ────────┘
                  （需求变更时回到 Clarify 重新走）
```

---

## 二、全流程总览图

### 2.1 数据流视角

```text
用户的一句话需求
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  /speckit-specify                                           │
│  输入: "我要一个用户登录功能"                                │
│  输出: spec.md + checklists/requirements.md                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Single Source of Truth（唯一真相源）                        │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  /speckit-clarify                                           │
│  输入: spec.md + 你的问题或调整描述                          │
│  输出: 更新的 spec.md                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  作用: 消除模糊点，将猜测变事实                               │
│  规则: 最多 5 个问题，按 Impact × Uncertainty 排序            │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  /speckit-plan                                              │
│  输入: spec.md                                              │
│  输出: plan.md + research.md + data-model.md + quickstart.md│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  Phase 0: Research（调研）→ research.md                     │
│  Phase 1: Design（设计）→ data-model.md + quickstart.md      │
│  Phase 2: Summary（汇总）→ plan.md                          │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  /speckit-tasks                                             │
│  输入: spec.md + plan.md                                    │
│  输出: tasks.md                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  按用户故事分组，每个任务含: ID + 优先级 + 文件路径 + 描述   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  /speckit-implement                                         │
│  输入: tasks.md + 所有设计文档                               │
│  输出: 实际代码文件                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  按任务清单逐条执行，标记 [x] 完成                           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 文件依赖视角

```text
┌─────────────────────────────────────────────────────────────┐
│                          spec.md                            │
│                    （唯一真相源 / 源头文件）                   │
└─────────────────────────────────────────────────────────────┘
    │
    ├── /speckit-clarify ──→ spec.md（更新）
    │
    ├── /speckit-plan ─────→ plan.md
    │                          ├── research.md
    │                          ├── data-model.md
    │                          └── quickstart.md
    │
    ├── /speckit-tasks ────→ tasks.md
    │
    └── /speckit-implement ──→ 实际代码
         （读取 tasks.md 作为主要输入）
```

### 2.3 关键原则：瀑布依赖

```text
上层动了，下层必须跟着动：
  spec.md 变了 → plan.md 必须重新生成 → tasks.md 可能需要更新

下层动了，不用通知上层：
  plan.md 的技术细节调整 → 不用改 spec.md
  代码 bug 修复 → 不用改任何文档
```

---

## 三、逐阶段核心要领

### 3.1 Specify（定义需求）—— 只问 WHAT，不问 HOW

**核心原则**:

- `spec.md` 只描述 **做什么** 和 **为什么做**
- 严禁出现技术实现细节（如"用 TypeScript""调用 REST API"）
- 验收标准必须是 **可测量** 的（"30 秒内找到"而不是"容易找到"）

**检查清单**:

- [ ] 用户故事用了"作为...我需要...以便..."格式
- [ ] 每个故事有 Given-When-Then 验收场景
- [ ] Edge Cases 覆盖了 null/undefined/空值/异常输入
- [ ] 功能需求编号（FR-001、FR-002...）
- [ ] 成功标准是可测量的（有时间/百分比/数量指标）

**输出文件**:

| 文件                                   | 作用                  | 是否必须       |
| -------------------------------------- | --------------------- | -------------- |
| `specs/XXX/spec.md`                    | 核心真相源            | ✅             |
| `specs/XXX/checklists/requirements.md` | 质量门禁（16 项检查） | ✅（自动生成） |

---

### 3.2 Clarify（澄清需求）—— 把模糊变清晰

**核心原则**:

- **不是一次性活动**，可以执行 0~N 次
- 每次问答 **永久记录** 在 spec.md 中
- 最多问 **5 个问题**，强制聚焦最关键的不确定性
- 必须在 Plan **之前**完成

**10 维扫描框架**（Taxonomy）:

```text
1. Functional Scope & Behavior      → 用户目标是否明确？
2. Domain & Data Model              → 实体定义是否完整？
3. Interaction & UX Flow            → 交互流程是否清晰？
4. Non-Functional Quality Attributes → 性能/安全/可扩展性有要求吗？
5. Integration & External Dependencies → 外部依赖有吗？
6. Edge Cases & Failure Handling    → 边界情况和失败处理够吗？
7. Constraints & Tradeoffs          → 有什么技术约束？
8. Terminology & Consistency        → 术语是否统一？
9. Completion Signals               → 验收标准可测试吗？
10. Misc / Placeholders             → 还有 TODO 或模糊词吗？
```

**何时需要 Clarify**:

- 刚完成 Specify，觉得有些地方不够明确
- 开发过程中发现 spec 有遗漏
- 需求变更（增删功能、修改验收标准）

**何时不需要 Clarify**:

- 技术实现方式调整 → 直接改 plan.md
- 代码 bug 修复 → 直接改代码
- 文件路径调整 → 直接改 plan.md

---

### 3.3 Plan（技术规划）—— 回答 HOW

**核心原则**:

- `plan.md` 是 **派生文件**，spec 变了必须重新生成
- 回答 **怎么做**，不重复 **做什么**
- 所有技术决策必须有依据，记录在 `research.md` 中

**三阶段执行**:

```text
Phase 0: Outline & Research
    ├── 提取 Technical Context 中的未知项
    ├── 执行技术调研（评估替代方案）
    └── 输出: research.md（技术决策记录）

Phase 1: Design & Contracts
    ├── 提取实体定义 → data-model.md（接口类型契约）
    ├── 生成使用指南 → quickstart.md
    └── 更新 CLAUDE.md 上下文

Phase 2: Summary
    └── 汇总所有技术决策 → plan.md
```

**Constitution Check（架构约束门禁）**:

- 检查是否符合项目的 `.specify/memory/constitution.md`
- 未通过不能进入后续阶段
- 强制保证所有特性遵守统一的技术治理约束

**输出文件**:

| 文件            | 作用               | 读者            |
| --------------- | ------------------ | --------------- |
| `plan.md`       | 技术方案总览       | 开发者          |
| `research.md`   | 技术调研与决策记录 | 开发者/架构师   |
| `data-model.md` | 接口类型契约       | 开发者/测试人员 |
| `quickstart.md` | 使用者快速开始指南 | 使用者          |

---

### 3.4 Tasks（任务拆解）—— 从设计到执行

**核心原则**:

- 按 **用户故事分组**，便于独立测试和增量交付
- 每个任务包含：ID + 优先级 + 所属用户故事 + 文件路径 + 描述
- MVP 思维：做完 US1 就能用，不必等全部完成

**任务格式**:

```markdown
- [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
      │ │ │ └─ 具体做什么 + 在哪里做
      │ │ └─ 属于哪个用户故事
      │ └─ 任务 ID（执行顺序）
      └─ 复选框（完成后标记为 [x]）
```

**任务组织**:

```markdown
## Phase 1: User Story 1 - 去除字符串首尾空格 (Priority: P1)

- [ ] T001 [US1] 实现 trim 函数

## Phase 2: User Story 2 - 字符串转为大写 (Priority: P1)

- [ ] T002 [US2] 实现 uppercase 函数

## Phase 4: Polish & Cross-Cutting Concerns

- [ ] T004 确保所有函数包含完整 JSDoc 注释
- [ ] T005 确保导入排序遵循项目规范
```

---

### 3.5 Implement（执行实现）—— 按图施工

**核心原则**:

- AI 像"按图施工的建筑工人"，**严格按文档执行**
- 不会擅自添加文档没要求的功能
- 每完成一个任务，将 `- [ ]` 标记为 `- [x]`
- 如果 tasks 和 plan 有冲突，以 tasks 为准

**文件优先级**:

```text
Primary Input（首要输入）
  ├── tasks.md          ← 执行顺序（做什么、按什么顺序）
  └── plan.md           ← 技术方案（怎么做、用什么技术）

Secondary Reference（次要参考）
  ├── data-model.md     ← 接口定义（函数签名）
  ├── quickstart.md     ← 使用示例
  └── spec.md           ← 需求兜底（有歧义时回查）

Tertiary Reference（辅助参考）
  └── research.md       ← 技术决策（为什么这样实现）
```

---

## 四、需求变更时的完整回流流程

这是 Speckit 最有价值的部分——需求变更时**如何正确操作**。

### 4.1 决策口诀

> **功能变了 → 改 spec → 重新 plan**
> **技术细节调整 → 直接改 plan**

### 4.2 判断对照表

| 场景             | 改 spec？ | 改 plan？ | 操作建议                             |
| ---------------- | --------- | --------- | ------------------------------------ |
| 增加/删除功能    | ✅        | 重新生成  | `/speckit-clarify` → `/speckit-plan` |
| 修改验收标准     | ✅        | 重新生成  | `/speckit-clarify` → `/speckit-plan` |
| 调整边界情况     | ✅        | 重新生成  | `/speckit-clarify` → `/speckit-plan` |
| 修改技术实现方式 | ❌        | ✅ 直接改 | 直接编辑 plan.md / research.md       |
| 调整文件路径     | ❌        | ✅ 直接改 | 直接编辑 plan.md                     |
| 修改代码风格     | ❌        | ✅ 直接改 | 直接编辑 plan.md 或代码              |
| 发现 spec 有遗漏 | ✅        | 重新生成  | `/speckit-clarify`                   |
| 修复代码 bug     | ❌        | ❌        | 直接改代码，无需改任何文档           |

### 4.3 需求变更的完整回流

```text
需求变更（如：增加一个函数、修改参数类型）
    │
    ▼
/speckit-clarify "变更描述"
    └─ 更新 spec.md（Clarifications / Edge Cases / Assumptions）
    │
    ▼
/speckit-plan
    └─ 重新生成 plan.md + research.md + data-model.md + quickstart.md
    │
    ▼
/speckit-tasks
    └─ 重新生成 tasks.md
    │
    ▼
/speckit-implement
    └─ 按新 tasks 执行
```

**关键教训**: 不要跳过 clarify 直接改 plan！因为 plan 是派生文件，spec 变了 plan 的输入就变了。跳过 clarify 会导致 spec 和 plan 不一致。

---

## 五、实战演练：string-utils 全流程回顾

用本项目的真实案例，快速回顾完整流程。

### 5.1 时间线

```text
Step 1: /speckit-specify
  "apps/web/src/utils 中实现 3 个简单的字符串工具函数"
  → 生成 specs/001-string-utils/spec.md（初版）

Step 2: /speckit-clarify "去除单元测试"
  → spec.md Assumptions 更新

Step 3: /speckit-plan
  → 生成 plan.md + research.md + data-model.md + quickstart.md

Step 4: /speckit-clarify "测试使用 npm run lint 验证就行"
  → spec.md Clarifications 新增

Step 5: /speckit-plan（重新生成）

Step 6: /speckit-clarify "增加空值安全处理"
  → spec.md Edge Cases + Assumptions 更新（影响最大的一次）

Step 7: /speckit-plan（重新生成）

Step 8: /speckit-clarify "去除 npm run lint"
  → spec.md Clarifications 更新

Step 9: /speckit-plan（第 4 次重新生成）

Step 10: /speckit-tasks
  → 生成 tasks.md（5 个任务）

Step 11: /speckit-implement
  → 生成 apps/web/src/utils/string.ts（27 行代码）
```

### 5.2 生成的全部文件

```text
specs/001-string-utils/
├── spec.md                  # 核心真相源（源头文件）
├── checklists/
│   └── requirements.md      # 质量检查清单（派生）
├── plan.md                  # 技术方案总览（派生，重新生成 4 次）
├── research.md              # 技术调研与决策记录（派生）
├── data-model.md            # 接口类型契约（派生）
├── quickstart.md            # 使用者快速开始指南（派生）
└── tasks.md                 # 任务清单（派生）

apps/web/src/utils/
└── string.ts                # 实际交付代码（派生）
```

### 5.3 最关键的一次 Clarify

第 3 次 clarify（"增加空值安全处理"）的影响传导链：

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
    ├── plan.md: Technical Context Constraints 更新
    ├── research.md: 新增 "空值安全处理策略" 章节
    │     ├── 决策: 使用 str ?? ''
    │     ├── 理由: ?? 仅对 null/undefined 生效
    │     └── 拒绝: str || ''（会误判 falsy 值）
    ├── data-model.md: 所有函数参数类型改为 string | null | undefined
    └── quickstart.md: 使用示例新增 null/undefined 示例
    │
    ▼
/speckit-implement
    └── string.ts 代码变化
        ├── 变更前: return str.trim();
        └── 变更后: return (str ?? '').trim();
```

**关键洞察**: 用户的一句话需求变更，通过 Speckit 工作流，**自动、完整、可追溯地**传导到了所有相关文档和最终代码。

---

## 六、常见问题（FAQ）

### Q1: 为什么 spec.md 是 "Single Source of Truth"？

**A**: 因为所有其他文档（plan、tasks、data-model）都是从 spec 派生出来的。如果 spec 和 plan 出现矛盾，以 spec 为准。这样可以确保：无论下游文档怎么变，需求的源头只有一个。

### Q2: 我已经改好了 plan.md，但发现 spec.md 也需要改，怎么办？

**A**: 先改 spec.md（用 `/speckit-clarify`），然后重新运行 `/speckit-plan`。不要反向操作，因为 plan 是派生文件。

### Q3: 我不想重新生成 plan，可以直接改 plan.md 吗？

**A**: 如果只是技术细节调整（如文件路径、实现方式），可以直接改 plan.md。但如果涉及功能、验收标准、边界情况，必须改 spec 并重新 plan。

### Q4: tasks.md 里的任务都完成了，但发现代码有个小 bug，要改哪里？

**A**: 直接改代码，不需要重新跑任何 Speckit 命令。因为 bug 修复不影响需求规格。

### Q5: 我想在代码里再加一个函数，要走完整流程吗？

**A**: 如果是计划内的函数（spec 里已定义），直接实现即可。如果是新函数，建议先 `/speckit-clarify` 更新 spec，再重新 `/speckit-plan` 和 `/speckit-tasks`。

### Q6: 一个特性需要 clarify 多少次？

**A**: 没有固定次数。string-utils 案例 clarify 了 4 次，简单特性可能 0~1 次，复杂特性可能 5 次以上。目标是**把不确定性降到可以接受的水平**。

### Q7: 为什么每次 clarify 后都要重新 plan？

**A**: 因为 clarify 修改了 spec.md，而 plan.md 是派生文件。例如 string-utils 案例中：

- 第 3 次 clarify 增加了"空值安全处理"→ spec.md 的 Edge Cases 和 Assumptions 变了
- 这个变化传导到 plan.md → Technical Context 的 Constraints 需要更新
- 传导到 data-model.md → 参数类型从 `string` 变为 `string | null | undefined`
- 传导到 research.md → 新增"空值安全处理策略"章节

如果不重新 plan，这些文档就会和 spec.md 不一致。

### Q8: quickstart.md 是给谁看的？

**A**: 给**使用**这个特性的人看，不是给**实现**的人看。比如：

- 你实现了 string.ts，其他开发者想调用你的函数
- 他们不需要看 plan.md（技术方案），也不需要看 data-model.md（类型定义）
- 他们只需要看 quickstart.md：怎么导入、怎么调用、有什么注意事项

---

## 七、命令速查表

| 阶段          | 命令                            | 输入                    | 输出                                                  | 使用频率         |
| ------------- | ------------------------------- | ----------------------- | ----------------------------------------------------- | ---------------- |
| **Specify**   | `/speckit-specify "需求描述"`   | 用户的一句话需求        | spec.md + checklists/                                 | 每个特性 1 次    |
| **Clarify**   | `/speckit-clarify "问题或调整"` | 对 spec 的疑问或调整    | 更新的 spec.md                                        | 按需，0~N 次     |
| **Plan**      | `/speckit-plan`                 | spec.md                 | plan.md + research.md + data-model.md + quickstart.md | spec 变更后执行  |
| **Tasks**     | `/speckit-tasks`                | plan.md + spec.md       | tasks.md                                              | plan 变更后执行  |
| **Implement** | `/speckit-implement`            | tasks.md + 所有设计文档 | 实际代码文件                                          | tasks 变更后执行 |

### 完整执行流程（正常路径）

```text
1. /speckit-specify "你的需求描述"
   └─ 生成 specs/XXX/spec.md + checklists/

2. （可选）/speckit-clarify "有哪些需要确认的"
   └─ 更新 spec.md

3. /speckit-plan
   └─ 生成 plan.md + research.md + data-model.md + quickstart.md

4. /speckit-tasks
   └─ 生成 tasks.md

5. /speckit-implement
   └─ 生成实际代码，标记任务完成
```

### 需求变更后的执行流程

```text
需求变更
    │
    ▼
/speckit-clarify "变更描述"
    │
    ▼
/speckit-plan
    │
    ▼
/speckit-tasks
    │
    ▼
/speckit-implement
```

---

## 八、核心记忆口诀

### 8.1 流程口诀

> **先定义，后实现**
> **先澄清，再规划**
> **文档即代码**

### 8.2 决策口诀

> **功能变了 → 改 spec → 重新 plan**
> **技术细节调整 → 直接改 plan**
> **bug 修复 → 直接改代码**

### 8.3 瀑布口诀

```text
        spec.md  ← 用户视角："我要什么"
           │
           ▼
        plan.md  ← 开发视角："我怎么实现"
           │
           ▼
      tasks.md   ← 执行视角："具体做哪些事"
           │
           ▼
      code.ts    ← 代码视角："实际写出来的代码"

上层动了，下层必须跟着动。
下层动了，不用通知上层。
```

---

## 九、最佳实践

### 9.1 Specify 阶段

- **描述要具体**: 不要说"做个登录功能"，要说"用户输入手机号和验证码后完成登录"
- **验收标准要可测量**: "很快"不好测量，"2 秒内返回结果"可以测量
- **边界情况要提前想**: null、空字符串、超长输入、网络断开等

### 9.2 Clarify 阶段

- **不要跳过 Clarify**: 即使需求看起来很简单，也建议至少 clarify 一次
- **聚焦关键不确定性**: 最多 5 个问题，优先问影响架构和验收的问题
- **所有答案写入 spec**: 不要只记在脑子里

### 9.3 Plan 阶段

- **关注 research.md**: 这是最有技术价值的文件，记录了决策依据
- **data-model 要准确**: 类型定义是代码的合同，错了后期返工成本高
- **保持技术无关性**: spec 不关心"怎么做"，plan 才关心

### 9.4 Tasks 阶段

- **按用户故事分组**: 便于独立测试和增量交付
- **MVP 优先**: 先把核心功能做出来，再完善边缘功能
- **任务描述要具体**: 包含文件路径和期望输出

### 9.5 Implement 阶段

- **信任文档**: AI 严格按文档执行，如果结果不满意，先检查文档是否写清楚了
- **不要跳过 tasks**: 即使只有 1 个任务，也建议生成 tasks.md，保持流程一致性
- **完成后自我验证**: 对照 spec.md 的验收场景检查代码是否符合预期

---

## 十、总结

### Speckit 工作流的核心价值

1. **先定义，后实现**: 不写代码前先明确"要什么"和"怎么验收"
2. **文档即代码**: 所有设计决策都写入版本控制的文档，可追溯、可复用
3. **上游驱动下游**: spec 是唯一的源头，spec 变了，下游必须同步更新

### 适合使用 Speckit 的场景

- ✅ 新特性开发
- ✅ 大规模重构
- ✅ 多人协作的需求对齐
- ✅ 需要长期维护的项目

### 可以简化或跳过 Speckit 的场景

- ⚠️ 紧急 bug 修复（直接改代码）
- ⚠️ 一行代码的改动（如改个常量值）
- ⚠️ 纯探索性实验（exploratory spike）

---

_本文档总结了 Speckit SDD 工作流的完整操作流程，适用于所有特性开发场景。_
_各阶段的底层执行机制详见对应的 speckit-_-execution-flow.md 文档。\*
