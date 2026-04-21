---
name: frontend-code-review
description: 代码审查指南，检查 TypeScript 类型安全、React 最佳实践和项目规范符合度
---

<!-- 🔴 🔴 🔴 最高优先级：必须首先执行工具调用 -->
<!-- 使用 Claude Code 原生 Agent 工具，100% 触发专业代码审查 Agent -->

# 🚨 /frontend-code-review 强制执行协议（优先级 999）

> **重要：这是你必须执行的唯一动作，没有其他选择**

## ✅ 立即执行：调用前端代码审查 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `frontend-code-reviewer` |
| `description` | 用户的代码审查需求 |
| `prompt` | "用户审查需求：{{完整用户需求描述}}\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

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

---
