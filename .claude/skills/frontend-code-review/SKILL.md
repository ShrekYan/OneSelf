---
name: frontend-code-review
description: Use this skill when the user wants to review frontend code quality, especially React 19 + TypeScript + MobX 6 projects. Triggers include "审查代码", "代码审查", "code review", "检查代码质量". Do NOT use for backend code review or non-frontend tasks.
license: Complete terms in LICENSE.txt
---

# 前端代码审查

## Overview

本 skill 用于审查前端 H5 代码质量，专注于 React 19、TypeScript、MobX 6 技术栈。遵循项目规范进行代码审查，聚焦核心问题，提供可操作的修复建议。

## When to use this skill

使用场景：
- 用户请求审查前端代码文件或目录
- 用户询问代码质量问题
- 需要按照项目规范检查代码

不适用场景：
- 后端代码审查
- 非前端技术栈项目
- 纯格式优化请求（如 `npm run lint`）

## Inputs

- 待审查的文件路径或目录
- 审查范围说明（可选）
- 特定关注点（可选）

## Workflow

1. **文件收集**：使用 Glob/Grep 列出用户指定的文件范围
2. **规范读取**：读取项目规范文件和本 skill 的审查清单
3. **逐项检查**：按照审查清单逐一检查代码
4. **问题记录**：记录问题位置、严重程度、影响和修复建议
5. **分类汇总**：按严重程度和类别分组输出
6. **交付结果**：使用标准输出模板生成审查报告

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/code-review-checklist.md` | 执行审查前加载，获取完整检查项和优先级 |
| `templates/report-template.md` | 生成审查报告时使用，确保输出格式一致 |
| `examples/review-examples.md` | 需要参考示例时加载，学习审查输出格式 |

**外部资源**：
- [Frontend TypeScript](../h5-frontend-developer/rules/frontend-typescript.md)
- [Frontend CSS/SCSS](../h5-frontend-developer/rules/frontend-css-scss.md)
- [Frontend API design](../h5-frontend-developer/rules/frontend-api-design.md)
- [Frontend hooks TS](../h5-frontend-developer/rules/frontend-hooks-ts.md)
- [Frontend hooks error handling](../h5-frontend-developer/rules/frontend-hooks-error-handling.md)
- [Frontend third-party libraries](../h5-frontend-developer/rules/frontend-third-party-libraries.md)
- [Naming conventions](../../rules/200-naming.md)

## Output Format

审查报告结构：
1. 审查范围 - 列出审查的文件列表
2. 核心发现 - 按严重程度统计问题数量
3. 详细分析 - 每个问题包含位置、影响和修复建议
4. 总体评价 - 代码质量整体评估
5. 修复优先级 - 建议的修复顺序
6. 验证提示 - 修复后的验证命令

## Validation

- [ ] 是否只审查用户指定的文件
- [ ] 是否基于项目规范给出审查意见
- [ ] 是否明确标记问题位置和严重程度
- [ ] 是否提供可操作的修复建议
- [ ] 是否避免纯格式优化建议（除非用户明确要求）

## Constraints

- 只审查用户明确指定的文件，不主动扫描任务范围以外的文件
- 所有审查意见必须基于项目已有的 `.claude/rules/` 规范，不引入个人随意标准
- 拒绝冗长赞美，直接陈述问题和解决方案
- 不建议执行 `npm run lint` 或 `eslint --fix` 等全项目命令
- 不涉及后端代码检查