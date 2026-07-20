# Claude Code Command 调用 Skill 指南

> 本笔记总结 `.claude/commands/` 下的自定义命令如何调用 `.claude/skills/` 下的技能包，用于学习归档。
>
> 来源：Claude Code 官方文档（command-development / plugin-features-reference）。

---

## 1. 核心概念

| 概念                | 目录                                   | 作用                                          |
| ------------------- | -------------------------------------- | --------------------------------------------- |
| **Command（命令）** | `.claude/commands/*.md`                | 用户通过 `/command-name` 触发的 prompt 模板。 |
| **Skill（技能）**   | `.claude/skills/<skill-name>/SKILL.md` | 封装特定领域知识、流程和输出规范的技能包。    |

关系：**Command 是入口，Skill 是执行逻辑**。Command 负责接收用户输入，Skill 负责完成具体任务。

---

## 2. Command 文件格式

`.claude/commands/todo-scan.md`：

````markdown
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

## 3. Skill 文件格式

`.claude/skills/common-todo-scan/SKILL.md`：

```markdown
---
name: common-todo-scan
description: 当用户需要扫描代码库中的 TODO/FIXME 注释时使用此技能。
---

# TODO 扫描

## Overview

本 skill 用于扫描项目中的 TODO/FIXME/HACK/XXX/BUG 等注释标记，生成结构化的扫描报告。

## When to use this skill

典型触发场景：

- 用户要求扫描代码中的 TODO/FIXME 标记
- 用户要求查找项目中的待办事项

## Workflow

1. 确认扫描范围
2. 执行搜索
3. 生成报告

## Output format

输出结构化的 TODO/FIXME 扫描报告...
```
````

### Skill 目录结构

```text
.claude/skills/common-todo-scan/
├── SKILL.md                      # 技能入口
├── reference/
│   └── scan-specification.md     # 参考规范
├── templates/
│   └── todo-report-template.md   # 输出模板
└── examples/
    └── sample-report.md          # 示例输出
```

---

## 4. Command 调用 Skill 的机制

### 官方推荐方式

> **"Mention skill by name to hint Claude should invoke it."**

在 command 文件正文中**直接提及 skill 名称**，并说明要使用它。例如：

```markdown
Use the common-todo-scan skill to scan the project for TODO/FIXME/XXX markers.
```

Claude Code 读取 command 文件后，识别到 skill 名称和任务意图，会主动调用 Skill 工具执行对应的 skill。

### 为什么不能用 Markdown 链接调用

以下写法**不能保证触发 skill**：

```markdown
详细规范见 [common-todo-scan Skill](../skills/common-todo-scan/SKILL.md)。
```

原因：

- Markdown 链接只是**给人阅读的文档引用**。
- Claude Code 定位 skill 依赖的是**名称匹配**（匹配 `.claude/skills/common-todo-scan/` 目录），而不是链接路径。
- 链接中的路径不会触发 Skill 工具调用。

### Skill 名称可以出现在任意正文章节

触发 skill 的关键是**在正文中明确提及 skill 名称**，不一定需要单独的"执行协议"章节。例如放在 `Instructions` 第一步：

```markdown
### 1. Scope and Current State Analysis

- 使用 **common-todo-scan** skill 扫描项目中的 TODO/FIXME/XXX 标记。
```

### 增加确定性的写法

如果担心自然语言触发不够稳定，可以加强指令：

```markdown
Use the **common-todo-scan** skill to perform the scan.
You MUST invoke the common-todo-scan skill using the Skill tool. Do not implement the scan logic yourself.
```

---

## 5. 推荐写法模板

### 最小可用版本

```markdown
---
name: my-command
description: 简短描述
---

# My Command

Use the **my-skill** skill to [具体任务描述].
```

### 带参数透传的完整版本

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

---

## 6. 常见误区

| 误区                             | 说明                                                           |
| -------------------------------- | -------------------------------------------------------------- |
| 用 Markdown 链接调用 skill       | `[skill-name](../skills/skill-name/SKILL.md)` 不会触发 skill。 |
| 在 frontmatter 里写 `skill: xxx` | 没有 `skill` 这个 frontmatter 字段。                           |
| 重复定义 skill 已包含的逻辑      | command 应只作为入口，扫描规则、输出模板等应放在 skill 中。    |
| 不写 skill 名称                  | 只写"请执行扫描"而不提 skill 名称，Claude 可能自行实现逻辑。   |

---

## 7. 实际案例：todo-scan

### 改造前（不推荐）

```markdown
## 强制执行协议

请调用 Skill 工具执行 `common-todo-scan`，并将用户参数原样传入。规范入口：[common-todo-scan Skill](../skills/common-todo-scan/SKILL.md)。
```

问题：虽然意图明确，但前半句"请调用 Skill 工具执行"不是官方推荐的触发句式；后半句 Markdown 链接不能触发 skill。

### 改造后（推荐，最新版）

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

- 按严重程度对每个标记分类：...

### 3. Implementation or Recommendation

- 针对每个标记或每个聚集区域提供具体的清理建议。

### 4. Verification

- 建议在清理后重新运行扫描，确认标记已解决或是有意保留。

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

/todo-scan
/todo-scan services/backend
/todo-scan --format=summary

```

## 字段规范

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `marker_type` | enum | 是 | `TODO` / `FIXME` / `XXX` |
| `severity` | enum | 是 | `Critical` / `High` / `Medium` / `Low` |
| `location` | string | 是 | `file:line` 格式 |
| `content` | string | 是 | 注释中的原始内容 |
| `recommendation` | string | 是 | 修复或后续处理建议 |

参考文档：[common-todo-scan Skill](../skills/common-todo-scan/SKILL.md)。
```

变化点：

- 使用结构化角色设定（`你是一名...专家`）和分步骤 Instructions。
- Skill 触发点放在 `Instructions` 第 1 步：`使用 **common-todo-scan** skill 扫描...`。
- 增加 Output Format、字段规范等执行细节。

---

## 8. 验证方法

1. 在 Claude Code 中输入 `/todo-scan`。
2. 观察 Claude 是否调用了 `common-todo-scan` skill（通常会显示 Skill 工具调用）。
3. 如果未触发，检查 command 文件中是否明确提及了 skill 名称。
4. 如仍不触发，可加强指令为：

```markdown
You MUST invoke the common-todo-scan skill using the Skill tool.
```

---

## 9. 参考资料

- [Claude Code Command Development Skill](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/command-development/SKILL.md)
- [Plugin Features Reference](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/command-development/references/plugin-features-reference.md)
- [Plugin Commands Examples](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/command-development/examples/plugin-commands.md)
