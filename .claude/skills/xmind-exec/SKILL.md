---
name: xmind-exec
description: 使用此 skill 当用户希望将 XMind 思维导图导出为 Markdown 后自动解析为结构化任务，并按审核模式逐条生成方案、人工确认、执行代码。触发场景包括 "/xmind-exec"、"XMind 执行"、"思维导图转任务"、"XMind 生成代码"。也适用于需要从 XMind 导出物中提取任务清单并按依赖顺序执行的场景。不适用于非 XMind 来源的任务管理或直接代码生成（无 XMind 输入）。
license: Complete terms in LICENSE.txt
---

# XMind 自动化执行 - 审核模式

## Overview

本 skill 解析 XMind 导出的 Markdown 文件，将其转换为结构化任务清单，并采用"方案生成 → 人工审核 → 代码执行"的模式逐个完成任务。所有中间产物保存到 `.claude/runs/run-{timestamp}/` 目录，确保过程可追溯、可干预、可复现。

核心工作方式：

- 使用确定性脚本优先解析 XMind Markdown，快速生成任务清单。
- 每个任务生成独立执行方案，用户确认后再写入代码。
- 支持任务依赖推断、风险等级评估、质量门禁检查。

## When to use this skill

- 用户输入 `/xmind-exec <file_path>` 命令。
- 用户提供 XMind 导出的 Markdown 文件，希望自动转任务并执行。
- 用户希望按模块/依赖顺序逐步完成思维导图中的开发任务。
- 用户需要任务执行过程持久化、可审核、可中断恢复。

不适用场景：

- 没有 XMind Markdown 文件，直接要求生成代码。
- 任务来源是其他工具（如 Notion、飞书文档）。
- 仅需生成文档或计划而不执行代码。

## Inputs

- `file_path`：XMind 导出的 Markdown 文件路径（必填）。
- 用户确认：每个任务的方案需经用户确认后才执行。
- 可选指令：在工作流看板中可输入 `T001`、`status`、`report`、`exit` 等指令。

## Workflow

1. **参数校验**：检查 `file_path` 是否存在，是否为 Markdown 文件。
2. **初始化运行目录**：在 `.claude/runs/run-{timestamp}/` 创建独立目录。
3. **解析 XMind Markdown**：调用确定性脚本生成 `task-manifest.json`、`execution-plan.md`、`task-definition.md` 等产物。
4. **展示任务看板**：列出任务状态、依赖、风险等级和可用指令。
5. **选择任务**：用户输入任务编号（如 `T001`）进入方案生成阶段。
6. **生成方案**：读取 `reference/xmind-format-guide.md` 和 `reference/best-practices.md`，为当前任务生成详细 `scheme.md`。
7. **人工审核**：用户选择确认执行、修改方案、跳过或终止。
8. **执行代码**：按方案生成或修改代码，执行质量检查。
9. **保存结果**：更新任务状态，记录变更文件和执行结果。
10. **循环或交付**：重复步骤 5-9 直到所有任务完成，生成 `final-report.md`。

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/xmind-format-guide.md` | 解析 XMind Markdown 前加载，了解编写规范和任务要素格式 |
| `reference/workflow-detail.md` | 需要了解完整执行流程、运行时文件结构和看板指令时加载 |
| `reference/best-practices.md` | 生成任务方案或执行代码前加载，了解任务粒度和依赖标注规范 |
| `templates/scheme-template.md` | 为每个任务生成方案时作为结构模板 |
| `examples/xmind-sample.md` | 需要参考标准 XMind Markdown 格式时加载 |
| `examples/runtime-structure.md` | 需要了解运行目录产物结构时加载 |

## Output format

最终产物包括：

1. `.claude/runs/run-{timestamp}/run-info.json`：运行基本信息。
2. `.claude/runs/run-{timestamp}/task-manifest.json`：结构化任务清单。
3. `.claude/runs/run-{timestamp}/execution-plan.md`：人类可读执行计划。
4. `.claude/runs/run-{timestamp}/tasks/T{nnn}/scheme.md`：任务执行方案。
5. `.claude/runs/run-{timestamp}/tasks/T{nnn}/execution-result.md`：任务执行结果。
6. `.claude/runs/run-{timestamp}/tasks/T{nnn}/changed-files.json`：变更文件清单。
7. `.claude/runs/run-{timestamp}/final-report.md`：最终交付报告。
8. 实际代码变更：按任务方案写入的项目文件。

## Validation

- [ ] `task-manifest.json` 是否包含至少一个有效任务。
- [ ] 每个任务是否提取到目标描述、上下文、质量标准等关键要素。
- [ ] 任务依赖关系是否合理，不存在循环依赖。
- [ ] 每个任务方案是否经过用户确认后再执行。
- [ ] 代码生成后是否通过 lint 和 TypeScript 类型检查（或对应质量门禁）。
- [ ] 所有中间产物是否保存到运行目录。

## Constraints

- 必须基于 XMind 导出的 Markdown 文件启动，不能凭空构造任务。
- 每个任务执行前必须获得用户明确确认，禁止自动跳过审核。
- 解析失败时必须向用户说明原因，不得隐藏错误继续执行。
- 任务方案应优先使用对应技术栈的 Agent 或 skill 执行（如前端任务使用 `frontend-developer`）。
- 运行目录中的中间文件不得删除用户已有代码或覆盖未确认变更。
