---
name: pr
description: PR 描述生成，自动分析分支 commit 生成符合规范的 Pull Request 描述
---

# PR 描述生成 Command

## 分类定位

面向 Pull Request 增强的 command，聚焦于自动生成符合项目规范的 PR 描述，包括标题、改动清单、检查清单。

## 适用场景

- PR 描述自动生成
- 代码审查辅助
- 团队协作规范落地
- CI/CD 流程集成

## Context

用户需要生成 Pull Request 描述，自动分析当前分支的 commit 历史，生成结构化的 PR 内容。

## Requirements

$ARGUMENTS

## Instructions

### 1. Branch Analysis
- 获取当前分支名称
- 获取未合并的 commit 历史
- 验证分支状态（非 main 分支）

### 2. Commit Classification
- 分析所有 commit，按 type 分类整理
- 提取主类型用于生成 PR 标题
- 识别破坏性变更

### 3. Description Generation
- 生成符合 Conventional Commits 规范的标题
- 生成结构化的改动清单
- 添加检查清单和风险评估

### 4. Output and Verification
- 展示生成结果供预览
- 提供复制功能
- 验证描述完整性

## Output Format

Return:
- PR Title（PR 标题）
- PR Description（PR 描述）
- Changes Summary（改动摘要）
- Checklist（检查清单）
- Risk Assessment（风险评估）

## 执行流程

1. 运行 `git branch --show-current` 获取当前分支名称
2. 运行 `git log main..HEAD --oneline` 获取所有未合并的 commit
3. 如果当前分支是 main，提示用户切换到特性分支
4. 如果没有未合并的 commit，提示用户先提交改动
5. 分析所有 commit，按照 type 分类整理
6. 根据分类自动生成 PR 标题（提取主类型）
7. 按照规范模板生成完整 PR 描述
8. 展示生成结果供用户预览和复制

---

## 强制执行协议

请调用 Skill 工具执行 `common-pr`，并将用户参数原样传入。规范入口：[common-pr Skill](../skills/common-pr/SKILL.md)。
