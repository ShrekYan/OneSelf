---
name: debug
description: 诊断助手 - 错误日志分析、Bug 模式匹配、复现步骤生成、修复方案对比
---

# Debug Command

## 分类定位

面向可观测性与调试的 command，聚焦于错误日志分析、Bug 模式匹配、复现步骤生成和修复方案建议，形成"现象 → 信号 → 证据 → 根因 → 修复 → 验证"的闭环。

## Context

用户需要诊断和调试代码问题，包括错误日志分析、Bug 模式识别、复现步骤生成等。本命令应优先调用 `debug` skill 完成诊断，避免主 Claude 自行分析 Bug 原因或跳过 skill 直接给出结论。

## Requirements

$ARGUMENTS

## Instructions

### 1. 调用 debug Skill 启动诊断

当用户输入符合诊断场景（如"API 返回 500"、"React 页面崩溃"、"CI 构建失败"、"错误日志分析"、"复现步骤生成"等）时，**使用 `Skill` 工具调用 `debug` skill**，并将用户的完整诊断需求作为 `args` 参数传递。

| 参数 | 值 |
|------|----|
| `skill` | `debug` |
| `args` | 用户的完整诊断需求描述，包含错误堆栈、Bug 现象、发生环境、复现概率、变更范围等 |

`debug` skill 将按以下流程执行：

1. **收集信息**：获取错误堆栈、Bug 现象、发生环境、复现概率、变更范围。
2. **初步定位**：使用 Grep 搜索错误关键词，定位到具体文件和代码行。
3. **根因分析**：追踪调用链、检查依赖关系、识别竞态条件、验证数据流向。
4. **方案输出**：按模板生成错误诊断报告、复现步骤或代码变更影响分析。
5. **预防建议**：提出如何避免类似问题、补充测试用例、代码审查要点。

> 详细规范与能力说明见 `.claude/skills/debug/SKILL.md`，其中包含 `reference/debug-guide.md`、报告模板和校验清单。此处不再重复展开，由 `debug` skill 自行加载并执行。

### 2. Symptom and Scope Analysis

- 捕获用户可见的症状。
- 识别受影响的服务、环境、端点、用户和时间窗口。
- 澄清期望行为与实际行为。

### 3. Signal Collection

- **Metrics**：延迟、错误率、吞吐量、饱和度。
- **Logs**：结构化事件、关联 ID、错误负载。
- **Traces**：spans、依赖关系、瓶颈。
- **Profiles**：CPU、内存、I/O、前端运行时（如适用）。

### 4. Root Cause Analysis

- 构建假设列表。
- 用证据验证每个假设。
- 识别主要根因和促成因素。

### 5. Remediation Options

- 提供快速缓解方案。
- 提供永久修复方案。
- 提供回滚或安全回退方案。
- 包含影响范围和风险。

### 6. Prevention and Monitoring

- 添加告警、仪表盘、SLO、运行手册。
- 定义回归检查和事件回顾项。

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
