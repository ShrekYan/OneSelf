# 07. 数据与配置治理 Command 模板

## 分类定位

面向数据管道、数据验证、配置校验和 SLO 实施的 command。该类命令强调数据质量、配置一致性、运行可靠性与可量化服务目标。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `data-pipeline.md` | Data Pipeline Architecture | 数据摄取、转换、存储、调度、监控方案 |
| `data-validation.md` | Data Validation Pipeline | 数据质量规则、异常处理、验证报告 |
| `config-validate.md` | Configuration Validation | 配置扫描、Schema、环境一致性、安全检查 |
| `slo-implement.md` | SLO Implementation Guide | SLI/SLO、错误预算、监控看板、治理流程 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {Data / Config / Reliability Command Title}

You are a data, configuration, and reliability engineering expert specializing in {governance_area}.

## Context
The user needs to design, validate, or govern {target}. Focus on correctness, consistency, reliability, observability, and automated enforcement.

## Requirements
$ARGUMENTS

## Instructions

### 1. Target and Constraint Analysis
- Identify data sources, config files, service boundaries, or user journeys.
- Identify environments, ownership, freshness, volume, latency, and reliability needs.
- Identify regulatory or security constraints.

### 2. Schema / Rules / Indicators Definition
- Define schemas, validation rules, SLI/SLO indicators, or quality dimensions.
- Define thresholds, error budgets, and failure handling.
- Define severity and escalation.

### 3. Pipeline or Validation Design
- Define stages, dependencies, execution timing, and storage.
- Define validation checkpoints and reporting.
- Define automated enforcement in CI/CD or runtime.

### 4. Monitoring and Governance
- Define dashboards, alerts, reviews, ownership, and continuous improvement.
- Include incident or data-quality response workflow.

## Output Format
Return:
- Scope and Assumptions
- Schema / Rules / SLO Definitions
- Implementation Plan
- Validation and Monitoring
- Failure Handling
- Governance Cadence
```

## 通用字段

```yaml
governance_command:
  target_type: data_pipeline | data_validation | configuration | slo
  owners: []
  environments: []
  inputs: []
  outputs: []
  rules: []
  thresholds: []
  monitoring: []
  failure_handling: []
```

## 子类型字段

### A. 数据管道

```yaml
data_pipeline:
  sources: []
  ingestion:
    mode: batch | streaming | hybrid
    schedule: cron 或事件触发
  transformations: []
  sinks: []
  orchestration: airflow | dagster | prefect | dbt | custom
  observability:
    freshness: []
    volume: []
    latency: []
    errors: []
```

### B. 数据验证

```yaml
data_validation:
  quality_dimensions:
    - completeness
    - uniqueness
    - validity
    - consistency
    - freshness
    - accuracy
  rules:
    - field: 字段名
      rule: 规则
      severity: Critical | High | Medium | Low
  quarantine_strategy: []
```

### C. 配置校验

```yaml
config_validation:
  config_files: []
  formats:
    - json
    - yaml
    - toml
    - env
  schema: {}
  environment_consistency: []
  secret_detection: true | false
  migration_rules: []
```

### D. SLO 实施

```yaml
slo:
  user_journey: 用户旅程
  sli:
    name: 指标名
    measurement: 计量方式
  objective: 目标值，例如 99.9%
  window: 7d | 28d | 30d
  error_budget: 预算
  burn_rate_alerts: []
  review_cadence: weekly | monthly
```
