---
name: common-frontend-module-doc
description: 使用此技能为前端模块生成完整的设计文档。当用户使用 `/frontend-module-doc [模块路径]` 命令时触发，适用于 React 19 + TypeScript + MobX + Ant Design Mobile 前端架构。不用于后端模块或非前端技术栈。
license: Complete terms in LICENSE.txt
---

# 前端模块功能介绍文档生成规范

## Overview

此技能为指定的前端模块生成完整的设计文档，输出到 `frontend/docs` 目录，用于日后回顾学习设计决策。文档包含 mermaid 架构图、数据流图、技术选型对比、状态管理设计、API 依赖说明等核心内容。

## When to use this skill

- 用户使用 `/frontend-module-doc [模块路径]` 命令时
- 需要为前端模块生成设计文档时
- 需要记录模块设计决策和架构说明时

## Inputs

- **模块路径**：必填，指向前端模块的相对路径，如 `apps/web/src/pages/article-list` 或 `apps/web/src/components/ProductCard`
- **项目上下文**：项目的 package.json、目录结构等

## Workflow

1. **解析参数**：获取用户指定的模块路径
2. **自动识别**：根据路径判断模块类型（`apps/web/src/pages/` → 页面级模块，`apps/web/src/components/` → 公共组件）
3. **确认存在**：检查路径是否存在，是否是前端模块
4. **探索代码**：读取模块目录结构、入口文件、Store、hooks、types 等源码
5. **提取信息**：提取技术选型决策点、Props 接口定义、API 接口定义、状态定义和核心方法
6. **填充模板**：按照 [templates/document-template.md](templates/document-template.md) 填充内容
7. **生成 mermaid 图**：按照 [templates/mermaid-templates.md](templates/mermaid-templates.md) 生成组件结构图和数据流图，检查语法
8. **创建目录**：如果 `frontend/docs` 目录不存在，先创建
9. **写入文件**：输出到 `frontend/docs/{module-name}-YYYYMMDD.md`
10. **反馈结果**：输出生成的文件路径，告知用户完成

## Resources

| 资源 | 何时使用 |
|------|----------|
| [reference/doc-specification.md](reference/doc-specification.md) | 需要了解文档规范、核心原则、必选章节和检查清单时 |
| [reference/mermaid-guidelines.md](reference/mermaid-guidelines.md) | 需要了解 Mermaid 颜色约定和语法检查规则时 |
| [templates/document-template.md](templates/document-template.md) | 生成文档时，作为文档结构模板 |
| [templates/mermaid-templates.md](templates/mermaid-templates.md) | 生成 mermaid 图表时，作为图表模板 |
| [examples/example-input.md](examples/example-input.md) | 需要参考输入格式和参数说明时 |
| [examples/example-output.md](examples/example-output.md) | 需要参考输出格式和结果反馈时 |

## Output format

输出文件必须写入 `frontend/docs/{module-name}-{YYYYMMDD}.md`：
- `module-name`: 从模块路径提取最后一级目录名作为模块名
- `YYYYMMDD`: 当前日期，便于版本追溯

文档结构参考 [templates/document-template.md](templates/document-template.md)，包含 12 个必选章节。

## Validation

生成完成后必须按照 [reference/doc-specification.md](reference/doc-specification.md) 中的检查清单进行验证：
- 是否正确识别模块类型
- 是否包含了所有必选章节
- 是否生成了 mermaid 组件结构图和数据流动序列图
- mermaid 语法是否通过检查清单
- 是否完成了技术选型对比表格
- 状态管理、API 依赖、样式方案等章节是否完整

## Constraints

- 专门针对 React 19 + TypeScript + MobX + Ant Design Mobile 前端架构设计
- 只处理前端模块，排除数据库、服务器配置等后端无关内容
- 输出路径固定为 `frontend/docs/`
- 文件命名格式必须符合 `{module-name}-{YYYYMMDD}.md`