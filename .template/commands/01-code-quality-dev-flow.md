# 01. 代码质量与开发流程 Command 模板

## 分类定位

面向代码理解、代码审查、迁移、重构、技术债务、PR 增强、Issue 处理与 TDD 流程的 command。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `ai-review.md` | AI/ML Code Review | AI/ML 代码审查报告、严重级别建议 |
| `code-explain.md` | Code Explanation and Analysis | 分层解释、流程图、示例、学习路径 |
| `code-migrate.md` | Code Migration Assistant | 迁移评估、迁移计划、回滚方案 |
| `refactor-clean.md` | Refactor and Clean Code | 重构策略、前后对比、质量清单 |
| `tech-debt.md` | Technical Debt Analysis and Remediation | 技术债清单、优先级、治理路线图 |
| `pr-enhance.md` | Pull Request Enhancement | PR 描述、Review Checklist、风险评估 |
| `issue.md` | PLAN | Issue 分析与实施计划 |
| `tdd-red.md` | TDD Red | 失败测试设计 |
| `tdd-green.md` | TDD Green | 最小实现 |
| `tdd-refactor.md` | TDD Refactor | 安全重构 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {Command Title}

You are a {domain} expert specializing in {capabilities}.

## Context
The user needs to {goal}. Focus on {focus_points}.

## Requirements
$ARGUMENTS

## Instructions

### 1. Scope and Current State Analysis
- Identify target files, modules, functions, tests, and affected behavior.
- Summarize current implementation and constraints.
- Detect risk areas and unknowns.

### 2. Quality or Change Strategy
- For review: define severity levels and review dimensions.
- For migration: define source state, target state, compatibility gaps, and rollback.
- For refactor: define safe transformation boundaries and behavior preservation.
- For TDD: define current phase, expected failing/passing/refactored state.

### 3. Implementation or Recommendation
- Provide concrete code-level recommendations.
- Include examples only when they directly clarify the change.
- Separate must-fix, should-fix, and optional improvements.

### 4. Verification
- Define tests to run or add.
- Define regression checks.
- Include performance, security, and maintainability checks if relevant.

### 5. Output Format
Return:
- Executive Summary
- Scope
- Findings / Plan
- Risk Level
- Recommended Changes
- Verification Plan
- Next Steps
```

## 字段规范

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `domain` | string | 是 | 例如 `code review`、`migration`、`refactoring`、`TDD` |
| `capabilities` | string[] | 是 | 专家能力描述 |
| `goal` | string | 是 | 用户目标 |
| `focus_points` | string[] | 是 | 本命令关注点 |
| `severity_levels` | enum[] | 审查类必填 | `Critical/High/Medium/Low` |
| `risk_areas` | string[] | 是 | 潜在破坏面 |
| `verification_plan` | string[] | 是 | 验证方式 |

## 子类型模板

### A. Code Review 子模板

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

### B. Migration 子模板

```yaml
migration:
  source_stack: 当前技术栈
  target_stack: 目标技术栈
  compatibility_gaps: []
  migration_steps: []
  rollback_plan: []
  verification: []
```

### C. TDD 子模板

```yaml
tdd:
  phase: red | green | refactor
  target_behavior: 目标行为
  test_status: failing | passing | unchanged
  minimal_change: 最小变更说明
  regression_checks: []
```
