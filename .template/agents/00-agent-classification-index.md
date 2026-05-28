# Agent 大分类模板总览

> 本目录用于学习和沉淀 Agent 分类模板结构，参考 `/tmp/wshobson-agents/plugins` 的组织方式整理。

## 一、标准 Plugin 结构

```text
plugin-name/
  .claude-plugin/
    plugin.json
  agents/
    xxx-agent.md
  commands/
    xxx-command.md
  skills/
    xxx-skill/
      SKILL.md
      references/
        details.md
```

## 二、大分类设计原则

一个大分类 Plugin 不应该只放一个 Agent，而应该围绕一个完整领域组织：

```text
领域大类 = Agent 角色 + Command 工作流 + Skill 知识库
```

例如：

```text
frontend-mobile-development/
  agents/
    frontend-developer.md
    mobile-developer.md
  commands/
    component-scaffold.md
  skills/
    react-state-management/SKILL.md
    tailwind-design-system/SKILL.md
```

## 三、推荐大分类清单

| 编号 | 大分类           | 适用场景                        | 对应模板文件                            |
| ---- | ---------------- | ------------------------------- | --------------------------------------- |
| 01   | Plugin 包结构    | 定义一个完整插件包              | `01-plugin-package-template.md`         |
| 02   | Agent 通用模板   | 所有 Agent 的基础结构           | `02-agent-base-template.md`             |
| 03   | 开发实现类       | 前端、后端、移动端、脚本开发    | `03-development-agent-template.md`      |
| 04   | 架构设计类       | 系统、服务、C4、云架构设计      | `04-architecture-agent-template.md`     |
| 05   | 代码审查类       | Code Review、架构合规、质量检查 | `05-code-review-agent-template.md`      |
| 06   | 安全审计类       | OWASP、合规、敏感信息、依赖安全 | `06-security-agent-template.md`         |
| 07   | 性能优化类       | 前端性能、后端性能、数据库性能  | `07-performance-agent-template.md`      |
| 08   | 测试质量类       | 单测、集成测试、E2E、TDD        | `08-testing-agent-template.md`          |
| 09   | 调试诊断类       | Bug 分析、错误追踪、根因定位    | `09-debugging-agent-template.md`        |
| 10   | DevOps/云原生类  | CI/CD、K8s、Terraform、部署     | `10-devops-cloud-agent-template.md`     |
| 11   | 数据/数据库类    | 数据工程、SQL、迁移、数仓       | `11-data-database-agent-template.md`    |
| 12   | 文档知识类       | API 文档、教程、ADR、项目说明   | `12-documentation-agent-template.md`    |
| 13   | 业务产品类       | 需求、商业分析、增长、销售支持  | `13-business-product-agent-template.md` |
| 14   | AI/LLM 类        | RAG、Prompt、Agent、模型评估    | `14-ai-llm-agent-template.md`           |
| 15   | 编排协作类       | 多 Agent、团队协作、任务调度    | `15-orchestration-agent-template.md`    |
| 16   | 搜索研究类       | 代码搜索、资料调研、上下文管理  | `16-search-research-agent-template.md`  |
| 17   | Command 模板     | Slash Command 工作流定义        | `17-command-template.md`                |
| 18   | Skill 模板       | 可复用知识/规范/模板定义        | `18-skill-template.md`                  |
| 19   | 金融 H5 项目模板 | 当前项目可参考的专属分类        | `19-financial-h5-agent-templates.md`    |

## 四、Agent 文件通用组成

```markdown
---
name: plugin-name-agent-name
description: Agent 能力描述，以及什么时候使用
model: inherit
---

You are a ...

## Purpose

## Core Philosophy

## Capabilities

## Behavioral Traits

## Knowledge Base

## Response Approach

## Output Format

## Example Interactions
```

## 五、如何判断一个 Agent 属于哪一类

| 判断问题                         | 对应类型         |
| -------------------------------- | ---------------- |
| 是否主要写代码？                 | 开发实现类       |
| 是否主要做方案设计？             | 架构设计类       |
| 是否主要找问题但不修改？         | 审查/安全/性能类 |
| 是否主要跑测试和构造测试用例？   | 测试质量类       |
| 是否主要定位 Bug 根因？          | 调试诊断类       |
| 是否主要部署、CI/CD、K8s？       | DevOps/云原生类  |
| 是否主要处理 SQL、数据、迁移？   | 数据/数据库类    |
| 是否主要输出文档？               | 文档知识类       |
| 是否主要拆任务、调度多个 Agent？ | 编排协作类       |
| 是否主要检索代码或资料？         | 搜索研究类       |

## 六、命名建议

### Plugin 命名

```text
领域-能力
```

例如：

```text
frontend-mobile-development
backend-development
security-compliance
data-engineering
cloud-infrastructure
```

### Agent 命名

```text
plugin-name-agent-role
```

例如：

```text
frontend-mobile-development-frontend-developer
backend-development-backend-architect
security-compliance-security-auditor
```

### Skill 命名

```text
领域能力或方法论名称
```

例如：

```text
api-design-principles
react-state-management
security-hardening-patterns
```

### Command 命名

```text
动作-对象
```

例如：

```text
component-scaffold
feature-development
security-sast
performance-optimization
```
