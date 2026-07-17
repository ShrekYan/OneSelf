---
name: common-backend-module-doc
description: Use this skill when the user wants to generate backend module design documentation for NestJS projects. Triggers include "/backend-module-doc [模块路径]" command or requests to create architectural documentation for backend modules. Do NOT use for frontend documentation or non-NestJS projects.
license: Complete terms in LICENSE.txt
---

# 后端模块功能介绍文档生成规范

## Overview

本技能用于为 NestJS 后端模块生成完整的设计文档，输出到 `docs/services/backend` 目录。生成的文档包含架构图、技术选型、数据库设计、API 接口等内容，便于日后回顾学习设计决策。

## When to use this skill

- 用户使用 `/backend-module-doc [模块路径]` 命令时
- 用户请求为后端模块创建架构设计文档时
- 用户需要记录后端模块设计决策时

**不适用场景**：
- 前端模块文档生成
- 非 NestJS 项目
- 简单的代码注释需求

## Inputs

- **模块路径**：用户指定的 NestJS 模块目录路径
- **项目上下文**：项目根目录下的 `package.json`、`tsconfig.json` 等配置文件

## Workflow

1. **解析参数**：获取用户指定的模块路径
2. **确认存在**：检查路径是否存在，是否是 NestJS 模块
3. **探索代码**：读取模块目录结构、Controller/Service/Repository 源码，理解模块职责和设计决策
4. **提取信息**：提取技术选型决策点、数据库索引设计、API 接口定义
5. **填充模板**：按章节顺序依次读取对应 reference 文件，填充内容
6. **生成 mermaid 图**：读取 [reference/chapter-architecture.md](reference/chapter-architecture.md) 和 [reference/chapter-flow.md](reference/chapter-flow.md) 生成架构图和流程图，读取 [reference/mermaid-checklist.md](reference/mermaid-checklist.md) 检查语法
7. **写入文件**：输出到 `docs/services/backend/{module-name}-YYYYMMDD.md`
8. **最终检查**：读取 [reference/final-checklist.md](reference/final-checklist.md) 进行检查
9. **反馈结果**：输出生成的文件路径，告知用户完成

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/chapter-overview.md` | 需要生成文档信息和模块概述时 |
| `reference/chapter-architecture.md` | 需要生成模块架构设计时 |
| `reference/chapter-flow.md` | 需要生成核心流程时 |
| `reference/chapter-tech-selection.md` | 需要生成技术选型对比时 |
| `reference/chapter-solution-detail.md` | 需要生成具体方案详述时 |
| `reference/chapter-database.md` | 需要生成数据库设计与性能讲解时 |
| `reference/chapter-distributed.md` | 需要生成分布式架构服务器配置时 |
| `reference/chapter-api-overview.md` | 需要生成 API 接口概览时 |
| `reference/chapter-test.md` | 需要生成测试策略时 |
| `reference/chapter-issues.md` | 需要生成已知问题和后续优化时 |
| `reference/mermaid-checklist.md` | 需要检查 mermaid 语法时 |
| `reference/output-spec.md` | 需要了解输出位置和执行流程时 |
| `reference/final-checklist.md` | 生成完成后需要最终检查时 |

## Output format

生成的文档输出到 `docs/services/backend/{module-name}-YYYYMMDD.md`，包含以下章节：

1. **文档信息**：生成日期、模块路径、项目版本、代码分支
2. **模块概述**：模块职责、位置、依赖关系
3. **模块架构设计**：mermaid 架构分层图
4. **核心流程**：mermaid 序列图
5. **技术选型对比**：技术方案对比表格
6. **具体方案详述**：目录结构、核心组件职责、关键设计决策
7. **数据库设计与性能讲解**：涉及表、索引设计、性能优化
8. **分布式架构服务器配置**：服务器配置表格（如涉及）
9. **API 接口概览**：HTTP 接口列表
10. **测试策略**：单元测试、集成测试覆盖范围
11. **已知问题和后续优化**：问题列表、优化方向

## Validation

- [ ] 文档包含所有必需章节
- [ ] mermaid 图语法正确
- [ ] 技术选型决策有明确理由
- [ ] 数据库设计包含索引和性能优化说明
- [ ] API 接口列表完整
- [ ] 文件输出路径正确

## Constraints

- **面向未来回顾**：假设半年后看这份文档，能快速回忆起当时的设计思路和决策理由
- **必须包含图形**：生成 mermaid 图例可视化架构和流程
- **决策必须可见**：说明为什么选择这个方案，放弃了其他方案
- **后端专属**：专门针对 NestJS + Prisma 后端架构设计
- **完整覆盖需求**：必须覆盖架构图、技术选型、方案详述、数据库性能、服务器配置
- **按需加载**：只读取相关 reference 文件，不要一次性全部读取