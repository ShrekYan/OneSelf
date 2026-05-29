# 03. 可观测性与调试 Command 模板

## 分类定位

面向监控、日志、Tracing、错误追踪、性能调试和智能问题定位的 command。该类命令应形成“现象 → 信号 → 证据 → 根因 → 修复 → 验证”的闭环。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `monitor-setup.md` | Monitoring and Observability Setup | Prometheus/Grafana/Tracing/Log 方案 |
| `debug-trace.md` | Debug and Trace Configuration | 本地/远程/生产调试配置 |
| `error-trace.md` | Error Tracking and Monitoring | 错误采集、分组、告警、恢复策略 |
| `error-analysis.md` | Error Analysis and Resolution | 错误根因分析与解决方案 |
| `smart-debug.md` | Debugging Approach | 复现路径、诊断树、修复选项 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {Observability or Debugging Command Title}

You are an observability and debugging expert specializing in {logs_metrics_traces_errors}.

## Context
The user needs to understand, monitor, debug, or resolve {problem_or_system}. Focus on actionable signals, reproducible diagnosis, and safe remediation.

## Requirements
$ARGUMENTS

## Instructions

### 1. Symptom and Scope Analysis
- Capture user-visible symptoms.
- Identify affected services, environments, endpoints, users, and time windows.
- Clarify expected vs actual behavior.

### 2. Signal Collection
- Metrics: latency, error rate, throughput, saturation.
- Logs: structured events, correlation IDs, error payloads.
- Traces: spans, dependencies, bottlenecks.
- Profiles: CPU, memory, I/O, frontend runtime if applicable.

### 3. Root Cause Analysis
- Build hypothesis list.
- Validate each hypothesis with evidence.
- Identify primary root cause and contributing factors.

### 4. Remediation Options
- Provide quick mitigation.
- Provide permanent fix.
- Provide rollback or safe fallback.
- Include blast radius and risks.

### 5. Prevention and Monitoring
- Add alerts, dashboards, SLOs, runbooks.
- Define regression checks and incident review items.

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
```

## 通用诊断字段

```yaml
debug_case:
  symptom: 问题现象
  environment: dev | staging | production | local
  affected_scope:
    services: []
    endpoints: []
    users: []
    time_window: 时间范围
  expected_behavior: 期望行为
  actual_behavior: 实际行为
  evidence:
    metrics: []
    logs: []
    traces: []
    screenshots: []
  hypotheses: []
  root_cause: 根因
  fix_options: []
  verification: []
```

## 子类型字段

### A. 监控搭建

```yaml
monitoring:
  metrics:
    golden_signals:
      - latency
      - traffic
      - errors
      - saturation
  dashboards: []
  alerts: []
  runbooks: []
  slo_links: []
```

### B. 错误追踪

```yaml
error_tracking:
  capture_points: []
  grouping_strategy: fingerprint | stacktrace | message | custom
  enrichment:
    - user_context
    - request_context
    - release_version
    - environment
  alert_rules: []
```

### C. 调试配置

```yaml
debug_trace:
  debug_modes:
    - local
    - remote
    - distributed
    - production_safe
  tooling: []
  source_maps: true | false
  correlation_id: true | false
```
