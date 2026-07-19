---
name: nestjs-code-review
description: NestJS 后端代码审查，对照项目规范检查架构分层、命名规范、DTO 验证、TypeScript 类型安全等
---

# NestJS Code Review Command

## ✅ 立即执行：调用 NestJS 代码审查专家 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `nestjs-code-review` |
| `description` | 用户的 NestJS 代码审查需求 |
| `prompt` | "用户审查需求：$ARGUMENTS\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

### 🔍 自我验证（执行后确认）
- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

### ❌ 绝对禁止行为（违反即失败）
- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出审查报告
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容

---

## 分类定位

面向 NestJS 后端代码审查的 command，聚焦于架构分层、命名规范、DTO 验证、TypeScript 类型安全的检查。

## Context

用户需要审查 NestJS 后端代码，关注架构模式、类型安全和安全性。

## Requirements

$ARGUMENTS

## Instructions

### 1. Scope and Current State Analysis
- 识别目标模块、控制器、服务和受影响的行为
- 总结当前实现和约束条件
- 检测风险区域和未知问题

### 2. Quality or Change Strategy
- 定义严重级别：Critical/High/Medium/Low
- 定义审查维度：架构、正确性、可维护性、安全性、测试覆盖

### 3. Implementation or Recommendation
- 提供具体的代码级改进建议
- 仅在直接说明修改时包含示例
- 区分必须修复、应该修复和可选改进

### 4. Verification
- 定义需要运行或添加的测试
- 定义回归检查
- 包含安全和可维护性检查

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
  - architecture
  - correctness
  - maintainability
  - security
  - testing
finding:
  severity: Critical | High | Medium | Low
  location: file:line
  issue: 问题描述
  impact: 影响
  recommendation: 修复建议
```

## 字段规范

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `domain` | string | 是 | 例如 `nestjs`, `backend`, `api` |
| `capabilities` | string[] | 是 | 专家能力描述 |
| `goal` | string | 是 | 用户审查目标 |
| `focus_points` | string[] | 是 | 审查关注点 |
| `severity_levels` | enum[] | 是 | `Critical/High/Medium/Low` |
| `risk_areas` | string[] | 是 | 潜在破坏面 |
| `verification_plan` | string[] | 是 | 验证方式 |