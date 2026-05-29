# 08. 依赖升级与提示词优化 Command 模板

## 分类定位

面向依赖升级策略与 AI Prompt 优化的 command。两者共同点是都需要基于现状评估、风险拆解、增量验证和回滚/对照实验。

## 适用命令

| 命令文件 | 标题/用途 | 典型输出 |
| --- | --- | --- |
| `deps-upgrade.md` | Dependency Upgrade Strategy | 依赖升级路径、Breaking Change、迁移指南、回滚方案 |
| `prompt-optimize.md` | AI Prompt Optimization | Prompt 评估、优化版本、测试集、效果指标 |

## 结构化模板

```markdown
---
model: claude-sonnet-4-0
---

# {Optimization Command Title}

You are an optimization expert specializing in {dependency_or_prompt_area}.

## Context
The user needs to improve {target} while minimizing regression risk. Focus on baseline measurement, incremental changes, compatibility, and verification.

## Requirements
$ARGUMENTS

## Instructions

### 1. Baseline Assessment
- Capture current versions, prompt, behavior, metrics, and constraints.
- Identify pain points, risks, and compatibility requirements.
- Define success criteria.

### 2. Change Analysis
- For dependencies: detect outdated packages, vulnerabilities, breaking changes, peer dependency issues.
- For prompts: detect ambiguity, injection risk, missing constraints, poor examples, evaluation gaps.

### 3. Optimization Plan
- Propose incremental steps.
- Define safe checkpoints.
- Provide migration or prompt rewrite examples.
- Define rollback or fallback.

### 4. Verification
- Define automated tests, regression tests, benchmarks, or prompt evaluation set.
- Compare before/after metrics.
- Define acceptance criteria.

## Output Format
Return:
- Baseline Summary
- Risk Assessment
- Proposed Changes
- Step-by-Step Plan
- Verification Matrix
- Rollback / Fallback Plan
```

## 通用字段

```yaml
optimization_command:
  target_type: dependency | prompt
  baseline: {}
  goals: []
  constraints: []
  risks: []
  change_steps: []
  verification: []
  rollback: []
```

## 子类型字段

### A. 依赖升级

```yaml
dependency_upgrade:
  package_manager: npm | yarn | pnpm | pip | poetry | maven | gradle | go | cargo | other
  dependencies:
    - name: 包名
      current: 当前版本
      target: 目标版本
      change_type: patch | minor | major
      risk: low | medium | high
      breaking_changes: []
  upgrade_strategy: direct | incremental | parallel | codemod
  test_commands: []
  rollback_commands: []
```

### B. Prompt 优化

```yaml
prompt_optimization:
  current_prompt: 当前 Prompt 摘要
  target_behavior: 目标行为
  issues:
    - ambiguity
    - missing_context
    - weak_constraints
    - no_examples
    - injection_risk
    - unstable_output
  optimized_prompt: 优化后 Prompt
  eval_set:
    - input: 测试输入
      expected: 期望输出
  metrics:
    - accuracy
    - consistency
    - latency
    - cost
    - safety
```
