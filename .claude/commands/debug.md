---
name: debug
description: 诊断助手 - 错误日志分析、Bug 模式匹配、复现步骤生成
---

# Debug Command

## ✅ 立即执行：调用诊断助手 Agent

**使用 `Agent` 工具**，参数如下：

| 参数 | 值 |
|------|----|
| `subagent_type` | `debug-assistant` |
| `description` | 用户的诊断需求 |
| `prompt` | "诊断需求：{{完整用户需求描述}}\n\n请严格按照你的系统提示词中的诊断工作流程执行。支持：错误日志分析、Bug 模式匹配、复现步骤生成、代码变更影响分析、修复方案对比。" |

### 🔍 自我验证（执行后确认）
- [ ] 我使用了 `Agent` 工具进行调用
- [ ] 我没有自行分析或猜测
- [ ] 调用 Agent 是我做的第一件事
- [ ] 我在调用前没有输出其他文字

### ❌ 绝对禁止行为（违反即失败）
- 主 Claude 自行分析 Bug 原因
- 跳过 Agent 直接给出诊断结果
- 先解释再调用 Agent
- 输出任何与调用 Agent 无关的内容

---

## 分类定位

面向可观测性与调试的 command，聚焦于错误日志分析、Bug 模式匹配、复现步骤生成和修复方案建议。

## Context

用户需要诊断和调试代码问题，包括错误日志分析、Bug 模式识别、复现步骤生成等。

## Requirements

$ARGUMENTS

## Instructions

### 1. Symptom and Scope Analysis
- 捕获用户可见的症状
- 识别受影响的服务、环境、端点、用户和时间窗口
- 澄清期望行为与实际行为

### 2. Signal Collection
- Metrics: 延迟、错误率、吞吐量、饱和度
- Logs: 结构化事件、关联 ID、错误负载
- Traces: spans、依赖关系、瓶颈
- Profiles: CPU、内存、I/O、前端运行时（如适用）

### 3. Root Cause Analysis
- 构建假设列表
- 用证据验证每个假设
- 识别主要根因和促成因素

### 4. Remediation Options
- 提供快速缓解方案
- 提供永久修复方案
- 提供回滚或安全回退方案
- 包含影响范围和风险

### 5. Prevention and Monitoring
- 添加告警、仪表盘、SLO、运行手册
- 定义回归检查和事件回顾项

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

## 诊断配置

```yaml
debug_config:
  error_types: []
  log_patterns: []
  affected_components: []
  severity: Critical | High | Medium | Low
  reproduction_steps: []
```