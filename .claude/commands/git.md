---
name: git
description: Git 操作助手，智能提交、分支管理、PR 描述生成
usage: /git <command> [args]
---

#include: ../agents/git-helper.md

# Git 命令使用说明

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
