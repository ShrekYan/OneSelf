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
