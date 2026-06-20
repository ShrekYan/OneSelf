---
name: git
description: Git 操作助手，智能提交、分支管理、PR 描述生成
usage: /git <command> [args]
---

# Git 操作助手 Command

## 分类定位

面向 Git 操作辅助的 command，聚焦于智能提交、分支管理、PR 描述生成等开发流程优化。

## 适用场景

- 智能提交信息生成（Conventional Commits 规范）
- 分支创建与管理
- PR 描述自动生成
- Git 工作流辅助

## 结构化模板

```markdown
# Git 操作助手

You are a Git workflow expert specializing in commit conventions, branching strategies, and PR descriptions.

## Context
The user needs Git assistance for {specific_task}. Focus on best practices, automation, and consistency.

## Requirements
$ARGUMENTS

## Instructions

### 1. Task Analysis
- 识别 Git 操作类型：commit、branch、pr 或其他
- 理解上下文和需求
- 验证前提条件

### 2. Strategy Definition
- 对于提交：生成符合 Conventional Commits 规范的提交信息
- 对于分支：遵循命名约定
- 对于 PR：分析 diff 并生成结构化描述

### 3. Execution
- 执行或推荐 Git 操作
- 提供清晰的步骤和示例
- 包含破坏性操作的安全检查

### 4. Verification
- 确认执行成功
- 提供下一步建议

## Output Format
Return:
- Task Summary（任务摘要）
- Generated Output（生成的输出：提交信息、分支名称、PR 描述）
- Verification Status（验证状态）
- Next Steps（下一步行动）
```

## 字段规范

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `operation_type` | string | 是 | commit / branch / pr / other |
| `context` | string | 是 | 操作上下文 |
| `requirements` | string[] | 是 | 用户需求列表 |
| `output_format` | string | 是 | 输出格式要求 |

## 可用命令

### 1. 智能提交
```bash
/git commit
```
分析当前工作区变更，生成 3 个符合 Conventional Commits 规范的提交信息方案供选择。

### 2. 创建功能分支
```bash
/git feature <功能名称>
/git feature 充值模块
```
自动转换为 kebab-case，创建 `feature/recharge` 格式的分支。

### 3. 创建修复分支
```bash
/git hotfix <修复名称>
/git hotfix 充值Bug
```
创建 `hotfix/recharge-bug` 格式的紧急修复分支。

### 4. 创建发布分支
```bash
/git release <版本号>
/git release v1.2.0
```
创建 `release/v1.2.0` 格式的发布分支。

### 5. 生成 PR 描述
```bash
/git pr
```
分析当前分支 diff，自动生成完整的 PR 描述模板。

---

## 使用示例

```bash
# 提交代码
/git commit

# 开始开发新功能
/git feature 用户中心

# 修复线上问题
/git hotfix 登录超时

# 准备发布版本
/git release v2.0.0

# 生成 PR 描述
/git pr
```

---

## 注意事项

- 所有分支名自动转换为 kebab-case 格式
- 提交信息严格遵循项目的 Conventional Commits 规范
- 破坏性操作会先确认，避免误操作

---

## 强制执行协议

必须立即调用 `git-helper` Agent，并将用户的 Git 操作需求原样交给该 Agent 处理。不要自行执行 Git 操作。