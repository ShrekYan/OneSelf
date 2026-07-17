---
name: common-mermaid
description: Use this skill whenever the user wants to generate Mermaid diagrams, including flowcharts, architecture diagrams, and sequence diagrams. Triggers include "generate mermaid", "draw flowchart", "sequence diagram", "architecture diagram". Also use when the user asks for visualizing a process, system flow, or component interaction. Do NOT use for non-Mermaid visual formats such as PNG, SVG drawings, or PlantUML.
license: Complete terms in LICENSE.txt
---

# Mermaid 流程图生成技能

## Overview

本技能用于根据用户描述生成符合项目规范的 Mermaid 图表。核心产物是可直接渲染的 Mermaid 代码块，支持流程图、架构图和序列图。

## When to use this skill

- 用户要求生成 Mermaid 流程图、架构图或序列图
- 用户希望可视化某个业务流程、系统交互或组件关系
- 用户需要把技术方案以图表形式呈现

不适用场景：

- 生成非 Mermaid 格式的图片或矢量图
- 使用 PlantUML 等其他图表语法

## Inputs

- 用户想要表达的业务场景、流程步骤或系统组件关系
- 图表类型偏好（流程图、架构图、序列图）
- 是否需要分组、样式或特定节点命名

## Workflow

1. 识别任务类型：确认用户需要流程图、架构图还是序列图。
2. 收集必要输入：梳理关键节点、步骤、参与方和连接关系。
3. 加载必要资源：
   - 生成前阅读 [reference/mermaid-syntax-rules.md](reference/mermaid-syntax-rules.md) 了解语法约束。
   - 如需模仿输出格式，参考 [examples/](examples/) 中的示例。
4. 执行核心流程：按照语法规范编写 Mermaid 代码块。
5. 验证输出结果：对照 Validation 清单检查语法正确性。
6. 向用户交付结果：返回可直接使用的 Mermaid 代码块。

## Resources

| 资源 | 何时使用 |
|------|----------|
| [reference/mermaid-syntax-rules.md](reference/mermaid-syntax-rules.md) | 生成图表前必须加载，确认 subgraph、节点文字、箭头标签、换行和反引号规则 |
| [examples/example-flowchart-cache-optimization.md](examples/example-flowchart-cache-optimization.md) | 需要参考多级缓存流程图示例时 |
| [examples/example-flowchart-redis-cache.md](examples/example-flowchart-redis-cache.md) | 需要参考纯 Redis 缓存架构示例时 |
| [examples/example-flowchart-tiered-cache.md](examples/example-flowchart-tiered-cache.md) | 需要参考分级缓存热点预计算示例时 |
| [examples/example-flowchart-architecture.md](examples/example-flowchart-architecture.md) | 需要参考整体架构层次示例时 |
| [examples/example-sequence-login.md](examples/example-sequence-login.md) | 需要参考登录流程序列图示例时 |

## Output format

最终输出为一个或多个被 ```mermaid 包裹的代码块。每个代码块第一行必须声明图表类型，例如 `flowchart TD` 或 `sequenceDiagram`。

## Validation

生成后必须逐项检查：

- [ ] 图表第一行声明了图表类型，例如 `flowchart TD` 或 `sequenceDiagram`
- [ ] 所有含空格的 subgraph 都用双引号包裹
- [ ] 节点文字中没有 `{ } ( ) < >` 这些特殊字符
- [ ] 需要分隔的地方用 `-` 代替了特殊字符
- [ ] 箭头标签只使用英文简写（如 hit、miss、query），没有中文
- [ ] 每个箭头连接单独一行，没有一行放多个连接
- [ ] 没有在节点文字内部使用反引号

## Constraints

- 必须遵守 [reference/mermaid-syntax-rules.md](reference/mermaid-syntax-rules.md) 中的全部规则
- 箭头标签只能使用英文，避免中文导致解析失败
- 节点文字避免特殊字符，使用 `-` 作为分隔符
- 复杂图表优先拆分为多个子图，并通过样式区分层次
