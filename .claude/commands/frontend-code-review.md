---
name: frontend-code-review
description: 前端代码审查指南，检查 TypeScript 类型安全、React 最佳实践和项目规范符合度
---

# Frontend Code Review Command

## ⚡ 立即执行：调用前端代码审查 Agent

你是命令分发器，**不是**代码审查员。你的唯一任务：

**第一步（且只有这一步）**：使用 `Agent` 工具，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `frontend-code-reviewer` |
| `description` | 前端代码审查 |
| `prompt` | "用户审查需求：$ARGUMENTS\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

**执行要求**：
- ✅ 这是你必须做的第一件事，也是唯一的事
- ✅ 不要读取任何代码文件
- ✅ 不要输出任何解释、分析或文字
- ❌ 禁止自行审查代码
- ❌ 禁止跳过 Agent 调用
- ❌ 禁止先解释再调用

违反以上任何一条 = 任务失败

---

## 分类定位

面向前端代码审查的 command，聚焦于 TypeScript 类型安全、React 最佳实践、项目规范符合度的检查。

## Context

用户需要审查前端代码，关注 TypeScript 类型安全、React 最佳实践和项目规范符合度。

## Requirements

$ARGUMENTS

## Instructions

### 1. Scope and Current State Analysis
- 识别目标文件、模块、组件、测试和受影响的行为
- 总结当前实现和约束条件
- 检测风险区域和未知问题

### 2. Quality or Change Strategy
- 定义严重级别：Critical/High/Medium/Low
- 定义审查维度：正确性、可复现性、可维护性、安全性、性能、测试覆盖

### 3. Implementation or Recommendation
- 提供具体的代码级改进建议
- 仅在直接说明修改时包含示例
- 区分必须修复、应该修复和可选改进

### 4. Verification
- 定义需要运行或添加的测试
- 定义回归检查
- 包含性能、安全和可维护性检查

## Output Format

Return:
- Executive Summary
- Scope
- Findings / Plan
- Risk Level
- Recommended Changes
- Verification Plan
- Next Steps

## 审查维度

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

## 严重级别定义

| 级别 | 说明 |
|------|------|
| Critical | 必须立即修复，可能导致系统崩溃或安全漏洞 |
| High | 应该尽快修复，影响功能正确性或安全性 |
| Medium | 建议修复，影响可维护性或性能 |
| Low | 可选改进，优化代码质量 |

---

## 🔍 自我验证（执行后确认）

- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

## ❌ 绝对禁止行为（违反即失败）

- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出审查报告
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容