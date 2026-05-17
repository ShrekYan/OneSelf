# Speckit Implement 执行流程详解

> **目标读者**: 想了解 `/speckit-implement` 命令内部执行机制的新手
> **文档性质**: 执行阶段技术手册
> **关联文件**: `tasks.md`（执行清单）、`plan.md`（技术方案）、`data-model.md`（接口契约）

---

## 一、Implement 阶段定位

```
Specify → Clarify → Plan → Tasks → [Implement] → 实际代码
                                      ↑
                                  你在这里
```

**核心职责**: Implement 是唯一一个**真正修改源代码**的阶段。前 4 个阶段只生成文档，Implement 阶段才将文档转化为可运行的代码。

**类比**: 如果前 4 个阶段是"画图纸"，Implement 就是"工人按图纸施工"。

---

## 二、执行前准备（Pre-Execution）

在运行 `/speckit-implement` 之前，AI 会先执行一系列检查。如果这些检查不通过，Implement 会中断并提示用户。

### 2.1 前置检查清单

| 检查项                   | 作用                                                        | 失败时的行为                                    |
| ------------------------ | ----------------------------------------------------------- | ----------------------------------------------- |
| **读取 tasks.md**        | 确认任务清单存在且格式正确                                  | 报错："请先运行 /speckit-tasks 生成任务清单"    |
| **读取 plan.md**         | 确认技术方案存在                                            | 报错："缺少技术方案，请先运行 /speckit-plan"    |
| **读取 spec.md**         | 确认需求规格存在                                            | 报错："缺少需求规格，请先运行 /speckit-specify" |
| **checklists 状态检查**  | 确认所有检查清单已完成（无 `- [ ]` 未勾选项）               | 警告："部分检查清单未完成，是否继续？"          |
| **extension hooks 检查** | 检查 `.specify/extensions.yml` 中的 `before_implement` 钩子 | 按配置执行可选/强制钩子                         |

### 2.2 检查清单（Checklists）状态检查详解

```text
AI 扫描 specs/XXX/checklists/ 目录下的所有 .md 文件
    │
    ├── 统计每个清单文件中的：
    │     - 总条目数（匹配 - [ ] / - [X] / - [x] 的行数）
    │     - 已完成数（匹配 - [X] / - [x] 的行数）
    │     - 未完成数（匹配 - [ ] 的行数）
    │
    └── 如果有未完成项：
          ├─ 显示状态表格（示例）
          │
          │   | Checklist   | Total | Completed | Incomplete | Status |
          │   |-------------|-------|-----------|------------|--------|
          │   | ux.md       | 12    | 12        | 0          | ✓ PASS |
          │   | test.md     | 8     | 5         | 3          | ✗ FAIL |
          │
          └─ 询问用户："Some checklists are incomplete. Do you want to proceed?"
             - 用户说 yes → 继续执行
             - 用户说 no → 中断
```

**实际案例**: 本案例的 `checklists/requirements.md` 所有 16 项均为 `[x]`，所以直接通过。

### 2.3 Extension Hooks 检查详解

```text
检查 .specify/extensions.yml 是否存在
    │
    ├── 不存在 → 静默跳过，继续执行
    │
    └── 存在 → 读取 hooks.before_implement 配置
          │
          ├── 筛选 enabled 不为 false 的钩子
          ├── 跳过有 condition 字段的钩子（由 HookExecutor 处理）
          └── 对每个可执行钩子：
                ├─ optional: true → 显示可选钩子信息，等用户决定是否执行
                └─ optional: false → 自动执行，等待执行结果后再继续
```

**钩子命令转换规则**: `speckit.git.commit` → `/speckit-git-commit`

---

## 三、核心执行流程（Execution Flow）

### 3.1 第一步：加载实现上下文

AI 按以下顺序读取文件，构建完整的实现上下文：

```text
┌─────────────────────────────────────────────────────────────┐
│  REQUIRED（必须读取）                                        │
│  ├── tasks.md          ← 任务清单和执行顺序                 │
│  └── plan.md           ← 技术栈、文件结构、架构约束          │
├─────────────────────────────────────────────────────────────┤
│  IF EXISTS（如果存在则读取）                                  │
│  ├── data-model.md     ← 实体定义、接口类型签名              │
│  ├── quickstart.md     ← 使用示例和集成场景                  │
│  ├── contracts/        ← API 契约、接口规范                  │
│  └── research.md       ← 技术决策和替代方案对比              │
├─────────────────────────────────────────────────────────────┤
│  GOVERNANCE（治理约束）                                       │
│  └── .specify/memory/constitution.md  ← 项目治理约束（如有）  │
└─────────────────────────────────────────────────────────────┘
```

**读取策略**: 先读 tasks.md 建立执行框架，再读 plan.md 获取技术细节，最后参考 data-model.md 确定精确的类型定义。

### 3.2 第二步：解析任务结构

AI 解析 `tasks.md` 的结构，提取以下信息：

```text
Phase 1: Setup（项目初始化）
    └── [ ] T001 创建目录结构

Phase 2: Foundational（基础准备）
    └── [ ] T002 初始化配置文件

Phase 3+: User Stories（按优先级排序）
    ├── Phase 3: US1 - 去除首尾空格
    │     └── [ ] T003 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
    │
    ├── Phase 4: US2 - 字符串转为大写
    │     └── [ ] T004 [US2] 实现 uppercase 函数于 apps/web/src/utils/string.ts
    │
    └── Phase 5: US3 - 字符串转为小写
          └── [ ] T005 [US3] 实现 lowercase 函数于 apps/web/src/utils/string.ts

Final Phase: Polish（打磨）
    ├── [ ] T006 添加 JSDoc 注释
    └── [ ] T007 导入排序检查
```

**解析规则**:

- 按 Phase 分组执行
- 同一 Phase 内的任务按 ID 顺序执行
- 标记为 `[P]` 的任务表示可并行（不同文件时）
- 同一文件的任务必须串行

### 3.3 第三步：按 Phase 执行

#### Phase 执行顺序

```text
Setup → Foundational → US1 → US2 → US3 → Polish
   │         │          │     │     │      │
   └─────────┴──────────┴─────┴─────┴──────┘
              │
              ▼
         每个 Phase 完成后验证 Checkpoint
              │
              ▼
         通过则进入下一 Phase，失败则中断
```

#### 单任务执行流程

以 `T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts` 为例：

```text
1. 读取任务描述
   └── "实现 trim 函数于 apps/web/src/utils/string.ts"

2. 确定目标文件
   └── apps/web/src/utils/string.ts

3. 查询技术约束（plan.md）
   ├── 文件位置: apps/web/src/utils/string.ts
   ├── 导出方式: 命名导出 export function
   ├── 参数类型: string | null | undefined
   ├── 空值处理: 内部使用 ?? 运算符
   └── 质量标准: 完整 JSDoc 注释

4. 查询接口定义（data-model.md）
   └── export function trim(str: string | null | undefined): string;

5. 查询技术决策（research.md）
   ├── 实现方式: 原生 String.prototype.trim()
   ├── 空值保护: (str ?? '').trim()
   └── 拒绝替代方案: lodash（包体积冗余）

6. 生成代码
   └── 写入 string.ts 文件

7. 标记任务完成
   └── - [x] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
```

### 3.4 第四步：文件协调规则

当多个任务操作同一个文件时，AI 采用以下策略：

| 场景         | 策略                 | 示例                                          |
| ------------ | -------------------- | --------------------------------------------- |
| 不同文件     | 可并行执行           | T001 写 string.ts，T002 写 config.ts          |
| 同一文件追加 | 串行追加             | T001 添加 trim，T002 在同一文件追加 uppercase |
| 同一文件修改 | 串行修改，保留上下文 | T003 修改函数体，T004 修改注释                |

**本案例示例**:

```typescript
// T001 先执行：创建文件并添加 trim
export function trim(str: string | null | undefined): string {
  return (str ?? '').trim();
}

// T002 串行追加：在同一文件添加 uppercase
export function uppercase(str: string | null | undefined): string {
  return (str ?? '').toUpperCase();
}

// T003 串行追加：在同一文件添加 lowercase
export function lowercase(str: string | null | undefined): string {
  return (str ?? '').toLowerCase();
}
```

---

## 四、文件读取优先级（AI 决策参考）

当 AI 执行 Implement 时，面对一个具体任务，它会按以下优先级查询信息：

### 4.1 决策金字塔

```
                    ┌─────────────┐
                    │   spec.md   │
                    │  （需求兜底） │  ← 最终仲裁者：有歧义时回查
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌─────────┐  ┌─────────┐  ┌─────────┐
        │plan.md  │  │tasks.md │  │data-    │
        │技术方案  │  │执行顺序  │  │model.md │
        └────┬────┘  └────┬────┘  └────┬────┘
             │            │            │
             └────────────┼────────────┘
                          ▼
                   ┌─────────────┐
                   │ research.md │
                   │ （决策参考）  │
                   └─────────────┘
```

### 4.2 优先级详解

| 优先级 | 文件          | 查询时机            | 作用                    |
| ------ | ------------- | ------------------- | ----------------------- |
| **P0** | tasks.md      | 每个任务开始时      | "要做什么" + "在哪里做" |
| **P1** | plan.md       | 需要技术约束时      | "怎么做" + "用什么技术" |
| **P2** | data-model.md | 需要类型签名时      | "接口长什么样"          |
| **P3** | quickstart.md | 验证代码可用性时    | "期望的调用方式"        |
| **P4** | spec.md       | tasks/plan 有歧义时 | "真实意图是什么"        |
| **P5** | research.md   | 需要技术决策依据时  | "为什么这样实现"        |

### 4.3 实际决策示例

**场景**: AI 执行 T001，任务描述是"实现 trim 函数于 apps/web/src/utils/string.ts"

| 步骤 | 查询文件      | 获取的信息                                       | 生成的代码               |
| ---- | ------------- | ------------------------------------------------ | ------------------------ |
| 1    | tasks.md      | 要在 `string.ts` 实现 `trim`                     | —                        |
| 2    | plan.md       | 命名导出、零依赖、JSDoc                          | `export function` + 注释 |
| 3    | data-model.md | `trim(str: string \| null \| undefined): string` | 参数类型                 |
| 4    | research.md   | 空值处理用 `??`                                  | `(str ?? '')`            |
| 5    | quickstart.md | `trim('  hello  '); // => 'hello world'`         | 验证逻辑正确             |
| 6    | spec.md       | "传入 null 或 undefined 时返回空字符串"          | 兜底验证                 |

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
```

---

## 五、进度跟踪与错误处理

### 5.1 进度报告

AI 每完成一个任务，会输出进度报告：

```text
✅ T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts - 完成
   └── 文件已更新: apps/web/src/utils/string.ts

⏳ 当前进度: 1/5 任务完成 (20%)
   └── Phase 1 (US1) 已完成，进入 Phase 2 (US2)
```

### 5.2 错误处理策略

| 场景                 | 处理方式                                           |
| -------------------- | -------------------------------------------------- |
| **文件写入失败**     | 报错并停止，建议用户检查文件权限                   |
| **类型检查失败**     | 报错并显示具体类型错误，建议修复                   |
| **任务描述不明确**   | 回查 spec.md 确认意图，如果仍不明确则询问用户      |
| **并行任务部分失败** | 成功的任务继续，失败的任务报告错误，不阻塞其他任务 |
| **串行任务失败**     | 停止执行，等待用户修复后再继续                     |

### 5.3 任务标记规范

```text
执行前: - [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
执行后: - [x] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
         ↑
      复选框标记为完成
```

**重要**: AI 会自动将已完成的任务标记为 `[x]`，用户不需要手动修改。

---

## 六、完成验证（Completion Validation）

所有任务执行完成后，AI 会进行最终验证：

### 6.1 验证项

| 验证项         | 检查内容                                | 本案例结果         |
| -------------- | --------------------------------------- | ------------------ |
| **任务完整性** | 所有 `- [ ]` 是否已标记为 `- [x]`       | 5/5 完成           |
| **文件存在性** | `plan.md` 中声明的文件是否已创建        | string.ts 已创建   |
| **规格一致性** | 代码是否符合 `data-model.md` 的类型定义 | 参数类型匹配       |
| **需求满足度** | 代码是否满足 `spec.md` 的验收场景       | 3 个用户故事均满足 |

### 6.2 验证失败处理

如果验证发现不一致（例如代码和 data-model 的类型签名不匹配）：

```text
⚠️ 验证失败: data-model.md 中 trim 的参数类型为 string | null | undefined
   但代码中实现为 string，不匹配。

建议修复方案:
1. 修改代码以匹配 data-model
2. 或重新运行 /speckit-plan 更新 data-model
```

### 6.3 完成后 Extension Hooks

验证通过后，AI 检查 `.specify/extensions.yml` 中的 `after_implement` 钩子：

```text
检查 hooks.after_implement
    │
    ├── 不存在或无可用钩子 → 静默跳过
    │
    └── 有可执行钩子 → 按 optional 标志处理
          ├─ optional: true → 显示钩子信息，用户决定是否执行
          └─ optional: false → 自动执行
```

---

## 七、完整执行时序图

```text
用户
 │
 ├── /speckit-implement ──────────────────────────────────────────────┐
 │                                                                    │
 ▼                                                                    │
AI 执行 Pre-Execution Checks                                          │
 ├── 读取 tasks.md, plan.md, spec.md                                 │
 ├── 检查 checklists 状态                                            │
 ├── 执行 before_implement hooks（如有）                              │
 └── 加载实现上下文（data-model, quickstart, research）                │
 │                                                                    │
 ▼                                                                    │
AI 解析 tasks.md 结构                                                 │
 ├── 提取 Phase 分组                                                  │
 ├── 提取任务 ID、Story 标签、文件路径                                │
 └── 确定执行顺序（串行/并行）                                        │
 │                                                                    │
 ▼                                                                    │
For each Phase:                                                       │
 ├── For each Task in Phase:                                          │
 │    ├── 读取任务描述                                                │
 │    ├── 查询 plan.md 技术约束                                       │
 │    ├── 查询 data-model.md 类型定义                                │
 │    ├── 查询 research.md 技术决策                                  │
 │    ├── 生成/修改代码文件                                           │
 │    └── 标记任务完成 [x]                                            │
 ├── Phase Checkpoint 验证                                            │
 └── 报告 Phase 完成进度                                              │
 │                                                                    │
 ▼                                                                    │
Completion Validation                                                 │
 ├── 验证所有任务已完成                                              │
 ├── 验证代码符合规格                                                │
 └── 执行 after_implement hooks（如有）                               │
 │                                                                    │
 ▼                                                                    │
输出最终报告 ─────────────────────────────────────────────────────────┘
 ├── 已完成任务数 / 总任务数
 ├── 生成的文件列表
 └── 下一步建议
```

---

## 八、实战案例：string.ts 的 Implement 执行记录

以下是以本案例为例，展示 AI 执行 `/speckit-implement` 时的完整决策链。

### 8.1 执行前状态

```text
tasks.md:
- [ ] T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts
- [ ] T002 [US2] 实现 uppercase 函数于 apps/web/src/utils/string.ts
- [ ] T003 [US3] 实现 lowercase 函数于 apps/web/src/utils/string.ts
- [ ] T004 确保 apps/web/src/utils/string.ts 中所有函数包含完整 JSDoc 注释
- [ ] T005 确保导入排序遵循项目规范（@/ 别名）
```

### 8.2 Phase 1: US1 - trim

```text
任务: T001 [US1] 实现 trim 函数于 apps/web/src/utils/string.ts

AI 查询:
  - tasks.md: 在 string.ts 中实现 trim
  - plan.md: 命名导出，参数 string | null | undefined，内部用 ??
  - data-model.md: trim(str: string | null | undefined): string
  - research.md: (str ?? '').trim()，零依赖

AI 决策:
  - string.ts 不存在，创建新文件
  - 添加 JSDoc 注释（提前满足 T004 的部分要求）

生成的代码:
  /**
   * 去除字符串首尾空白字符
   * @param str - 待处理的字符串，允许传入 null 或 undefined
   * @returns 去除首尾空白后的字符串；传入 null/undefined 时返回空字符串
   */
  export function trim(str: string | null | undefined): string {
    return (str ?? '').trim();
  }

标记: - [x] T001 [US1] ...
```

### 8.3 Phase 2: US2 - uppercase

```text
任务: T002 [US2] 实现 uppercase 函数于 apps/web/src/utils/string.ts

AI 决策:
  - string.ts 已存在，追加函数
  - 保持同一文件的 JSDoc 风格

追加的代码:
  export function uppercase(str: string | null | undefined): string {
    return (str ?? '').toUpperCase();
  }

标记: - [x] T002 [US2] ...
```

### 8.4 Phase 3: US3 - lowercase

```text
任务: T003 [US3] 实现 lowercase 函数于 apps/web/src/utils/string.ts

AI 决策:
  - 继续追加函数

追加的代码:
  export function lowercase(str: string | null | undefined): string {
    return (str ?? '').toLowerCase();
  }

标记: - [x] T003 [US3] ...
```

### 8.5 Phase 4: Polish

```text
任务: T004 确保所有函数包含完整 JSDoc 注释

AI 检查:
  - trim: 有 JSDoc ✅
  - uppercase: 有 JSDoc ✅
  - lowercase: 有 JSDoc ✅

标记: - [x] T004 ...

任务: T005 确保导入排序遵循项目规范

AI 检查:
  - 文件内无导入语句（纯工具函数），无需排序 ✅

标记: - [x] T005 ...
```

### 8.6 最终状态

```text
所有 5 个任务完成 (100%)
生成文件: apps/web/src/utils/string.ts（27 行）

代码验证:
  - 参数类型: string | null | undefined ✅（匹配 data-model.md）
  - 返回值类型: string ✅（匹配 data-model.md）
  - 空值处理: (str ?? '') ✅（匹配 research.md 决策）
  - JSDoc: 完整 ✅（满足 T004）
```

---

## 九、FAQ

### Q1: Implement 会修改 spec.md 或 plan.md 吗？

**A**: 不会。Implement 只修改源代码文件（如 `.ts`、`.tsx`、`.css`）和标记 tasks.md 的复选框。spec.md 和 plan.md 是只读的。

### Q2: 如果 tasks.md 和 plan.md 有冲突，AI 听谁的？

**A**: 优先听 tasks.md 的执行顺序，但会参考 plan.md 的技术约束。如果类型定义有冲突，以 data-model.md 为准。如果都解释不通，回查 spec.md。

### Q3: Implement 可以只执行部分任务吗？

**A**: 默认会执行所有未完成的任务。如果想只执行特定任务，可以在指令中说明，例如："只实现 trim 函数"。

### Q4: Implement 执行到一半出错了，已完成的任务会被回滚吗？

**A**: 不会回滚。已完成的代码修改会保留。修复问题后，重新运行 `/speckit-implement`，AI 会跳过已完成的任务，继续执行剩余任务。

### Q5: 为什么 Implement 也要读 spec.md？tasks.md 不是已经够了吗？

**A**: tasks.md 告诉 AI"做什么"，但遇到歧义时需要 spec.md 提供"为什么要做"。例如任务描述写"做空值处理"，但 spec.md 里明确写了"传入 null 时返回空字符串而不是抛出异常"，这个细节决定代码怎么写。

### Q6: 我可以跳过 tasks.md 直接运行 Implement 吗？

**A**: 不建议。如果没有 tasks.md，AI 会尝试直接读 plan.md 执行，但缺乏明确的任务拆分和进度跟踪，容易遗漏步骤。

---

## 十、总结

### Implement 阶段的核心特征

| 特征                      | 说明                                                                      |
| ------------------------- | ------------------------------------------------------------------------- |
| **唯一修改代码的阶段**    | 前 4 个阶段只生成文档，Implement 才写代码                                 |
| **严格按文档执行**        | AI 不会擅自添加文档未要求的功能                                           |
| **多文件交叉参考**        | 同时读取 tasks.md（做什么）、plan.md（怎么做）、data-model.md（接口定义） |
| **自动进度跟踪**          | 每完成一个任务自动标记 `[x]`，输出进度百分比                              |
| **串行 Phase + 串行任务** | 同一文件的任务串行执行，不同文件的任务理论上可并行                        |

### Implement 的执行哲学

> **"文档即代码，代码即文档"**

Implement 阶段不是 AI"自由发挥"写代码，而是**严格将设计文档翻译为代码**。如果最终代码不符合预期，问题通常不在 Implement 阶段，而在上游的 Plan 或 Tasks 阶段——文档没有写清楚。

---

_本文档详细解析了 `/speckit-implement` 命令的完整执行流程、文件读取优先级和决策机制。_
