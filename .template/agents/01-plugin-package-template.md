# 01 Plugin 包结构模板

## 一、用途

Plugin 是 Agent、Command、Skill 的大分类容器。一个 Plugin 应该围绕一个完整领域组织能力，而不是只放单个 Agent。

## 二、目录结构模板

```text
plugin-name/
  .claude-plugin/
    plugin.json
  agents/
    domain-developer.md
    domain-reviewer.md
    domain-security-auditor.md
  commands/
    domain-workflow.md
    domain-review.md
  skills/
    domain-patterns/
      SKILL.md
      references/
        details.md
```

## 三、plugin.json 模板

```json
{
  "name": "your-plugin-name",
  "version": "0.1.0",
  "description": "Describe the domain capability package and what workflows it enables",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "license": "MIT"
}
```

## 四、命名规则

### Plugin 名称

使用小写中划线：

```text
frontend-mobile-development
backend-development
security-compliance
cloud-infrastructure
data-engineering
```

### Agent 名称

建议携带 Plugin 前缀，避免跨插件冲突：

```text
frontend-mobile-development-frontend-developer
backend-development-backend-architect
security-compliance-security-auditor
```

### Command 名称

面向用户，简洁动词化：

```text
component-scaffold
feature-development
security-sast
performance-optimization
```

### Skill 名称

面向知识模块，名词化：

```text
api-design-principles
react-state-management
security-hardening-patterns
```

## 五、推荐组合方式

### 开发类 Plugin

```text
agents/
  developer.md
  architect.md
  reviewer.md
  test-automator.md
commands/
  feature-development.md
  component-scaffold.md
skills/
  coding-patterns/SKILL.md
  testing-patterns/SKILL.md
```

### 审查类 Plugin

```text
agents/
  code-reviewer.md
  architect-reviewer.md
  security-auditor.md
  performance-reviewer.md
commands/
  full-review.md
  pr-enhance.md
skills/
  review-checklists/SKILL.md
  severity-calibration/SKILL.md
```

### 编排类 Plugin

```text
agents/
  team-lead.md
  team-implementer.md
  team-reviewer.md
  team-debugger.md
commands/
  team-spawn.md
  team-review.md
  team-feature.md
skills/
  task-coordination/SKILL.md
  communication-protocols/SKILL.md
```

## 六、设计检查清单

- [ ] Plugin 名称是否能表达领域边界
- [ ] Agent 是否是角色，而不是具体任务
- [ ] Command 是否是用户可触发工作流
- [ ] Skill 是否是可复用知识模块
- [ ] Agent 之间职责是否清晰
- [ ] 是否避免跨 Plugin 强依赖
- [ ] 是否有清晰的输出格式
- [ ] 是否定义了禁止事项和边界
