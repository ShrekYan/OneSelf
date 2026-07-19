---
name: git
description: Git 操作助手，智能提交、分支管理、PR 描述生成
usage: /git <command> [args]
---

# Git Command

## 分类定位

面向 Git 操作辅助的 command，聚焦于智能提交、分支管理、PR 描述生成等开发流程优化。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| 智能提交信息生成 | Conventional Commits 规范提交信息 | 提交信息方案列表 |
| 分支创建与管理 | 功能分支、修复分支、发布分支 | 分支名称、操作步骤 |
| PR 描述自动生成 | 分析分支 diff 生成描述 | PR 标题、改动清单 |
| Git 工作流辅助 | 日常 Git 操作支持 | 操作指南、示例命令 |

## Context

用户需要 Git 操作辅助，包括提交信息生成、分支管理、PR 描述生成等。

## Requirements

$ARGUMENTS

## Instructions

### 1. System and Environment Analysis
- 识别 Git 操作类型：commit、branch、pr 或其他
- 理解上下文和需求
- 验证前提条件（当前分支状态、工作区状态）

### 2. Infrastructure Design or Optimization
- 对于提交：生成符合 Conventional Commits 规范的提交信息
- 对于分支：遵循命名约定创建分支
- 对于 PR：分析 diff 并生成结构化描述

### 3. Safety and Rollback
- 执行或推荐 Git 操作
- 提供清晰的步骤和示例
- 包含破坏性操作的安全检查和确认机制

### 4. Observability and Operations
- 确认执行成功
- 提供下一步建议
- 记录操作历史

### 5. Cost and Efficiency
- 优化操作流程
- 减少重复操作
- 提供快捷命令建议

## Output Format

Return:
- Deployment / Infrastructure Summary（任务摘要）
- Generated Resources or Plan（生成的输出）
- Security and Compliance Notes（安全和合规说明）
- Rollout Strategy（执行策略）
- Rollback Plan（回滚计划）
- Validation Checklist（验证检查清单）
- Monitoring and Cost Controls（监控和控制）

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