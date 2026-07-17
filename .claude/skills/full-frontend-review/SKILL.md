---
name: full-frontend-review
description: 当用户需要一键触发完整前端代码审查时使用此技能，自动顺序执行代码质量、安全漏洞、性能优化三个维度检查。触发场景包括“完整前端审查”、“前端代码质量+安全+性能检查”、“一键前端 review”等。不用于单一维度检查或后端代码审查。
license: Complete terms in LICENSE.txt
---

# full-frontend-review

## Overview

本 skill 是一个前端代码审查编排器。用户只需触发一次，系统会按固定顺序调用三个专业 Agent，分别完成代码质量审查、安全漏洞扫描和性能优化分析，最后整合为一份综合审查报告。

三个专业 Agent 复用各自现有的检查清单，避免重复整合：

- 代码质量审查 → `frontend-code-reviewer`
- 安全漏洞扫描 → `frontend-security-auditor`
- 性能优化分析 → `frontend-performance-expert`

## When to use this skill

- 用户需要一次性完成前端全维度审查。
- 用户提到“完整前端审查”、“前端代码质量+安全+性能检查”、“一键前端 review”等关键词。
- 用户希望获得整合后的综合报告，而不是分别运行三个 Agent。

不适用场景：

- 只需要单一维度检查（质量 / 安全 / 性能），应直接使用对应 Agent 或 skill。
- 后端代码审查，应使用 `nestjs-code-review` 等后端 skill。

## Inputs

- **检查范围**：待检查的文件或目录路径，多个路径用空格分隔。未指定时默认检查 `src/`。
- **选项**（可选）：
  - `--continue-on-error`：即使发现严重问题也继续完成全部检查。
  - `--only-issues`：只输出发现的问题，省略无问题部分描述。

## Workflow

执行流程详见 [`reference/workflow.md`](reference/workflow.md)。

## Resources

| 资源 | 用途 |
|------|------|
| [`reference/workflow.md`](reference/workflow.md) | 详细执行流程、错误处理与并发策略 |
| [`reference/agent-orchestration.md`](reference/agent-orchestration.md) | 三个 Agent 的职责、清单引用与输入传递 |
| [`reference/report-template.md`](reference/report-template.md) | 综合报告结构、优先级定义与输出要求 |
| [`examples/`](examples/) | 典型使用场景示例 |
| [`templates/comprehensive-report.md`](templates/comprehensive-report.md) | 可复制的综合报告模板 |

## Output format

最终交付一份整合后的综合审查报告，结构定义详见 [`reference/report-template.md`](reference/report-template.md)，可复制模板见 [`templates/comprehensive-report.md`](templates/comprehensive-report.md)。

## Validation

- [ ] 是否按顺序完成了三个维度检查。
- [ ] 是否整合了三个 Agent 的发现，而非简单拼接。
- [ ] 问题优先级是否统一并清晰标注。
- [ ] 是否提供了可执行的修复建议。
- [ ] 输出是否符合用户指定的 `--only-issues` 等选项。

## Constraints

- 必须使用 Agent 工具顺序调用三个专业 Agent，不得自行替代执行审查。
- 三个 Agent 分别使用各自的检查清单，不在本 skill 中重复定义检查规则。
- 默认在单窗口内顺序执行；如需真并发，需要用户手动开启多个窗口。
- 不得修改被审查的源代码，只输出审查报告和建议。
