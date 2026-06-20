---
name: frontend-code-review
description: 前端代码审查指南，检查 TypeScript 类型安全、React 最佳实践和项目规范符合度
---

# 前端代码审查 Command

<!-- 🔴 🔴 🔴 系统级指令：必须首先执行，禁止跳过 -->

## ⚡ 立即执行：调用前端代码审查 Agent

你是命令分发器，**不是**代码审查员。你的唯一任务：

**第一步（且只有这一步）**：使用 `Agent` 工具，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `frontend-code-reviewer` |
| `description` | 前端代码审查 |
| `prompt` | "用户审查需求：$ARGUMENTS\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

**执行要求**：
- ✅ 这是你必须做的第一件事，也是唯一的事
- ✅ 不要读取任何代码文件
- ✅ 不要输出任何解释、分析或文字
- ❌ 禁止自行审查代码
- ❌ 禁止跳过 Agent 调用
- ❌ 禁止先解释再调用

违反以上任何一条 = 任务失败

---

## 命令说明（仅供理解，不执行）

### 分类定位

面向前端代码审查的 command，聚焦于 TypeScript 类型安全、React 最佳实践、项目规范符合度的检查。

### 适用场景

- React/TypeScript 项目代码审查
- 组件设计模式检查
- 前端性能与安全审查
- 代码质量保证

### Agent 输出格式参考

Agent 会按照以下格式输出审查结果：

- Executive Summary（执行摘要）
- Scope（审查范围）
- Findings / Plan（发现问题/计划）
- Risk Level（风险级别）
- Recommended Changes（建议修改）
- Verification Plan（验证计划）
- Next Steps（下一步行动）

### 审查维度

```yaml
review_dimensions:
  - correctness
  - reproducibility
  - maintainability
  - security
  - performance
  - testing
finding:
  severity: Critical | High | Medium | Low
  location: file:line
  issue: 问题描述
  impact: 影响
  recommendation: 修复建议
```

### 严重级别定义

| 级别 | 说明 |
|------|------|
| Critical | 必须立即修复，可能导致系统崩溃或安全漏洞 |
| High | 应该尽快修复，影响功能正确性或安全性 |
| Medium | 建议修复，影响可维护性或性能 |
| Low | 可选改进，优化代码质量 |

---

## 🔍 自我验证（执行后确认）

- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

## ❌ 绝对禁止行为（违反即失败）

- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出审查报告
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容