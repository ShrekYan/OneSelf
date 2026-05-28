# 18 Skill 模板

## 一、Skill 是什么

Skill 是可复用知识模块，适合存放：

- 技术规范
- 设计模式
- 最佳实践
- 代码模板
- 检查清单
- 领域知识
- 迁移指南
- 操作流程

Skill 不等于 Agent。Agent 是角色，Skill 是知识和方法。

## 二、目录结构

```text
skills/
  skill-name/
    SKILL.md
    references/
      details.md
    assets/
      template.js
      checklist.md
```

## 三、基础模板

````markdown
---
name: skill-name
description: Describe what this skill helps with and when to use it.
---

# Skill Title

Short introduction explaining what this skill covers.

## When to Use This Skill

- Scenario 1
- Scenario 2
- Scenario 3

## Core Concepts

### 1. Concept One

Explain the concept.

### 2. Concept Two

Explain the concept.

## Quick Start

```language
example code or command
```
````

## Best Practices

### Do's

- Recommended practice
- Recommended practice

### Don'ts

- Anti-pattern
- Anti-pattern

## Common Pitfalls

- Pitfall 1
- Pitfall 2

## Detailed patterns and worked examples

Detailed documentation lives in `references/details.md`. Read that file when this overview is insufficient.

````

## 四、技术规范 Skill 模板

```markdown
---
name: frontend-coding-standards
description: Frontend coding standards for React components, state management, styling, and testing.
---

# Frontend Coding Standards

## When to Use This Skill

- Creating new components
- Reviewing frontend code
- Refactoring frontend modules

## Component Rules

- Use function components
- Use hooks
- Keep components focused

## State Management Rules

- Local state for local UI
- Global state only for shared state

## Styling Rules

- Use project standard styling approach
- Follow naming conventions

## Testing Rules

- Add tests for business logic
- Prefer behavior-based tests

## Checklist

- [ ] Component follows naming rules
- [ ] Props are typed/documented
- [ ] Edge states handled
````

## 五、模板型 Skill 示例

````markdown
---
name: api-service-template
description: Template for creating API service modules.
---

# API Service Template

## When to Use This Skill

- Creating a new API service module
- Standardizing request functions

## File Structure

```text
service/
  moduleName.js
```
````

## Template

```javascript
export const fetchData = params => {
  return request({
    url: '/api/example',
    method: 'GET',
    params,
  });
};
```

## Checklist

- [ ] Uses shared request utility
- [ ] Handles params consistently
- [ ] Does not hardcode environment URLs

````

## 六、Skill 与 Agent 的配合

Agent 可以在自己的说明中引用 Skill：

```markdown
## Knowledge Base

When implementing API modules, follow the `api-service-template` skill.
When reviewing components, follow the `frontend-coding-standards` skill.
````

Command 也可以引用 Skill：

```markdown
Before generating code, read the `component-template` skill and follow its structure.
```

## 七、Skill 设计检查清单

- [ ] 是否是可复用知识，而不是一次性任务
- [ ] 是否有明确使用场景
- [ ] 是否有快速示例
- [ ] 是否有 Do/Don't
- [ ] 是否有检查清单
- [ ] 复杂内容是否拆到 references
- [ ] 模板内容是否可复制使用
