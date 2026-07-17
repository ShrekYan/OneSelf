---
name: pre-commit-check
description: Use this skill when the user wants to run a complete pre-commit check before submitting code. Triggers include "pre-commit", "提交前检查", "代码检查", "lint检查", "构建检查". Also use when the user needs to verify front-end and back-end code quality before git commit. Do NOT use for individual lint commands or isolated build tasks.
license: Complete terms in LICENSE.txt
---

# pre-commit-check

## Overview

提交代码前一键运行完整检查，自动顺序执行所有本地检查命令，替代手动逐条输入。适用于在 git commit 前进行全面的代码质量验证，确保前端和后端代码符合项目规范。

## When to use this skill

使用场景：
- 用户请求运行预提交代码检查
- 用户需要验证前端和后端代码质量
- 改了后端服务或大功能后需要完整检查

不适用场景：
- 仅需要运行单独的 lint 命令
- 仅需要运行单独的构建任务
- 不需要检查后端变更的场景

## Inputs

- 无需额外输入，自动检测项目结构和变更

## Workflow

1. **开始检查**：输出检查开始提示
2. **前端 ESLint 检查**：执行 `npm run lint` 检查代码风格
3. **前端 TypeScript 类型检查**：执行 `npx tsc --noEmit` 验证类型正确性
4. **后端变更检测**：检查是否有 `services/backend/`、`services/auth-service/` 或 `services/log-service/` 目录变更
5. **后端检查（条件执行）**：如果检测到后端变更，对发生变更的服务分别执行：
   - 后端 ESLint 检查 → `npm run lint`
   - 后端构建检查 → `npm run build`
6. **输出总结**：显示检查结果汇总，列出通过和失败的检查项

任何一步失败都会立即停止，提示用户修复问题后重试。

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/husky-comparison.md` | 用户询问与 Husky 的区别时加载 |
| `examples/output-samples.md` | 需要参考输出格式时加载 |

## Output format

检查报告结构：
1. 检查开始提示
2. 各检查步骤执行状态（通过/失败）
3. 如果有后端变更，显示后端检查详情
4. 总结：所有检查通过提示或失败步骤提示
5. 检查项汇总列表

## Validation

- [ ] 是否按顺序执行前端 ESLint、TypeScript 检查
- [ ] 是否正确检测后端服务目录变更
- [ ] 是否仅在后端变更时执行后端检查
- [ ] 是否在失败时立即停止并提示
- [ ] 是否输出清晰的检查结果汇总

## Constraints

- 自动顺序执行检查，用户无需手动干预
- 任何一步失败立即退出，不继续后续检查
- 智能检测后端变更，无变更时跳过后端检查节省时间
- 不修改现有 Husky 配置，与 Husky pre-commit 互补使用