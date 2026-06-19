---
name: full-frontend-review
description: 一键触发完整前端代码审查，自动顺序执行代码质量 → 安全 → 性能三个维度检查
---

# 🚨 /full-frontend-review 强制执行协议（优先级 999）

> **重要：这是你必须执行的唯一动作，没有其他选择**

## ✅ 立即执行：调用前端完整审查编排器 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `full-frontend-review-orchestrator` |
| `description` | 用户的完整前端审查需求 |
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

# full-frontend-review

一键触发完整前端代码审查，编排器自动顺序执行三个专业 Agent：

1. **frontend-code-reviewer** - 代码质量审查（TypeScript 类型安全、React 最佳实践、项目规范检查）
2. **frontend-security-auditor** - 安全漏洞扫描（XSS、注入攻击、敏感信息泄露等）
3. **frontend-performance-expert** - 性能分析优化（React 19 + MobX 移动端 H5 性能优化）

**用户只需要触发一次**，编排器自动跑完整个流程，最后输出整合后的综合审查报告。

三个专项检查**复用各自现有的检查清单**，不需要重复整合：
- 代码质量 → `.claude/skills/frontend-code-review/SKILL.md`
- 安全扫描 → `.claude/agents/frontend-security-auditor.md`
- 性能优化 → `.claude/skills/frontend-perf/SKILL.md`

## 使用方法

```
/full-frontend-review [检查范围] [选项]
```

## 参数说明

- **检查范围**：要检查的文件或目录，多个用空格分隔。不指定默认检查 `src/`。
- **选项**：
  - `--continue-on-error`：即使发现严重问题也继续完成全部检查
  - `--only-issues`：只输出发现的问题，省略无问题部分描述

## 示例

```bash
# 检查整个 src 目录
/full-frontend-review src/

# 检查指定页面和 API 模块
/full-frontend-review apps/web/src/pages/ArticleList apps/web/src/api/article

# 即使有严重问题也继续检查完
/full-frontend-review src/ --continue-on-error
```

## 说明

- **执行方式**：单窗口内自动顺序执行，一次触发自动跑完
- **真并发加速**：如果需要真并发加速，请手动打开三个独立 Claude 窗口分别运行三个 Agent
- **输出**：全部完成后输出整合的综合报告，统一问题优先级
