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

| 参数 | 值 |
|------|----|
| `subagent_type` | `frontend-code-reviewer` |
| `description` | 前端代码审查 |
| `prompt` | "用户审查需求：$ARGUMENTS\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

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

- Executive Summary
- Scope
- Findings / Plan
- Risk Level
- Recommended Changes
- Verification Plan
- Next Steps

## Output Format

审查结果应覆盖以下维度：

```yaml
review_dimensions:
  - correctness
  - reproducibility
  - maintainability
  - security
  - performance
  - testing

finding:
  severity: Critical | High | Medium | Low
  location: file:line
  issue: 问题描述
  impact: 影响
  recommendation: 修复建议
```

## Severity Levels

| 级别 | 说明 |
|------|------|
| Critical | 必须立即修复，可能导致系统崩溃或安全漏洞 |
| High | 应该尽快修复，影响功能正确性或安全性 |
| Medium | 建议修复，影响可维护性或性能 |
| Low | 可选改进，优化代码质量 |

## Self Verification

- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

## Forbidden Behaviors

- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出审查报告
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容
