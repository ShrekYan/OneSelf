---
name: debug
description: 诊断助手 - 错误日志分析、Bug 模式匹配、复现步骤生成
---

# Debug Command

## 分类定位

面向可观测性与调试的 command，聚焦于错误日志分析、Bug 模式匹配、复现步骤生成和修复方案建议。

## 适用场景

| 场景 | 描述 | 典型输出 |
| --- | --- | --- |
| 错误日志分析 | 解析错误堆栈和日志 | 错误原因分析、根因定位 |
| Bug 模式匹配 | 识别常见 Bug 模式 | 模式匹配结果、相似案例 |
| 复现步骤生成 | 生成可复现步骤 | 复现指南、测试用例 |
| 修复方案对比 | 评估多个修复方案 | 方案对比、推荐选择 |

## Context

用户需要诊断和调试代码问题，包括错误日志分析、Bug 模式识别、复现步骤生成等。

## Requirements

$ARGUMENTS

## Instructions

### 1. Issue Analysis
- 收集错误日志和相关信息
- 分析错误类型和模式
- 定位问题根源

### 2. Pattern Recognition
- 识别常见 Bug 模式
- 匹配已知问题库
- 提供相似案例参考

### 3. Reproduction Steps Generation
- 生成可复现步骤
- 创建测试用例
- 验证复现方法

### 4. Fix Evaluation
- 评估可能的修复方案
- 对比方案优缺点
- 提供修复建议

## Output Format

Return:
- Issue Summary（问题摘要）
- Root Cause Analysis（根因分析）
- Reproduction Steps（复现步骤）
- Fix Options（修复方案选项）
- Recommended Fix（推荐修复方案）
- Verification Steps（验证步骤）

## 诊断配置

```yaml
debug_config:
  error_types: []
  log_patterns: []
  affected_components: []
  severity: Critical | High | Medium | Low
  reproduction_steps: []
```

---

## 强制执行协议

<!-- 🔴 🔴 🔴 最高优先级：必须首先执行工具调用 -->
<!-- 使用 Claude Code 原生 Agent 工具，100% 触发诊断助手 Agent -->

### ✅ 立即执行：调用诊断助手 Agent

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
