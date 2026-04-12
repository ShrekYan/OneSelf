# Claude Code `.claude/` 目录结构深度理解手册

本文档完整梳理了 `.claude/` 下 `agents/commands/skills/rules` 四个目录的关系、触发方式和最佳实践，适合后续回顾学习。

---

## 目录

- [目录总览](#目录总览)
- [各个目录核心定义](#各个目录核心定义)
- [触发方式汇总](#触发方式汇总)
- [常见问题深度解答](#常见问题深度解答)
- [完整调用链举例](#完整调用链举例)
- [最佳实践总结](#最佳实践总结)

---

## 目录总览

```
.claude/
├── agents/          # 专家子代理 - 每个文件定义一个专业化的子 Claude 专家
├── commands/        # 公共规则仓库 - 每个文件是一条具体的规则/检查清单
├── skills/          # 斜杠命令入口 - 每个文件注册一个 /xxx 命令，定义执行流程
├── rules/           # 前端项目开发规范 - 编码规范说明书，文件名都以 frontend- 开头
└── ...
```

---

## 各个目录核心定义

### 1️⃣ `agents/` - 专家子代理

**本质**：每个文件定义一个**专业化的子 Claude 专家进程**，它有自己的角色定位、专业领域、工作流程。

**谁触发**：
- ✅ 由**主 Claude（我）**主动调用 → 遇到复杂任务，启动专门的专家去处理
- ✅ 你用自然语言说"帮我做代码审查" → 我理解需求后启动对应 agent
- ❌ **不能**直接通过 `/xxx` 斜杠触发（没有注册成命令）

**文件结构**：
```yaml
---
name: code-reviewer
description: 审查代码质量...
tools: Read, Glob, Grep...
model: inherit
---
# 完整的角色设定、检查清单、工作流程、输出要求

你是代码审查专家，请按照 .claude/commands/frontend-code-review.md 的规则进行审查...
```

**关键**：agent 可以引用 command 的公共规则，也可以自己写完整规则。

---

### 2️⃣ `commands/` - 公共规则仓库

**本质**：存放**斜杠命令的规则和检查清单**，是公共的，可以被 skill/agent 引用复用。

**谁触发**：
- ✅ 你**手动输入 `/xxx`** + `skills/xxx.md` 不存在 → Claude Code 自动 fallback 加载
- ✅ 被 `skills/` 引用 → skill 入口加载后，引用这里的规则
- ✅ 被 `agents/` 引用 → agent 工作时，对照这里的清单检查
- ✅ **公共规则**，可以被多处复用

**触发流程（fallback）**：
```
你输入: /code-review
  ↓
Claude Code 找 skills/code-review.md → 没找到
  ↓
自动 fallback → 找 commands/frontend-code-review.md → 找到了
  ↓
加载内容给我 → 我按照规则执行
```

---

### 3️⃣ `skills/` - 斜杠命令入口登记

**本质**：**斜杠命令的注册入口**，告诉 Claude Code 系统"有这么一个 `/xxx` 命令，该怎么执行"。

**触发**：
- ✅ 你输入 `/xxx` → Claude Code 找 `skills/xxx.md` → 加载执行
- ❌ 不输入 `/xxx` → 永远不会触发，躺着不动

**什么时候需要 skill**：

| 场景 | 需要 skill？ |
|------|-------------|
| 只是一份静态规则/清单 | ❌ 不需要 → 直接放 `commands/`，fallback 够用 |
| 需要定义执行流程（先做A，再做B，再做C） | ✅ 需要 |
| 需要整合多个 command 文件 | ✅ 需要（打包成套餐） |
| 需要定义参数、处理输入 | ✅ 需要 |
| 需要前置处理（调用 API、执行命令） | ✅ 需要 |
| 规则只给这个命令用，不需要复用 | ❓ 可放 skill 里，也可放 commands，都可以 |

**一个 skill 引用多个 command 例子**（做套餐）：

`.claude/skills/full-check.md`:
```markdown
---
name: full-check
description: 全方位检查（代码+性能+安全）
---

请按照以下顺序依次执行：

1. 首先，按照 .claude/commands/frontend-code-review.md 进行代码审查
2. 然后，按照 .claude/commands/frontend-perf.md 进行性能检查
3. 最后，按照 .claude/commands/frontend-security.md 进行安全检查

汇总所有问题，按严重程度排序输出。
```

这个 skill 整合了三个 command 规则，你只需要输入一次 `/full-check` 就能完成三次检查。

---

### 4️⃣ `rules/` - 项目开发规范手册

**本质**：项目的**编码规范说明书**，不是可执行程序，是文档。

**什么时候用**：
- ✅ 我写新代码时 → 读这些规则，保证代码符合项目规范
- ✅ 我修改代码时 → 对照规则检查
- ✅ code-review 时 → 按照规则一条条检查
- ❌ 不会自动触发，你不叫我干活，我就不读

---

## 触发方式汇总

| 模块 | 触发者 | 触发方式 | 是否自动运行 |
|------|--------|----------|-------------|
| `agents/` | 主 Claude（我） | 调用 `Agent(subagent_type="xxx")` | 你说自然语言需求，我自动发起 |
| `commands/` | 你（用户） / skill / agent | 输入 `/xxx` (fallback) 或 被引用 | 不引用就不加载 |
| `skills/` | 你（用户） | 输入 `/xxx` | 你不输入，不运行 |
| `rules/` | 我（Claude） | 我写代码/审查代码时读 | 我需要时就读，不需要不读 |

---

## 常见问题深度解答

### Q1: 如果 skill 不存在，但 command 存在，`/xxx` 能触发吗？

**A**: ✅ **能正常触发**。Claude Code 有 fallback 机制：
- 找不到 `skills/xxx.md` → 自动去找 `commands/xxx.md` → 找到了就执行。

这就是为什么我们项目 `/code-review`/`/perf`/`/security`/`/test` 都能正常用，虽然 `skills/` 下没有这些文件。这是**最佳实践**，纯规则命令不需要 skill。

---

### Q2: skill 可以引用多个 command 吗？

**A**: ✅ **完全可以**。这正是 skill 的一个重要用法：**把多个命令打包成一个套餐**，一键执行。

对应饭店比喻：一个 skill 就是菜单上的一个套餐，包含好几道菜（多个 command），你点一次套餐就能吃到多道菜。

---

### Q3: 如果 skill 引用了 command，最终规则是谁定义的？

**A**: 最终规则是 **`command` 定义的**。分工：
- `skill` → 定义**执行流程**（先做什么后做什么，整合哪些规则）
- `command` → 定义**具体规则内容**（检查哪几项，每一项检查什么）

---

### Q4: 如果 skill 不引用 command，skill 自己写规则，可以吗？

**A**: ✅ **完全可以**。两种用法：
- 如果规则需要被多处复用（skill/agent 都会用）→ 放 `command`，skill 引用 → 最佳实践
- 如果规则只给这个 skill 用，不需要复用 → 规则直接写在 skill 里 → "私有规则"，完全 OK

---

### Q5: command 一定是公用的吗？skill 可以有私有规则吗？

**A**: 是的，理解正确：
- `commands/` 就是放**公用规则**的地方，大家都可以引用
- 如果规则只在 skill 里用，不需要公用 → 直接写 skill 里，就是 skill 的私有规则 → 完全没问题，不会混乱

---

### Q6: agent 一定会引用 command/skill 吗？不引用会怎么样？

**A**:
- agent **不一定要**引用 command/skill
- 如果 agent 不引用，**agent 自己写的规则是什么就用什么**，完全可以正常工作
- 不会主动去找同名 command，**写了才读，不写不读**
- 能不能被调用，只看我调不调用它，和它引不引用没关系

---

### Q7: agent 自己写一套规则会混乱吗？

**A**: **不会混乱**，分工清晰：
- 如果这个规则只有这个 agent 用 → 放 agent 自己文件里 → 干净利落
- 如果这个规则还会被 skill/其他 agent 用 → 放 `commands/` 共享 → 避免重复
- 只要遵循"复用放 command，不复放 agent"，就不会混乱

---

### Q8: 所有命令都需要输入 `/xxx` 才会触发吗？

**A**: ✅ **是的**。不输入 `/xxx`，永远不会触发。

唯一例外：一个 skill 调用另一个 skill，这时候入口还是你输入的那个外层命令，还是需要你输入。

---

### Q9: rules 会自动检查代码吗？

**A**: ❌ **不会**。rules 是**编码规范说明书**，我干活的时候会对照它，但它自己不会运行，不会自动触发。

---

### Q10: 执行 `/xxx` 遇到复杂场景，但没有对应专门的 agent，会怎么处理？

**A**: 采用**分层决策策略**，根据任务复杂度自动选择处理方式：

| 任务复杂度 | 处理方式 |
|-----------|---------|
| **简单任务**（改几行、检查几个点） | 主 Claude 直接按规则处理，不调用 agent |
| **中等复杂**（多个文件但逻辑清晰） | 主 Claude 分步自行处理 |
| **高度复杂**（需要深度探索大量文件） | 自动调用 `general-purpose` 通用 agent 处理 |

**最佳实践**：什么时候需要专门配一个 agent？

- ✅ 需要配：**复杂的专业领域任务**，且会被频繁使用（如 `test` → `test-writer`，`code-review` → `code-reviewer`）
- ❌ 不需要配：一次性简单规则、小众场景，通用处理足够用

**完整示例（以 `/test` 为例）**：
```
你输入: /test → 生成整个页面的测试
  ↓
skills/test.md 不存在 → fallback → 加载 commands/frontend-test.md（规则）
  ↓
主 Claude：任务复杂（多个文件要生成测试），看有没有对应 agent
  ↓
发现 agents/frontend-test-writer.md 存在 → 启动专门的测试专家 agent
  ↓
子专家：按规则遍历文件 → 逐个生成测试 → 返回结果
  ↓
主 Claude：整理结果给你 → 完成

如果 agents/frontend-test-writer.md 不存在：
  ↓
主 Claude：任务复杂需要深度探索 → 启动 general-purpose agent
  ↓
通用 agent：拿到规则 → 分析代码 → 生成测试 → 一样能完成，只是专业性稍逊
```

**一句话总结：** 有专门 agent 就用专门的，没有就用通用的，不会卡住，总能处理完。

---

### Q11: 什么是 agent 编排和 skills 编排？

**A：** "编排"就是**安排工作流程**，把多个任务/专家按顺序组合起来完成大任务。两种编排方式对比如下：

| 编排方式 | 本质 | 适用场景 |
|----------|------|---------|
| **Skills 编排** | 在 `skills/xxx.md` 里定义执行顺序，组合多个 `commands/` 规则 | 需要把多个检查/步骤打包成一个命令给用户用 |
| **Agent 编排** | 主 Claude 主动调度多个专业化 `agents/` 专家依次干活 | 大而复杂的任务，每个环节都需要专业专家深度处理 |

---

**Skills 编排示例**（打包套餐）：

```markdown
# .claude/skills/full-check.md
---
name: full-check
description: 全方位代码检查（代码+性能+安全）
---

请按照以下顺序依次执行：

1. 首先，按照 .claude/commands/frontend-code-review.md 进行代码审查
2. 然后，按照 .claude/commands/frontend-perf.md 进行性能检查
3. 最后，按照 .claude/commands/frontend-security.md 进行安全检查

汇总所有问题，按严重程度排序输出。
```

特点：
- 简单直观，只需要定义"做什么、顺序是什么"
- 由主 Claude 一步步执行，遇到复杂任务会自动启动对应 agent
- 用户只需要输入一次 `/full-check` 就能完成三次检查

---

**Agent 编排示例**（主 Claude 调度专家）：

```
你说："帮我全面检查这个项目"
  ↓
主 Claude：理解需求 → 启动 code-reviewer agent（代码专家）
  ↓
code-reviewer 返回代码审查结果
  ↓
主 Claude：拿到结果 → 启动 frontend-performance-expert agent（性能专家）
  ↓
性能专家返回性能优化建议
  ↓
主 Claude：拿到结果 → 启动 security-auditor agent（安全专家）
  ↓
安全专家返回安全问题清单
  ↓
主 Claude：汇总三个专家结果 → 整理成一份完整报告给你
```

特点：
- 每个专家专精一个领域，输出质量更高
- 主 Claude 负责调度，专家负责专业干活
- 适合特别复杂、需要深度分析的任务

---

**饭店比喻总结：**

| 概念 | 饭店对应 |
|------|----------|
| Skills 编排 | 套餐菜单上印好了上菜顺序：冷菜 → 主菜 → 甜点 |
| Agent 编排 | 主厨（主 Claude）给各个专职大厨派活：老王烧菜，老李做甜点，张刀工摆盘 |

**在我们项目中，两种方式混用，各取所长：**
- 简单组合多个规则 → Skills 编排（套餐）
- 复杂专业任务 → Agent 编排（专家分工）

---

## 完整调用链举例

### 例 1：你输入 `/code-review`（skill 不存在，command 存在）

```
你：输入 /code-review
  ↓
Claude Code：找 skills/code-review.md → 没找到
  ↓
Claude Code：自动 fallback → 读 commands/frontend-code-review.md
  ↓
我：拿到规则清单 → 按照规则检查你的代码 → 输出结果
  ↓
如果代码量很大：
  ↓
我：启动 agents/frontend-code-reviewer.md 子专家
  ↓
子专家：加载角色 → 读 rules（项目规范）→ 读 commands/frontend-code-review.md（检查清单）→ 分析代码 → 返回报告
  ↓
我：把专家报告整理给你
```

---

### 例 2：你说"帮我优化一下这个页面的性能"（自然语言触发 agent）

```
你："帮我优化一下这个页面的性能"
  ↓
我：理解需求 → 需要性能专家 → 调用 Agent(subagent_type="frontend-performance-expert")
  ↓
子专家：加载 agents/frontend-performance-expert.md → 读 rules → 读 commands/frontend-perf.md 检查清单 → 分析代码 → 输出优化方案
  ↓
我：拿到结果 → 给你
```

---

### 例 3：你输入 `/full-check`（skill 整合多个 command）

```
你：输入 /full-check
  ↓
Claude Code：找到 skills/full-check.md → 加载
  ↓
skill 说：依次执行 code-review + perf + security
  ↓
第一步：按照 commands/frontend-code-review.md → 做代码审查
  ↓
第二步：按照 commands/frontend-perf.md → 做性能检查
  ↓
第三步：按照 commands/frontend-security.md → 做安全检查
  ↓
汇总三个结果 → 输出给你
```

---

### 例 4：你让我新建一个文章列表页面（用到 rules）

```
你："帮我新建一个文章列表页面"
  ↓
我：需要遵循项目规范 → 读 rules/
  ↓
  读 rules/frontend-typescript.md → 知道类型该怎么写
  读 rules/frontend-css-scss.md → 知道样式该怎么写
  读 rules/frontend-api-design.md → 知道 API 该怎么定义
  读 rules/frontend-handle-ts.md → 知道逻辑拆分到 index.tsx/useStore.ts/handle.ts
  ↓
我按照所有规范 → 写出代码 → 完成
```

---

## 最佳实践总结

### 一句话终极记忆

```
agents   = 请来帮忙的专家，我叫才来
commands = 公共规则仓库，谁用谁拿
skills   = 斜杠入口菜单，登记有什么菜，可打包套餐
rules    = 做菜规范手册，我做菜时照着看
```

### 最佳实践表格

| 场景 | 放哪里 |
|------|--------|
| 专业化专家，需要深度分析复杂任务 | `agents/` |
| 一条规则/检查清单，可能被多处复用 | `commands/` |
| 需要定义执行流程/整合多个规则/注册斜杠命令 | `skills/` |
| 项目整体编码规范，写代码时要遵循 | `rules/` |
| 纯规则，不需要注册流程，你输入 `/xxx` 就能用（fallback） | `commands/` → 不需要 `skills/` |
| 一个命令整合多个规则（套餐） | `skills/` 引用多个 `commands/` |
| 规则只在一个地方用，不需要复用 | 放使用它的地方（agent 或 skill） |

### 完整判断流程图

```
你想要新增一个 /xxx 命令
  ↓
┌─────────────────────────────────┐
│  需要整合多个 command 吗？       │
│  ┌─ YES ─┐ → 新建 skills/xxx.md，里面引用多个 commands → 完成
│  └──────┘
│  ┌─ NO ─┘
│     ↓
│  规则会被 skill/agent 多处复用吗？
│     ┌─ YES ─┐ → 新建 commands/xxx.md → 完成（fallback 就能用）
│     └──────┘
│     └─ NO ─┘ → 规则只给这个命令用
│           → 新建 skills/xxx.md，规则写里面 → 完成
└─────────────────────────────────┘
```

---

### 饭店比喻总结

| 概念 | 饭店对应 |
|------|----------|
| `agents/` | 特聘的专职大厨，每个大厨专精一道菜 |
| `commands/` | 菜谱仓库，每道菜一份菜谱 |
| `skills/` | 给顾客看的菜单，一页一道菜/一个套餐 |
| `rules/` | 饭店烹饪卫生安全规范 |
| 一个 skill 多个 command | 套餐，一个套餐包含好几道菜 |
| skill 不引用 command，自己写规则 | 菜单上直接印了做法 |
| 你输入 `/xxx` | 你点菜 |

---

*本文整理于 2026-04-12，基于 Claude Code 当前机制，完整梳理了所有深层问题*
