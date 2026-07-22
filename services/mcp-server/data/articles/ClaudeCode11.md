---
title: 编排实战：Workflow与Orchestrator Agent怎么选、怎么写
slug: claude-code-workflow-or-orchestrator
date: 2024-06-01
tags: [Claude Code, Workflow, Orchestrator, 编排]
---

# Claude Code 编排实战：Workflow 与 Orchestrator Agent 怎么选、怎么写

这是「Claude Code 配置体系」系列的第 7 篇。上一篇我们聊了 Rules 按需加载，这篇进入编排层——当你有多个 Agent 需要协同工作时，怎么组织它们？

## 先说结论

Claude Code 提供两种编排方式：

- **Workflow**（`.claude/workflows/xxx.yml`）——写 YAML，引擎按固定步骤执行，像 GitHub Actions

- **Orchestrator Agent**（`.claude/agents/xxx-orchestrator.md`）——写自然语言，LLM 理解后灵活调度，像给导演一份剧本

**选择原则就一句话：简单固定用 Workflow，复杂灵活用 Orchestrator。**

听起来像废话，但"简单"和"复杂"的边界在哪，是这篇文章要讲清楚的事。

## 一、为什么需要编排？

单 Agent 能解决大部分问题。但当任务变复杂——比如一次完整的前端审查，需要同时跑代码质量、安全扫描、性能分析三个维度——你会遇到三个瓶颈：

### 瓶颈 1：用户记不住那么多命令

没有编排时，用户得手动执行三次：

```
/frontend-code-review src/pages/Article
/frontend-security src/pages/Article
/frontend-performance src/pages/Article
```

有了编排后，一个命令搞定：

```
/full-frontend-review src/pages/Article
```

### 瓶颈 2：各 Agent 之间信息断层

安全扫描 Agent 不知道代码审查发现了什么，性能分析 Agent 也不了解前两轮的问题。每个 Agent 都从零开始看，效率低，而且容易漏掉关联问题。

### 瓶颈 3：结果散落，无法统一决策

三份报告各自输出，用户得自己拼、自己排优先级。问题多的时候，光是整理就要花半天。

编排就是解决这三个问题的：**一个入口、信息流转、结果整合**。

## 二、两种编排方式的核心区别

直接看对比：

| 维度       | Workflow (YAML)                  | Orchestrator Agent (Markdown)        |
| ---------- | -------------------------------- | ------------------------------------ |
| 执行者     | 引擎，按配置机械执行             | LLM，理解自然语言灵活执行            |
| 流程灵活性 | 写死了，改流程必须改文件         | LLM 可根据上下文灵活变通             |
| 条件判断   | 只支持简单 `if`（字符串匹配等）  | 任意复杂逻辑（统计数量、多条件组合） |
| 结果传递   | 前一步结果**不能**动态传给后一步 | 可以把前一步的问题告诉后一步重点关注 |
| 结果整合   | 只能拼接输出文本                 | 可以整合、排序、格式化、总结         |
| Shell 命令 | 原生支持 `run: npm run lint`     | 需通过 Bash 工具调用                 |
| 可预测性   | 100% 确定，零偏差                | 依赖 LLM 理解，偶有微小偏差          |
| 学习门槛   | 低，会写 CI 就会写               | 需要会写 Agent prompt                |

有一个判断维度特别关键：**你需不需要"前一步的结果影响后一步的行为"？**

如果需要 → Orchestrator；如果不需要 → Workflow。

## 三、同题对比：同一个任务的两种写法

光看概念不够直观，下面用项目中的真实案例做对比——**同一个"前端完整审查"任务，Workflow 和 Orchestrator 各怎么写**。

### 3.1 Workflow 版：frontend-code-review.yml

```yaml
# .claude/workflows/frontend-code-review.yml
name: 前端代码审查
description: 自动化完整前端代码审查，按顺序执行：代码质量 → 安全漏洞 → 性能优化
inputs:
  - name: scope
    description: 审查范围 (changed: 仅变更文件 / all: 全项目)
    default: "changed"
    options: ["changed", "all"]

  - name: targetPath
    description: 目标路径（可选，例如 src/pages/Article）
    default: ""

steps:
  - name: 准备阶段
    run: |
      echo "🧐 开始前端代码审查..."
      echo "📋 审查范围：{{scope}}"

  - name: 代码质量审查
    agent: frontend-code-reviewer-agent
    prompt: |
      根据项目规范进行前端代码审查：
      审查范围：{{#if (eq scope "all")}}全项目前端代码{{else}}变更的前端文件{{/if}}
      请检查 TypeScript 类型、React 最佳实践、MobX 规范等。

  - name: 安全漏洞检查
    agent: frontend-security-auditor
    prompt: |
      对前端代码进行安全漏洞扫描：
      检查范围：同上
      请检查 XSS、敏感信息泄露、路由权限等。

  - name: 性能优化分析
    agent: frontend-performance-expert-agent
    prompt: |
      对前端代码进行性能分析：
      分析范围：同上
      请关注包体积、渲染性能、移动端优化等。

  - name: 生成审查报告
    run: |
      echo "📊 前端代码审查完成"
      echo "以上报告整合了代码质量、安全漏洞、性能优化三个维度。"
```

### 3.2 Orchestrator 版：full-frontend-review-orchestrator.md

```
# .claude/agents/full-frontend-review-orchestrator.md

---
name: full-frontend-review-orchestrator
description: 一键触发代码质量 → 安全扫描 → 性能优化，输出综合报告
tools: Agent
model: inherit
---

# 你必须严格遵循的工作流程

## 步骤 2: 触发第一阶段 - 代码质量审查
- 使用 Agent 工具调用 frontend-code-reviewer
- 获取代码质量审查报告

## 步骤 3: 评估第一阶段结果
- 统计严重问题（🔴）的数量
- 如果严重问题 > 0 且未设置 --continue-on-error：停止执行
- 否则：继续

## 步骤 4: 触发第二阶段 - 安全漏洞扫描
- 调用 frontend-security-auditor
- 在 prompt 中提示："第一阶段发现了以下可疑问题，
  请重点关注这些区域：[粘贴第一阶段问题列表]"

## 步骤 6: 触发第三阶段 - 性能分析优化
- 调用 frontend-performance-expert
- 把前两阶段发现的问题都传过去

## 步骤 7: 整合输出综合报告
- 统一按 P0 → P1 → P2 重新排序所有问题
- 输出格式化的综合审查报告
```

### 3.3 逐项对比：同一个任务，差在哪

| 对比点       | Workflow 版                           | Orchestrator 版                  |
| ------------ | ------------------------------------- | -------------------------------- |
| **流程控制** | 三步顺序执行，跑完拉倒                | 每步评估结果，有问题可提前停止   |
| **结果传递** | 安全扫描不知道代码审查发现了什么      | 前一步的问题列表显式传给后一步   |
| **条件判断** | 只能用模板语法 `{{#if}}` 做字符串判断 | 可以统计问题数量、组合多条件判断 |
| **结果整合** | 最后一步只能 `echo` 拼接文本          | 整合三份报告，按优先级重新排序   |
| **灵活性**   | 想加 `--continue-on-error`？改 YAML   | 自然语言描述就行，LLM 理解执行   |
| **确定性**   | 每次执行路径 100% 相同                | LLM 理解可能偶有微小偏差         |

**关键差异一目了然：Workflow 版写了同样的三个 Agent，但它们各自独立运行，互不知情；Orchestrator 版让它们像团队一样协作——前面的发现会影响后面的重点。**

## 四、Workflow：固定流程的利器

### 4.1 什么时候用

- 跑固定的 shell 命令（lint、build、test）

- 步骤之间没有逻辑依赖

- 需要 100% 确定性，不接受任何偏差

- 逻辑简单，不需要 LLM 理解

### 4.2 实战案例：预提交检查

```yaml
# .claude/workflows/pre-commit-check.yml
name: pre-commit-check
description: 提交前自动跑 lint + 类型检查 + 单测
steps:
  - name: ESLint 检查
    run: npm run lint

  - name: TypeScript 类型检查
    run: npx tsc --noEmit

  - name: 仅后端变更时跑后端 lint
    if: changed_files matches "^services/"
    run: cd services/backend && npm run lint

  - name: 运行单测
    run: npm run test
```

这个场景用 Workflow 是正确的——全是固定命令，最复杂的逻辑也就是 `if: changed_files matches`，字符串匹配就够了。

### 4.3 Workflow 的天花板

如果你想做的事情超出下面这个清单，Workflow 就做不到了：

| 能做            | 做不到                         |
| --------------- | ------------------------------ |
| 顺序执行步骤    | 根据前一步结果动态调整后一步   |
| 简单 if 判断    | 统计问题数量后决定是否继续     |
| 拼接输出文本    | 整合多份报告并重新排序         |
| 执行 shell 命令 | 动态生成 prompt 传给下个 Agent |

## 五、Orchestrator Agent：灵活编排的导演

### 5.1 什么时候用

- 需要复杂条件判断（统计数量、多条件组合）

- 需要前一步的结果影响后一步的行为

- 需要整合多个 Agent 的输出

- 需要 LLM 理解自然语言指令

### 5.2 编排器的身份证

怎么识别一个 Agent 是编排器？看 YAML 头部的 `tools` 字段：

```yaml
# .claude/agents/full-frontend-review-orchestrator.md
---
name: full-frontend-review-orchestrator
description: 一键触发代码质量 → 安全扫描 → 性能优化，输出综合报告
tools: Agent # ← 只声明 Agent 这一个工具
model: inherit
triggers:
  - 全量前端审查
  - 完整代码审查
---
```

**`tools: Agent` 是编排器的标志**——它不亲自干活，只通过 Agent 工具调度其他 Agent。

对比普通 Agent：

```yaml
# 普通功能 Agent，声明的是实际干活的工具
---
name: frontend-code-reviewer
tools: Read, Glob, Grep, Edit
---
```

### 5.3 实战拆解：前端完整审查编排器

这是项目中的编排器源码（`full-frontend-review-orchestrator.md`），7 步标准流程：

**步骤 1：解析用户输入**

获取检查范围（默认 `src/`），解析选项参数（`--continue-on-error`、`--only-issues`）。

**步骤 2：触发第一阶段 — 代码质量审查**

调用 `frontend-code-reviewer`，传入检查范围，获取代码质量报告。

**步骤 3：评估第一阶段结果 ← 这是 Workflow 做不到的**

```
统计严重问题（🔴）的数量
if 严重问题 > 0 且 未设置 --continue-on-error:
 停止执行，输出已有结果
 提示用户先修复严重问题
else:
 继续
```

**步骤 4：触发第二阶段 — 安全漏洞扫描 ← 结果传递也是 Workflow 做不到的**

调用 `frontend-security-auditor`，同时在 prompt 中告诉它：

"第一阶段代码审查已完成，发现了以下可疑问题，请重点关注这些区域：[粘贴问题列表]"

**步骤 5：评估第二阶段结果**

同步骤 3 的条件判断逻辑。

**步骤 6：触发第三阶段 — 性能分析优化**

调用 `frontend-performance-expert`，把前两阶段的问题都传过去：

"前两阶段已完成，以下是发现的问题，请重点关注这些区域进行性能分析：[粘贴问题列表]"

**步骤 7：整合输出综合报告**

统一收集所有问题，按 P0 → P1 → P2 重新排序，输出格式化的综合报告。

### 5.4 编排器满足的 4 个黄金标准

| 标准     | 含义                           | 本项目实现                            |
| -------- | ------------------------------ | ------------------------------------- |
| 单一职责 | 编排器只协调流程，不做具体工作 | ✅ 编排器不审查代码，只调度审查 Agent |
| 流程可控 | 有明确步骤、条件判断、停止机制 | ✅ 每阶段有评估和停止判断             |
| 信息传递 | 前一阶段结果传给后一阶段       | ✅ 前面发现的问题传给后面重点关注     |
| 结果整合 | 最后统一整理输出               | ✅ 按 P0/P1/P2 排序的综合报告         |

## 六、从零写一个编排器

### 6.1 标准模板

```yaml
---
name: xxx-orchestrator
description: 一句话描述这个编排器做什么
tools: Agent
model: inherit
triggers:
  - 触发关键词1
  - 触发关键词2
---

# 角色定位
你是 XX 编排器，负责协调 A、B、C 三个 Agent 依次执行。
用户只需要触发一次，你自动跑完整个流程。

# 你必须严格遵循的工作流程
## 步骤 1: 解析输入
## 步骤 2: 调用 Agent A
## 步骤 3: 评估 A 的结果，决定是否继续
## 步骤 4: 把 A 的问题传给 Agent B，调用 Agent B
## 步骤 N: 整合输出综合报告

# 输出模板
（定义统一的输出格式）

# 行为准则
1. 不修改代码：只负责编排流程
2. 结构化输出：严格遵循输出模板
3. 尊重专业判断：不随意修改子 Agent 的结论
4. 结果传递：务必把前面阶段发现的问题告诉后面阶段
```

### 6.2 Skill 层：编排器的用户界面

编排器 Agent 是执行指挥层，用户看不到它。用户看到的是 **Skill**——命令入口：

| 概念               | 文件位置                                              | 角色定位   | 通俗比喻                 |
| ------------------ | ----------------------------------------------------- | ---------- | ------------------------ |
| Skill              | `.claude/skills/full-frontend-review.md`              | 用户入口层 | 遥控器按钮——按一下就触发 |
| Orchestrator Agent | `.claude/agents/full-frontend-review-orchestrator.md` | 执行指挥层 | 导演——拿到剧本指挥演员   |

Skill 做的事很简单：定义命令格式、说明参数、给出示例，然后触发 Orchestrator。

**这就是 Claude Code 编排的「双重编排模式」——Skill 做入口，Orchestrator 做调度。**

### 6.3 写编排器时的三个易错点

**易错点 1：编排器亲自干活**

编排器只应该用 `Agent` 工具调度其他 Agent。如果你发现自己在编排器里写了"读取文件并分析代码"——错了，这应该是子 Agent 的事。

**易错点 2：忘记传递结果**

前面 Agent 发现的问题，必须显式写在 prompt 里告诉后面的 Agent。LLM 不会自动知道前一轮的输出，你得喂给它。

**易错点 3：缺少停止机制**

如果第一阶段就发现严重安全漏洞，应该停下来让用户先修，而不是无脑继续跑完所有阶段。`--continue-on-error` 是给用户的选择权，不是默认行为。

## 七、混合编排：最佳实践

两种编排不是互斥的。实际项目中，最常见的模式是 Workflow 跑固定流程，再在某个步骤里调用 Orchestrator Agent 做智能分析：

```
用户触发 pre-commit-and-review Workflow
  → Step 1: npm run lint           ← 固定命令，Workflow 直接执行
  → Step 2: npx tsc --noEmit      ← 固定命令
  → Step 3: 调用 full-frontend-review-orchestrator
              → Agent 1: 代码质量审查    ← 智能分析，Orchestrator 调度
              → Agent 2: 安全漏洞扫描
              → Agent 3: 性能优化分析
              → 整合综合报告
  → 返回最终结果
```

原则：**能用固定命令解决的，不要交给 LLM；需要智能判断的，不要硬写 YAML。**

## 八、一图流选择决策

| 你的需求                      | 选择         |
| ----------------------------- | ------------ |
| 跑 lint/build/test 等固定命令 | Workflow     |
| 步骤之间没有逻辑依赖          | Workflow     |
| 需要 100% 确定性              | Workflow     |
| 前一步结果要影响后一步行为    | Orchestrator |
| 需要统计、判断、条件分支      | Orchestrator |
| 需要整合多份报告并排序        | Orchestrator |
| 两者都需要                    | 混合使用     |

## 九、FAQ

**Q：YAML 也支持 `if`，为什么还不够？**

Workflow 的 `if` 只能做字符串匹配这种简单判断：

```yaml
if: changed_files matches "^src/"
```

而 Orchestrator 可以做这种判断：

```
if 严重问题数量 > 3 且 用户没传 --force 参数:
 停止执行，给出友好提示
```

**Q：Orchestrator 更强大，为什么不都用 Orchestrator？**

两个代价：一是 Token 消耗更高，每次执行都要 LLM 理解；二是偶有微小偏差，LLM 不保证 100% 按你写的来。确定性任务用确定性工具更靠谱。

**Q：什么时候该从 Workflow 升级到 Orchestrator？**

当你心里冒出这三个想法之一时：

- "要是前一步的结果能影响后一步就好了"

- "要是能把 Step 1 发现的问题告诉 Step 2 就好了"

- "要是能根据结果多少动态调整输出就好了"

这就是升级信号。

## 十、关键文件速查

| 文件                                                  | 类型         | 说明                             |
| ----------------------------------------------------- | ------------ | -------------------------------- |
| `.claude/skills/full-frontend-review.md`              | Skill        | 用户命令入口                     |
| `.claude/agents/full-frontend-review-orchestrator.md` | Orchestrator | 编排器核心实现                   |
| `.claude/agents/frontend-code-reviewer.md`            | 子 Agent     | 代码质量审查                     |
| `.claude/agents/frontend-security-auditor.md`         | 子 Agent     | 安全漏洞扫描                     |
| `.claude/agents/frontend-performance-expert.md`       | 子 Agent     | 性能优化分析                     |
| `.claude/workflows/frontend-code-review.yml`          | Workflow     | 前端审查 Workflow 版（同题对比） |
| `.claude/workflows/pre-commit-check.yml`              | Workflow     | 预提交检查示例                   |

**总结口诀：简单固定用 Workflow，复杂灵活用 Orchestrator。能用简单工具解决的，就不要用复杂工具。**
