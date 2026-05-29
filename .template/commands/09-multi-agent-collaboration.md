# 09. 多智能体协作 Command 模板

## 分类定位

面向多智能体代码审查与多智能体优化的 command。该类命令通过不同专家角色并行分析，再汇总冲突、优先级和统一行动计划。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `multi-agent-review.md` | 多智能体代码审查流程 | Code Quality / Security / Architecture 综合审查 |
| `multi-agent-optimize.md` | 多智能体优化流程 | Database / Application / Frontend 综合优化计划 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {Multi-Agent Command Title}

Coordinate multiple specialized agents to analyze {target} from complementary perspectives, then consolidate findings into a prioritized, conflict-resolved plan.

## Context
The user needs a comprehensive multi-perspective review or optimization for {target}. Focus on parallel expert analysis, evidence-based prioritization, and unified execution guidance.

## Requirements
$ARGUMENTS

## Instructions

### 1. Agent Role Definition
Define specialist roles and responsibilities.
Each agent must have:
- Scope
- Inputs
- Review / optimization criteria
- Expected output

### 2. Parallel Analysis
Run or simulate independent expert analysis across dimensions.
Prevent agents from overwriting each other's scope.
Require evidence and priority from each agent.

### 3. Conflict Resolution
- Identify conflicting recommendations.
- Compare trade-offs.
- Prefer changes with higher risk reduction and lower implementation cost.
- Escalate unresolved decisions.

### 4. Consolidated Output
- Merge findings.
- Deduplicate similar issues.
- Rank by severity, impact, and effort.
- Produce phased execution plan.

### 5. Validation and Follow-up
- Define verification per recommendation.
- Define ownership and sequencing.
- Define re-review triggers.

## Output Format
Return:
- Agent Roles
- Individual Findings Summary
- Consolidated Findings
- Conflicts and Resolutions
- Prioritized Action Plan
- Verification Plan
- Follow-up Questions
```

## 通用字段

```yaml
multi_agent:
  target: 分析对象
  agents:
    - name: agent 名称
      role: 专家角色
      scope: 分析范围
      criteria: []
      output: []
  findings:
    - agent: 来源 agent
      severity: Critical | High | Medium | Low
      impact: 影响
      effort: low | medium | high
      recommendation: 建议
  conflicts:
    - topic: 冲突主题
      options: []
      resolution: 决议
      rationale: 理由
  action_plan:
    phases: []
    owners: []
    verification: []
```

## 子类型字段

### A. 多智能体审查

```yaml
multi_agent_review:
  review_agents:
    - code_quality
    - security
    - architecture
    - performance
    - accessibility
  severity_policy:
    blocker: 必须先修复
    high: 当前迭代修复
    medium: 计划修复
    low: 可选优化
```

### B. 多智能体优化

```yaml
multi_agent_optimize:
  optimization_agents:
    - database
    - application
    - frontend
    - infrastructure
    - cost
  baseline_metrics: []
  expected_improvements: []
  roadmap:
    immediate: []
    short_term: []
    long_term: []
```

## 协作注意事项

1. 每个 agent 的职责边界必须清楚。
2. 汇总阶段必须去重，避免同一问题多次计入。
3. 冲突必须显式记录，而不是隐式选择。
4. 输出必须包含优先级、工作量、验证方式。
5. 对安全、合规、数据破坏等高风险建议应优先处理。
