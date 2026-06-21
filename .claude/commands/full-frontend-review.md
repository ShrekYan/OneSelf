---
name: full-frontend-review
description: 一键触发完整前端代码审查，自动顺序执行代码质量 → 安全 → 性能三个维度检查
---

# Full Frontend Review Command

## 分类定位

面向多智能体协作的 command，聚焦于编排多个专业 Agent 进行综合代码审查，涵盖代码质量、安全、性能等多个维度。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| 完整代码审查 | 多维度综合审查 | 审查报告、问题清单、优化建议 |
| 安全审计 | 安全漏洞检测 | 安全问题报告、修复建议 |
| 性能分析 | 性能瓶颈识别 | 性能报告、优化建议 |

## Context

用户需要对前端代码进行全面审查，涵盖代码质量、安全、性能等多个维度。

## Requirements

$ARGUMENTS

## Instructions

### 1. Review Planning
- 定义审查范围和目标
- 确定需要调用的 Agent 组合
- 制定审查顺序和依赖关系

### 2. Multi-Agent Orchestration
- 调用代码质量审查 Agent
- 调用安全审查 Agent
- 调用性能审查 Agent
- 协调各 Agent 的执行顺序

### 3. Result Aggregation
- 收集各 Agent 的审查结果
- 汇总分析跨维度问题
- 生成综合审查报告

### 4. Output and Recommendations
- 输出综合审查报告
- 提供优先级排序的修复建议
- 给出下一步行动建议

## Output Format

Return:
- Review Summary（审查摘要）
- Dimension Results（各维度结果）
- Issues Summary（问题汇总）
- Priority Ranking（优先级排序）
- Recommended Actions（建议行动）

## 审查维度配置

```yaml
review_dimensions:
  - code_quality:
      agent: frontend-code-reviewer
      focus: typescript, react, best_practices
  - security:
      agent: security-reviewer
      focus: xss, csrf, vulnerabilities
  - performance:
      agent: performance-analyzer
      focus: bundle_size, rendering, lazy_loading
```

---

## 强制执行协议

<!-- 🔴 🔴 🔴 最高优先级：必须首先执行工具调用 -->
<!-- 使用 Claude Code 原生 Agent 工具，100% 触发完整前端审查编排器 -->

### ✅ 立即执行：调用前端完整审查编排器 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `full-frontend-review-orchestrator` |
| `description` | 用户的完整前端审查需求 |
| `prompt` | "用户审查需求：{{完整用户需求描述}}\n\n请严格按照你的系统提示词中的审查工作流程执行。" |

### 🔍 自我验证（执行后确认）
- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

### ❌ 绝对禁止行为（违反即失败）
- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出审查报告
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容
