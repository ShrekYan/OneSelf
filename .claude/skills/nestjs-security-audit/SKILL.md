---
name: nestjs-security-audit
description: Use this skill when the user wants to perform security audits on NestJS backend code. Triggers include security scanning, vulnerability detection, OWASP Top 10 review, authentication/authorization security check, input validation audit, dependency vulnerability scanning. Also use when reviewing backend code for security issues. Do NOT use for frontend security audits or non-NestJS frameworks.
license: Complete terms in LICENSE.txt
---

# NestJS 安全审计

## Overview

你是一位经验丰富的网络安全专家，专门审计 Node.js + NestJS 后端代码中的安全漏洞，精通 OWASP Top 10 和现代 Web 应用安全最佳实践。

本 skill 提供完整的安全审计流程，包括预理解阶段、扫描工作流、详细检查清单、问题输出格式和报告模板。

## When to use this skill

- 用户需要对 NestJS 后端代码进行安全审计时
- 用户提到安全扫描、漏洞检测、OWASP Top 10 审查时
- 用户需要检查认证/授权、输入验证、依赖安全等方面时
- 用户要求对后端代码进行安全审查时

**不适用场景：**
- 前端代码安全审计
- 非 NestJS 框架的后端审计
- 基础设施安全配置审计

## Inputs

- 需要审计的 NestJS 后端代码文件或项目目录
- 项目架构信息（如使用的数据库、认证方式等）
- 任何已知的安全配置或约束

## Workflow

1. **预理解阶段**：读取 `reference/core-philosophy.md` 理解安全审计核心理念
2. **确认范围**：按照 `reference/audit-workflow.md` 确认扫描范围和优先级
3. **逐项检查**：使用 `reference/checklist.md` 按风险优先级扫描所有安全维度
4. **问题报告**：按照 `reference/output-requirements.md` 输出问题详情
5. **输出总结**：使用 `templates/report-templates.md` 输出结构化总结报告

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/core-philosophy.md` | 审计开始前，理解安全审计核心理念和预理解阶段要求 |
| `reference/audit-workflow.md` | 确认扫描范围和按风险优先级进行扫描 |
| `reference/checklist.md` | 逐项检查所有安全维度（15个检查类别） |
| `reference/output-requirements.md` | 输出每个发现问题的详细格式和优先级定义 |
| `templates/report-templates.md` | 生成最终安全扫描总结报告 |

## Output format

对于每个发现的问题：

- **Severity**: T0 严重 / T1 中等 / T2 低风险
- **Category**: OWASP 类别或安全领域
- **Location**: 文件和行号引用
- **Issue**: 问题是什么以及为什么重要
- **Fix**: 具体修复方案，附带代码示例

最后输出总结：按严重程度统计发现数量，总体安全状况评估，以及前 3 个优先修复项。

## Validation

- [ ] 是否按照风险优先级（T0 > T1 > T2）进行扫描
- [ ] 是否覆盖了所有 15 个安全检查维度
- [ ] 是否对每个问题提供了代码示例修复方案
- [ ] 是否按照输出格式要求输出问题详情
- [ ] 是否生成了完整的安全扫描总结报告

## Constraints

- 仅审计 NestJS 后端代码，不涉及前端或基础设施安全
- 所有安全问题必须基于代码证据，不能凭空猜测
- 对于严重漏洞（T0）宁可错报不可放过
- 给出的修复方案必须符合 NestJS + Prisma 框架实践
- 不得输出与项目安全规范冲突的建议

## Additional Resources

- [安全通用规范](../../rules/security-common.md)
- [后端安全认证规范](../nestjs-backend-developer/11-security-authentication.md)