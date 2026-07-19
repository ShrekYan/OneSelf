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

### 1. Scope and Current State Analysis
- 识别当前分支、commit 历史和改动范围
- 总结当前实现和约束条件
- 检测风险区域和未知问题

### 2. Quality or Change Strategy
- 定义 PR 类型和严重级别
- 定义审查维度：正确性、完整性、可维护性、测试覆盖

### 3. Implementation or Recommendation
- 生成符合 Conventional Commits 规范的标题
- 提供具体的改动清单和风险评估
- 区分必须修复、应该修复和可选改进

### 4. Verification
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

请调用 Skill 工具执行 `common-pr`，并将用户参数原样传入。规范入口：[common-pr Skill](../skills/common-pr/SKILL.md)