# 20 wshobson-agents 分类映射参考

> 本文件根据 `/tmp/wshobson-agents/plugins` 目录观察到的插件命名进行分类归纳，用于学习如何划分大类。

## 一、开发类

```text
frontend-mobile-development
backend-development
api-scaffolding
javascript-typescript
python-development
jvm-languages
systems-programming
shell-scripting
web-scripting
multi-platform-apps
game-development
dotnet-contribution
julia-development
arm-cortex-microcontrollers
```

适合定义：

- developer
- language-pro
- framework-pro
- component-builder
- api-builder

## 二、架构类

```text
c4-architecture
cloud-infrastructure
database-design
full-stack-orchestration
developer-essentials
```

适合定义：

- architect
- c4-context
- c4-container
- cloud-architect
- database-architect
- monorepo-architect

## 三、安全类

```text
security-compliance
security-scanning
backend-api-security
frontend-mobile-security
review-agent-governance
protect-mcp
signed-audit-trails
block-no-verify
```

适合定义：

- security-auditor
- security-coder
- compliance-checker
- secrets-scanner
- governance-validator

## 四、性能与可观测性类

```text
application-performance
performance-testing-review
observability-monitoring
api-testing-observability
database-cloud-optimization
```

适合定义：

- performance-engineer
- observability-engineer
- database-optimizer
- load-test-reviewer

## 五、测试质量类

```text
unit-testing
tdd-workflows
api-testing-observability
performance-testing-review
```

适合定义：

- test-automator
- tdd-orchestrator
- e2e-tester
- contract-test-engineer

## 六、调试诊断类

```text
debugging-toolkit
error-debugging
error-diagnostics
distributed-debugging
incident-response
```

适合定义：

- debugger
- error-detective
- trace-analyzer
- incident-responder
- devops-troubleshooter

## 七、DevOps / 云原生类

```text
cicd-automation
cloud-infrastructure
kubernetes-operations
deployment-strategies
deployment-validation
git-pr-workflows
```

适合定义：

- deployment-engineer
- terraform-specialist
- kubernetes-architect
- cloud-architect
- devops-troubleshooter

## 八、数据类

```text
data-engineering
database-design
database-migrations
database-cloud-optimization
business-analytics
quantitative-trading
```

适合定义：

- data-engineer
- database-admin
- sql-pro
- analytics-engineer
- database-optimizer

## 九、文档类

```text
code-documentation
documentation-generation
documentation-standards
```

适合定义：

- docs-architect
- api-documenter
- tutorial-engineer
- reference-builder
- mermaid-expert

## 十、业务/内容/增长类

```text
business-analytics
content-marketing
seo-analysis-monitoring
seo-content-creation
seo-technical-optimization
customer-sales-automation
startup-business-analyst
hr-legal-compliance
payment-processing
```

适合定义：

- business-analyst
- content-marketer
- seo-specialist
- customer-support
- sales-automator
- payment-specialist

## 十一、AI / LLM 类

```text
llm-application-dev
meigen-ai-design
plugin-eval
```

适合定义：

- llm-application-architect
- prompt-engineer
- rag-engineer
- evaluator
- ai-designer

## 十二、编排类

```text
agent-orchestration
agent-teams
conductor
context-management
team-collaboration
```

适合定义：

- team-lead
- context-manager
- conductor
- team-reviewer
- team-implementer
- team-debugger

## 十三、特殊领域类

```text
blockchain-web3
reverse-engineering
accessibility-compliance
ui-design
brand-landingpage
framework-migration
dependency-management
code-refactoring
codebase-cleanup
```

适合定义：

- blockchain-developer
- reverse-engineer
- accessibility-validator
- ui-designer
- legacy-modernizer
- dependency-auditor
- refactoring-specialist

## 十四、分类抽象方法

设计大分类时可以按下面维度判断：

| 维度     | 问题                      | 示例                                          |
| -------- | ------------------------- | --------------------------------------------- |
| 技术栈   | 是否围绕某个技术栈？      | python-development                            |
| 生命周期 | 是否围绕软件交付阶段？    | tdd-workflows, deployment-validation          |
| 职能     | 是否围绕工程职能？        | security-compliance, documentation-generation |
| 平台     | 是否围绕运行平台？        | cloud-infrastructure, kubernetes-operations   |
| 业务领域 | 是否围绕业务域？          | payment-processing, quantitative-trading      |
| 协作模式 | 是否围绕多 Agent 或团队？ | agent-teams, conductor                        |

## 十五、最推荐的通用分类体系

如果你要自己搭建完整 Agent 体系，建议按这 10 大类起步：

1. 开发实现类
2. 架构设计类
3. 代码审查类
4. 安全审计类
5. 性能优化类
6. 测试质量类
7. 调试诊断类
8. DevOps/云原生类
9. 数据/数据库类
10. 文档/知识类

然后根据项目需要追加：

11. 业务产品类
12. AI/LLM 类
13. 编排协作类
14. 搜索研究类
15. 特殊领域类
