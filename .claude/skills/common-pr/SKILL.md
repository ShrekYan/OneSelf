---
name: common-pr
description: Use this skill when the user wants to generate Pull Request descriptions. Triggers include "PR 描述", "生成 PR", "PR 模板", "创建 PR". Also use when summarizing code changes for review. Do NOT use for commit message generation (use common-commit skill instead).
license: Complete terms in LICENSE.txt
---

# PR 描述生成规范

## Overview

本 skill 用于生成符合项目规范的 Pull Request 描述。核心目标是帮助开发者快速创建结构化、清晰的 PR 内容，便于代码审阅者理解改动意图和范围。所有类型、格式和命名都遵循项目已有的 [Git Commit 规范](../common-commit/SKILL.md)，保持一致性。

## When to use this skill

- 用户需要生成或完善 PR 描述时
- 用户询问 PR 格式规范时
- 用户需要总结代码改动并创建结构化 PR 时
- 用户需要拆分多个 commit 并按类型分组时

**不适用场景**：
- 需要生成单个 commit 信息时（应使用 `common-commit` skill）

## Inputs

- 当前分支名（自动获取）
- 未合并到主分支的 commit 列表（自动获取）
- 用户可能提供的额外上下文或说明

## Workflow

### 第一步：获取信息

1. `git branch --show-current` → 获取当前分支名
2. `git log main..HEAD --oneline` → 获取所有未合并到 main 的 commit

### 第二步：边界检查

- 如果当前分支是 `main` → 警告：建议在特性分支开发，然后提 PR
- 如果没有未合并 commit → 提示：没有未合并的改动，请先提交代码

### 第三步：分类整理

- 解析每个 commit 的 type，按照 type 分组，统计各类型数量。
- 所有 type 定义完全来自 commit.md。

### 第四步：生成 PR

1. **标题**: 取数量最多的 type → 生成 `type(scope): description` 格式
2. **摘要**: 一句话综合描述本次 PR
3. **改动清单**: 按类型分组列出所有 commit
4. **检查清单**: 填入标准检查项
5. **关联 Issue**: 留占位符让用户填写

### 第五步：交付结果

1. 先展示**完整可复制的 PR 内容**，用代码块包裹
2. 告诉用户可以直接复制粘贴到 GitHub/GitLab
3. 如果有多个主类型选择困难，询问用户确认
4. 如果检测到破坏性变更，提示用户补充说明

## Resources

| 资源 | 何时使用 |
|------|----------|
| `templates/pr-template.md` | 生成 PR 正文时，作为可复制模板 |
| `reference/specification.md` | 需要了解格式规范、类型优先级、破坏性变更处理时 |

## Validation

- [ ] PR 标题符合 `<type>(<scope>): <简短描述>` 格式
- [ ] 摘要清晰描述本次 PR 的目的和主要改动
- [ ] 改动清单按类型分组列出所有 commit
- [ ] 检查清单包含所有标准检查项
- [ ] 如包含破坏性变更，已添加 `BREAKING CHANGE` 段落

## Constraints

- 严格遵循 commit.md 的 type/scope 规范，保持一致
- 描述和正文都使用中文
- 必须按类型分组列出改动，便于审阅
- 必须包含检查清单