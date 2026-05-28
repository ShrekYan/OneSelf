# 17 Command 模板

## 一、Command 是什么

Command 是用户通过 slash command 触发的工作流入口，例如：

```text
/component-scaffold
/feature-development
/security-sast
/team-review
```

Command 适合定义：

- 多步骤工作流
- 固定流程任务
- 调用多个 Agent 的编排流程
- 需要参数解析的任务
- 需要检查点的任务

## 二、简单 Command 模板

```markdown
---
description: 'Short description of what this command does'
argument-hint: '<required argument> [--optional-flag]'
---

# Command Title

You are a [role] responsible for [workflow].

## Context

Explain when and why this command is used.

## Requirements

$ARGUMENTS

## Instructions

### 1. Analyze Input

Parse `$ARGUMENTS` and identify the target scope.

### 2. Inspect Context

Read relevant files, configuration, or project state.

### 3. Execute Workflow

Perform the required steps.

### 4. Validate

Run targeted validation or explain why validation was not run.

### 5. Report

Summarize results, changed files, risks, and next steps.
```

## 三、复杂 Command 模板

```markdown
---
description: 'Orchestrate end-to-end feature development'
argument-hint: '<feature description> [--methodology tdd|bdd|ddd] [--complexity simple|medium|complex]'
---

# Feature Development Orchestrator

## CRITICAL BEHAVIORAL RULES

1. Execute steps in order.
2. Do not skip checkpoints.
3. Write intermediate artifacts when workflow is long.
4. Stop on failure.
5. Ask for user approval before high-risk changes.
6. Use the correct specialist agent for each phase.

## Pre-flight Checks

### 1. Parse Arguments

- Feature description
- Flags
- Scope

### 2. Check Existing State

Check whether there is an in-progress workflow.

### 3. Initialize Workflow State

Create or update workflow state if needed.

## Phase 1: Discovery

### Step 1: Requirements

Gather or infer requirements.

**Output:** `.workflow/01-requirements.md`

### Step 2: Architecture

Call architecture agent.

**Output:** `.workflow/02-architecture.md`

## CHECKPOINT 1 — User Approval Required

Stop and ask user whether to continue.

## Phase 2: Implementation

Call developer agent.

## Phase 3: Review

Call reviewer/security/performance agents.

## Phase 4: Final Report

Summarize all outputs.
```

## 四、Command 常用字段

### description

```yaml
description: 'Generate production-ready React components'
```

### argument-hint

```yaml
argument-hint: '<component name> [--type form|layout|display]'
```

### $ARGUMENTS

Command 内通过 `$ARGUMENTS` 表示用户传入内容。

## 五、Command 适合调用 Agent 的写法

````markdown
Use the Task tool to launch the specialist agent:

```text
Task:
  subagent_type: "plugin-name-agent-name"
  description: "Short task description"
  prompt: |
    Full task prompt.

    ## Context
    [Insert relevant context]

    ## Deliverables
    1. Deliverable one
    2. Deliverable two
```
````

````

## 六、Command 输出模板

```markdown
# Command Result

## Input

## Actions Taken

## Outputs

## Changed Files

## Validation

## Risks

## Next Steps
````

## 七、Command 设计检查清单

- [ ] 是否有明确参数说明
- [ ] 是否定义执行步骤
- [ ] 是否定义失败时行为
- [ ] 是否定义用户确认点
- [ ] 是否指定调用哪些 Agent
- [ ] 是否有最终输出格式
- [ ] 是否避免隐藏高风险操作
