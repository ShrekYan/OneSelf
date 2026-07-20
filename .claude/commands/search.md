---
name: search
description: 智能代码搜索 - 按功能、组件、调用链搜索全栈代码
---

# Search Command

## ✅ 立即执行：调用搜索专家 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `search-expert` |
| `description` | 用户的搜索需求 |
| `prompt` | "搜索需求：$ARGUMENTS\n\n请严格按照你的系统提示词中的搜索工作流程执行。支持前后端全栈代码搜索。" |

### 🔍 自我验证（执行后确认）
- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行扫描或分析任何代码
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

### ❌ 绝对禁止行为（违反即失败）
- 主 Claude 自行扫描代码
- 跳过 Agent 直接输出搜索结果
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容

---

## 分类定位

面向可观测性与调试的 command，聚焦于代码搜索、功能定位、调用链分析和代码理解。

## Context

用户需要搜索代码库，按功能、组件或调用链查找相关代码。

## Requirements

$ARGUMENTS

## Instructions

### 1. Symptom and Scope Analysis
- 捕获用户的搜索意图和目标
- 识别搜索范围：前端、后端、全栈
- 澄清期望的搜索结果类型

### 2. Signal Collection
- Metrics: 搜索相关性、结果数量、代码复杂度
- Logs: 搜索历史、用户反馈、常用搜索模式
- Traces: 调用链、依赖关系、代码引用
- Profiles: 代码结构、模块组织、文件分布

### 3. Root Cause Analysis
- 构建搜索策略假设
- 用搜索结果验证每个假设
- 识别最相关的代码位置

### 4. Remediation Options
- 提供搜索结果摘要
- 提供代码定位信息
- 提供进一步探索建议

### 5. Prevention and Monitoring
- 添加搜索历史记录
- 定义常用搜索模式
- 优化搜索关键词建议

## Output Format

Return:
- Problem Summary
- Impact and Scope
- Evidence Collected
- Root Cause Analysis
- Solution Options
- Recommended Fix
- Verification Plan
- Monitoring / Alerting Additions