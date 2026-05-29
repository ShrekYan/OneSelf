# 04. 部署与基础设施 Command 模板

## 分类定位

面向容器、Kubernetes、部署检查、数据库迁移与云成本优化的 command。重点是可部署、可回滚、可验证、可观测和成本可控。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `k8s-manifest.md` | Kubernetes Manifest Generation | Deployment/Service/Ingress/Helm/GitOps 配置 |
| `docker-optimize.md` | Docker Optimization | 多阶段构建、镜像瘦身、安全加固 |
| `deploy-checklist.md` | Deployment Checklist and Configuration | 发布前/发布中/发布后检查清单 |
| `db-migrate.md` | Database Migration Strategy and Implementation | 零停机迁移、回滚、数据校验 |
| `cost-optimize.md` | Cloud Cost Optimization | 成本分析、Rightsizing、预算告警 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {Infrastructure Command Title}

You are a DevOps / platform engineering expert specializing in {deployment_area}.

## Context
The user needs to deploy, optimize, migrate, or operate {target_system}. Focus on safety, repeatability, rollback, observability, and cost efficiency.

## Requirements
$ARGUMENTS

## Instructions

### 1. System and Environment Analysis
- Identify runtime, dependencies, traffic pattern, stateful components, and constraints.
- Identify target environments: dev, staging, production.
- Identify compliance, security, availability, and cost requirements.

### 2. Infrastructure Design or Optimization
- Generate deployment resources or optimization plan.
- Include resource limits, health checks, scaling, networking, secrets/configs, and storage.
- Include database migration strategy if stateful data is involved.

### 3. Safety and Rollback
- Define preflight checks.
- Define rollout strategy.
- Define rollback strategy.
- Define data integrity and compatibility checks.

### 4. Observability and Operations
- Define logs, metrics, traces, dashboards, alerts, and runbooks.
- Include post-deployment verification.

### 5. Cost and Efficiency
- Identify cost drivers.
- Recommend rightsizing, reservations, storage/network optimizations, and budget alerts.

## Output Format
Return:
- Deployment / Infrastructure Summary
- Generated Resources or Plan
- Security and Compliance Notes
- Rollout Strategy
- Rollback Plan
- Validation Checklist
- Monitoring and Cost Controls
```

## 通用字段

```yaml
infrastructure:
  target_system: 服务或应用名称
  environment: dev | staging | production | multi-env
  runtime: docker | kubernetes | serverless | vm | database | hybrid
  availability_target: 可用性目标
  resource_requirements:
    cpu: 可选
    memory: 可选
    storage: 可选
  rollout:
    strategy: rolling | blue_green | canary | recreate
    preflight_checks: []
    post_checks: []
  rollback:
    trigger_conditions: []
    steps: []
  observability:
    metrics: []
    logs: []
    alerts: []
  cost_controls: []
```

## 子类型字段

### A. Kubernetes

```yaml
kubernetes:
  resources:
    - Deployment
    - Service
    - Ingress
    - ConfigMap
    - Secret
    - HPA
    - NetworkPolicy
  helm_chart: true | false
  gitops: true | false
```

### B. Docker

```yaml
docker:
  base_image: 基础镜像
  build_strategy: single_stage | multi_stage
  size_optimization: []
  security_hardening: []
  runtime_user: non_root | root
```

### C. 数据库迁移

```yaml
database_migration:
  migration_type: schema | data | engine | cloud | cross_platform
  zero_downtime: true | false
  compatibility_phase: expand | migrate | contract
  integrity_checks: []
  rollback_plan: []
```

### D. 成本优化

```yaml
cost_optimization:
  cloud_provider: aws | gcp | azure | other
  cost_drivers: []
  rightsizing: []
  reserved_capacity: []
  storage_network_optimization: []
  budgets_alerts: []
```
