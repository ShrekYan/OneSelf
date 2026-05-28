# 02 Agent 通用基础模板

## 一、适用范围

所有类型 Agent 都可以从这个模板开始，然后根据具体分类扩展。

## 二、基础模板

```markdown
---
name: plugin-name-agent-name
description: Describe what this agent does, what it is expert in, and when to use it. Use PROACTIVELY when appropriate.
model: inherit
---

You are a [domain] expert specializing in [specialty].

## Purpose

Define the agent's responsibility, scope, and expected outcomes.

## Core Philosophy

- Principle 1
- Principle 2
- Principle 3

## Capabilities

### Capability Group 1

- Capability item
- Capability item

### Capability Group 2

- Capability item
- Capability item

## Behavioral Traits

- How the agent behaves
- What it prioritizes
- What it avoids
- How it communicates

## Knowledge Base

- Frameworks, libraries, tools, protocols, standards, and domain knowledge this agent should know.

## Response Approach

1. Analyze the request and context
2. Explore relevant files or information
3. Decide the approach
4. Execute or produce findings
5. Validate results
6. Summarize clearly

## Output Format

Define the exact structure of the final response.

## Example Interactions

- "Example user request 1"
- "Example user request 2"
```

## 三、字段说明

### name

建议格式：

```text
plugin-name-agent-role
```

示例：

```yaml
name: backend-development-backend-architect
```

### description

description 决定 Agent 什么时候被调用，建议包含：

```text
能力 + 专长 + 触发场景 + 主动调用条件
```

示例：

```yaml
description: Build React components, implement responsive layouts, and fix frontend bugs. Use PROACTIVELY when creating UI components or fixing frontend issues.
```

### model

常用：

```yaml
model: inherit
```

复杂审计、推理可用：

```yaml
model: sonnet
```

## 四、Agent 设计原则

### 1. 一个 Agent 对应一个稳定角色

不要把 Agent 定义成一次性任务。

好：

```text
security-auditor
backend-architect
frontend-developer
```

不好：

```text
fix-login-bug-agent
create-user-page-agent
```

### 2. description 要可触发

不好：

```yaml
description: A useful assistant.
```

好：

```yaml
description: Review code for security vulnerabilities, OWASP risks, authentication flaws, and sensitive data leaks. Use for security review before release.
```

### 3. 明确边界

Agent 应该说明：

- 能做什么
- 不能做什么
- 是否可以修改代码
- 是否只读
- 是否需要用户确认

### 4. 输出结构固定

尤其是审查、安全、性能、测试 Agent，必须有固定输出格式，便于后续自动化处理。

## 五、最小可用模板

```markdown
---
name: my-plugin-my-agent
description: Handle specific domain tasks. Use when the user asks for related work.
model: inherit
---

You are a domain expert specializing in this area.

## Purpose

Explain the role.

## Capabilities

- Capability 1
- Capability 2
- Capability 3

## Response Approach

1. Understand the request
2. Inspect relevant context
3. Perform the task
4. Validate the result
5. Report clearly

## Output Format

- Summary
- Details
- Risks
- Next steps
```
