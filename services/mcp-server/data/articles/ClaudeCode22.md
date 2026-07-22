---
title: Command 如何调用 Skill 与 Agent
slug: claude-code-command-skill-agent-invocation
date: 2024-06-01
tags: [Claude Code, Command, Skill, Agent]
---

系列前言：本文是该系列中关于 **Command 调用 Skill 与 Agent 的规范化编写** 的一篇。之前的文章主要演示了 Command、Agent 与 Skill 的"用法"，而本文重点讲解如何规范化地编写 Command，以及 Command 与 Skill、Agent 之间的边界与协作关系。

前文回顾：[Claude Code -6 Commands 实战：从零搭建你的 AI 编码快捷指令体系](https://juejin.cn/post/7644444673583382543)

## 前言：补上 Command 体系里最关键的一块拼图

距离我写《Claude Code -6 Commands 实战：从零搭建你的 AI 编码快捷指令体系》已经过去一段时间了。那篇文章的核心是带你**把命令用起来** ——怎么给 Claude Code 起命令名、怎么分类归档、怎么把高频 prompt 固化成一条 `/xxx` 的快捷指令，顺带也提了一嘴 Skill 和 Agent 可以起到"能力封装"和"专家分工"的作用。

但现在回头看，那篇文章更像是一张**使用说明书** ：它告诉你 Command 能干什么、大概怎么调用 Skill/Agent，却没有深入讲**Command 文件里具体该怎么写** ，**Skill 和 Agent 的调用机制是什么** ，**模板又该长什么样** 。

而随着项目里 Command 越写越多，我越来越发现：只有弄明白"怎么定义"，Command 才能真正从"快捷指令"升级为"工程化能力入口"。否则你写的命令要么是 prompt 越堆越长的"胖子"，要么是把 Skill/Agent 当黑盒用、出了问题不知道怎么调。

所以这篇文章是一个**补充篇** ，也是一个**进阶篇** 。它不再讲"Command 是什么"，而是聚焦以下三个核心问题：

1. **Command 到底该怎么写，才能触发 Skill？**

2. **Command 到底该怎么写，才能调用 Agent？**

3. **Skill 和 Agent 的调用模板分别长什么样，能不能直接照搬？**

在开始之前，先快速对齐两个概念：

- **Skill（技能包）** ：把某一类任务的领域知识、执行流程和输出规范封装成可复用包，多个 Command 都能引用。

- **Agent（专家智能体）** ：让具备独立工具权限、角色边界和专属工作流的子 Claude 去干活，避免主 Claude 被复杂任务撑爆。

## 一、Command 的作用：把入口做得足够薄

在 Claude Code 里，Command 的物理形态就是 `.claude/commands/<command-name>.md` 文件。它的核心职责只有三个：

1. **定义触发名** ：frontmatter 里的 `name` 字段对应 `/name` 命令。

2. **接收用户输入** ：通过 `$ARGUMENTS` 透传给下游能力。

3. **调度执行主体** ：明确由谁来干活——是主 Claude 自己、某个 Skill，还是某个 Agent。

一个设计良好的 Command，通常自己不做复杂判断，而是**尽快把任务交给最合适的执行主体** 。这样 Command 才能保持薄、可维护、可复用。

## 二、通用版本：一个可直接套用的 Command 骨架

下面这个骨架提炼我项目中的 Command 通用结构，同时兼容 **直接由主 Claude 执行** 、**调用 Skill** 和 **调用 Agent** 三种模式。复制后按需裁剪调用方式、替换领域关键词即可落地：

```markdown
---
name: my-command
description: 简短描述
---

# {Command 标题}

你是 {领域} 专家，专注于 {核心能力}。

## Context

用户需要 {目标}。重点关注 {关注点}。

## Requirements

$ARGUMENTS

## Instructions

### 1. Scope and Current State Analysis

- 识别目标文件、模块、函数、测试及受影响行为。
- 总结当前实现与约束条件。
- 标出风险区域与未知项。

### 2. Quality or Change Strategy

- 审查类：定义严重级别与审查维度。
- 迁移类：定义源状态、目标状态、兼容性缺口与回滚方案。
- 重构类：定义安全变换边界与行为保持条件。
- 执行类：定义阶段目标与验收标准。

### 3. Implementation or Recommendation

- 提供具体可执行的代码级或配置级建议。
- 仅在使用示例能直接澄清变更时附带示例。
- 区分 must-fix / should-fix / optional 三层优先级。

### 4. Verification

- 定义需要运行或补充的测试。
- 定义回归检查项。
- 如涉及性能、安全、可维护性，需包含对应检查。

### 5. Output Format

返回：

- **执行摘要**：整体结论与风险评级。
- **检查范围**：覆盖的文件、模块或配置范围。
- **发现项 / 计划**：按优先级分组，每条包含位置、问题、影响、建议。
- **风险等级**：Critical / High / Medium / Low。
- **建议变更**：可落地的修改清单。
- **验证计划**：如何验证修改结果。
- **后续步骤**：建议立即执行的下一步动作。
```

### 骨架关键设计

- **frontmatter 只保留标准字段**：`name` 对应 `/name` 触发名，`description` 用于命令列表展示。无需也不建议在 frontmatter 中写 `skill` 或 `agent` 字段。

- **轻量入口** ：Command 本身不实现专业逻辑。若由 Skill 执行，在正文中以 `使用 **skill-name** skill` 的形式触发；若由 Agent 执行，使用 `Agent` 工具并在 `prompt` 中透传 `$ARGUMENTS`。

- **`$ARGUMENTS` 透传** ：用户需求统一通过 `$ARGUMENTS` 接收，再原样传递给 Skill 或 Agent，避免参数丢失。

- **输出必须包含可执行下一步** ：所有分类模板都强调不能止步于泛泛建议，必须给出明确的 `Next Steps`。

## 三、Command 调用 Skill：把专业能力装进命令

### 3.1 核心机制

Claude Code 的 Skill 存放在 `.claude/skills/<skill-name>/SKILL.md`。要在 Command 里触发它，官方推荐的方式是：**在 Command 文件正文中直接提及 skill 名称** 。

注意：不是用 Markdown 链接，也不是在 frontmatter 里写 `skill: xxx`，而是**自然语言或加粗形式的 skill 名称** 。

例如：

```markdown
使用 **common-todo-scan** skill 扫描项目中的 TODO/FIXME/XXX 标记。
```

当 Claude Code 读取到 Command 文件后，会识别到 `common-todo-scan` 这个名称与 `.claude/skills/common-todo-scan/` 匹配，从而主动调用 Skill 工具。

### 3.2 实际案例：`/todo-scan`

项目中的 `.claude/commands/todo-scan.md` 是一个典型的 Command 调用 Skill 的案例：

```markdown
---
name: todo-scan
description: 扫描项目中的 TODO/FIXME/XXX 标记，生成结构化待办清单
---

# TODO Scan

你是一名代码质量与技术债务分析专家，专注于基于注释标记发现债务、确定优先级并制定修复计划。

## Context

用户需要识别并梳理散落在代码库中的 TODO/FIXME/XXX 标记。重点在于呈现可执行的待办项、按位置分组，并提供团队可以逐步执行的清理路线图。

## Requirements

$ARGUMENTS

## Instructions

### 1. Scope and Current State Analysis

- 使用 **common-todo-scan** skill 扫描项目中的 TODO/FIXME/XXX 标记。
- 未提供参数时，从项目根目录开始扫描；否则使用用户提供的路径或选项作为扫描根目录。
- 识别受影响的文件、行号、标记类型及上下文。
- 按标记类型（TODO / FIXME / XXX）和文件汇总总数。

### 2. Quality or Change Strategy

- 按严重程度对每个标记分类：
  - **Critical**：阻塞正确性、安全性或生产稳定性的 FIXME。
  - **High**：与活跃功能、缺失校验或错误处理相关的 TODO。
  - **Medium**：与重构、优化或文档补充相关的 TODO。
  - **Low**：XXX 备注、提示或可选改进项。
- 标记重复出现的模式和聚集区域，这些往往意味着系统性技术债务。

### 3. Implementation or Recommendation

- 针对每个标记或每个聚集区域提供具体的清理建议。
- 区分必须修复、建议修复和可选改进。
- 当标记意图不明确时，建议负责人或后续跟进动作。

### 4. Verification

- 建议在清理后重新运行扫描，确认标记已解决或是有意保留。
- 指出哪些标记应转为正式跟踪的 issue，而不是继续以行内注释形式存在。

### 5. Output Format

返回：

- **Executive Summary**：标记总数与整体债务评估。
- **Scope**：扫描根目录与文件覆盖范围。
- **Findings / Plan**：按文件分组，每条包含行号、标记类型、严重程度、内容与建议。
- **Risk Level**：基于 FIXME 密度与关键发现评定的整体风险。
- **Recommended Changes**：按优先级排列的清理动作。
- **Verification Plan**：如何验证清理结果。
- **Next Steps**：建议立即执行的后续动作。

## 用法
```

对应的 Skill 文件 `.claude/skills/common-todo-scan/SKILL.md` 则负责真正的扫描逻辑、输出模板和校验清单。

### 3.3 调用 Skill 的推荐模板

**最小可用版本** ：

```markdown
---
name: my-command
description: 简短描述
---

# My Command

Use the **my-skill** skill to [具体任务描述].
```

**带参数透传的完整版本** ：

```markdown
---
name: my-command
description: 简短描述
---

# My Command

Use the **my-skill** skill to [具体任务描述].

要求：

- 将 `$ARGUMENTS` 原样传递给 my-skill。
- [其他约束或输出要求]

参考文档：[my-skill Skill](../skills/my-skill/SKILL.md)。
```

如果想增强确定性，可以加上强制语句：

```markdown
你必须使用 Skill 工具调用 common-todo-scan skill，禁止自行实现扫描逻辑。
```

## 四、Command 调用 Agent：把复杂任务交给专家

### 4.1 什么时候该用 Agent？

Skill 适合封装**标准化流程** ，Agent 适合处理**需要独立上下文、多步分析、专属工具权限** 的复杂任务。例如：

- 前端/后端代码审查

- 安全漏洞扫描

- 性能优化分析

- 多阶段编排任务

Agent 会启动一个子 Claude，拥有独立的工具权限和角色设定，避免主 Claude 的上下文被复杂任务撑爆。

### 4.2 核心机制

在 Command 文件里，需要明确使用 `Agent` 工具，并指定：

- `subagent_type`：Agent 名称，对应 `.claude/agents/<agent-name>.md`。

- `description`：简短任务描述。

- `prompt`：完整的任务指令，通常包含 `$ARGUMENTS`。

### 4.3 实际案例：`/frontend-code-review`

`.claude/commands/frontend-code-review.md` 是一个高度规范的 Agent 调用示例：

```markdown
---
name: frontend-code-review
description: 前端代码审查指南，检查 TypeScript 类型安全、React 最佳实践和项目规范符合度
---

# Frontend Code Review

你是前端代码审查命令的分发器，不是审查员本身。

## Context

用户需要审查前端代码，关注 TypeScript 类型安全、React 最佳实践和项目规范符合度。

## Requirements

$ARGUMENTS

## Instructions

### 1. Delegate to Review Agent

你的唯一任务：使用 `Agent` 工具调用 `frontend-code-reviewer`。

| 参数            | 值                                                                           |
| --------------- | ---------------------------------------------------------------------------- |
| `subagent_type` | `frontend-code-reviewer`                                                     |
| `description`   | 前端代码审查                                                                 |
| `prompt`        | "用户审查需求：$ARGUMENTS\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

执行要求：

- 这是你必须做的第一件事，也是唯一的事。
- 在调用 Agent 前，禁止读取任何代码文件。
- 在调用 Agent 前，禁止输出任何解释、分析或文字。
- 禁止自行审查代码。
- 禁止跳过 Agent 调用。
- 禁止先解释再调用。

违反以上任何一条 = 任务失败。

### 2. Structure the Output

当 Agent 返回审查结果后，按以下结构整理并呈现：

- 执行摘要
- 检查范围
- 发现项 / 计划
- 风险等级
- 建议变更
- 验证计划
- 后续步骤
```

对应的 Agent 文件 `.claude/agents/frontend-code-reviewer.md` 则定义了：

- 角色定位：React 19 + TypeScript + MobX 6 前端代码审查专家

- 工具权限：`Read, Glob, Grep, manage_core_memory`

- 预加载 Skill：`frontend-code-review`

- 审查维度、强制约束、输出模板、Completion Checklist

## 五、常见误区与避坑指南

| 误区                           | 错误写法                                      | 正确做法                                                    |
| ------------------------------ | --------------------------------------------- | ----------------------------------------------------------- |
| 用 Markdown 链接调用 Skill     | `[skill-name](../skills/skill-name/SKILL.md)` | 在正文中提及 skill 名称：`使用 **skill-name** skill`        |
| 在 frontmatter 写 `skill: xxx` | `--- skill: xxx ---`                          | frontmatter 只有 `name` / `description` 等标准字段          |
| Command 里重复实现 Skill 逻辑  | 把扫描规则、输出模板写在 Command 里           | 这些应该放在 Skill 中，Command 只负责入口和调度             |
| 调用 Agent 前先解释            | "好的，我先调用 Agent" 然后再调用             | 直接调用 Agent，调用前不输出任何文字                        |
| 主 Claude 自行完成审查         | 跳过 Agent，自己扫描代码                      | 明确禁止主 Claude 执行，必须交给 Agent                      |
| 参数丢失                       | `$ARGUMENTS` 没有透传                         | 在 Agent 的 prompt 或 Skill 的 args 中显式包含 `$ARGUMENTS` |

## 六、总结：Command 是开关，Skill/Agent 是引擎

到这一步，你应该已经理解了 Claude Code 里三者的关系：

- **Command** ：用户交互入口，越薄越好。

- **Skill** ：标准化能力封装，主 Claude 按规范执行。

- **Agent** ：独立专家智能体，处理复杂任务，避免主上下文过载。

写好一个 Command 的关键，不是把 prompt 写得越长越好，而是：

1. 明确它的职责是"分发"而不是"执行"。

2. 用 `$ARGUMENTS` 正确接收用户输入。

3. 在正文中明确提及 Skill 名称，或用 `Agent` 工具明确调用 Agent。

4. 让 Skill 和 Agent 自己负责专业领域内的细节，Command 只负责入口和输出结构。

当你把这套模式跑通后，Claude Code 就会从一个"听话的助手"变成一个"有组织的工程团队"：你喊一声 `/frontend-code-review`，它就自动派出前端专家去审查；你喊一声 `/full-frontend-review`，它就能协调质量、安全、性能三位专家出具综合报告。
