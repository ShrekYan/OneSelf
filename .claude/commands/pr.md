---
name: pr
description: PR 描述生成，自动分析分支 commit 生成符合规范的 Pull Request 描述
---

# PR Description Command

## 分类定位

面向 Pull Request 增强的 command，聚焦于自动生成符合项目规范的 PR 描述，包括标题、改动清单、检查清单。

## Context

用户需要生成 Pull Request 描述，自动分析当前分支的 commit 历史，生成结构化的 PR 内容。

## Requirements

$ARGUMENTS

## Instructions

### 1. 调用 common-pr Skill 生成 PR 描述

当用户输入符合 PR 生成场景（如"生成 PR 描述"、"PR 模板"、"创建 PR"、"/pr" 等）时，**使用 `Skill` 工具调用 `common-pr` skill**，并将用户的完整 PR 生成需求作为 `args` 参数传递。

| 参数 | 值 |
|------|----|
| `skill` | `common-pr` |
| `args` | 用户的完整 PR 生成需求描述，包含目标分支、PR 类型偏好、特殊关注点等 |

`common-pr` skill 将按以下流程执行：

1. **分支与 Commit 分析**：运行 `git branch --show-current` 和 `git log main..HEAD --oneline`，识别当前分支及未合并 commit。
2. **约束检查**：如果当前分支是 main，提示用户切换到特性分支；如果没有未合并 commit，提示用户先提交改动。
3. **Commit 分类整理**：按 Conventional Commits 类型分类，提取主类型作为 PR 标题前缀。
4. **PR 内容生成**：生成符合项目规范的 PR 标题、改动清单、检查清单和风险评估。
5. **结果展示**：展示生成结果供用户预览、复制或进一步调整。

> 详细规范与能力说明见 `.claude/skills/common-pr/SKILL.md`，其中包含报告模板和校验清单。此处不再重复展开，由 `common-pr` skill 自行加载并执行。

### 2. Scope and Current State Analysis
- 识别当前分支、commit 历史和改动范围
- 总结当前实现和约束条件
- 检测风险区域和未知问题

### 3. Quality or Change Strategy
- 定义 PR 类型和严重级别
- 定义审查维度：正确性、完整性、可维护性、测试覆盖

### 4. Implementation or Recommendation
- 生成符合 Conventional Commits 规范的标题
- 提供具体的改动清单和风险评估
- 区分必须修复、应该修复和可选改进

### 5. Verification
- 定义验证步骤
- 定义回归检查
- 包含质量和安全检查

## Output Format

Return:

- Executive Summary
- Scope
- Findings / Plan
- Risk Level
- Recommended Changes
- Verification Plan
- Next Steps