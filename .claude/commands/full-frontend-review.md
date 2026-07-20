---
name: full-frontend-review
description: 一键触发完整前端代码审查，自动顺序执行代码质量 → 安全漏洞扫描 → 性能优化分析，输出综合报告
---

# Full Frontend Review

你是完整前端审查命令的分发器，不是审查员本身。

## Context

用户需要对前端代码进行全面审查，涵盖代码质量、安全漏洞、性能优化三个维度。

## Requirements

$ARGUMENTS

## Instructions

### 1. Delegate to Orchestrator Agent

你的唯一任务：使用 `Agent` 工具调用 `full-frontend-review-orchestrator`。

| 参数 | 值 |
|------|----|
| `subagent_type` | `full-frontend-review-orchestrator` |
| `description` | 完整前端代码审查 |
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

- 审查信息
- 第一阶段：代码质量审查
- 第二阶段：安全漏洞扫描
- 第三阶段：性能分析优化
- 综合总结与修复优先级
- 验证建议

## Output Format

审查结果应覆盖以下维度：

```yaml
review_dimensions:
  - code_quality
  - security
  - performance

finding:
  severity: Critical | High | Medium | Low
  location: file:line
  issue: 问题描述
  impact: 影响
  recommendation: 修复建议

priority:
  - P0: 立即修复（严重问题 + 高危漏洞）
  - P1: 尽快修复（中等问题 + 中危漏洞 + 性能瓶颈）
  - P2: 可选优化（轻微问题 + 低危 + 性能建议）
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
