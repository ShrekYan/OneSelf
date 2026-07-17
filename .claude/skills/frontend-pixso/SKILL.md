---
name: frontend-pixso
description: Use this skill when the user wants to fetch Pixso design drafts and generate React + TypeScript + SCSS code. Triggers include "/pixso", "Pixso", "设计稿", "代码生成". Do NOT use for non-Pixso design tools or backend code generation.
license: Complete terms in LICENSE.txt
---

# Pixso 设计稿获取与代码生成

## Overview

本 skill 通过 Pixso MCP 服务获取设计稿 DSL，自动处理各种错误场景（包括大结果 token 超限），并生成符合项目规范的 React + TypeScript + SCSS 代码。

## When to use this skill

使用场景：
- 用户输入 `/pixso <fileKey> [nodeId]` 命令
- 用户请求从 Pixso 获取设计稿并生成前端代码
- 用户需要处理 Pixso 设计稿的代码转换

不适用场景：
- 使用其他设计工具（如 Figma）
- 后端代码生成
- 纯文档处理任务

## Inputs

- `fileKey`：Pixso 设计稿的文件标识
- `nodeId`（可选）：目标节点 ID，不指定则获取整个设计稿

## Workflow

1. **参数校验**：验证 fileKey 和 nodeId 参数格式
2. **调用 MCP**：调用 `get_node_dsl` 获取设计稿 DSL
3. **错误分类**：根据返回结果进行错误分类处理
4. **DSL 解析**：解析 DSL 并打印完整树结构
5. **尺寸缩放**：将所有尺寸缩放到 750px 基准
6. **结构核对**：逐节点核对结构、顺序、尺寸、颜色、字体
7. **组件拆分**：规划组件拆分方案
8. **代码生成**：生成 TSX + SCSS 代码
9. **对照检查**：使用检查清单逐项核对
10. **交付结果**：提示用户审查生成的代码

## Resources

| 资源 | 何时使用 |
|------|----------|
| `reference/error-handling.md` | 调用 MCP 失败时加载，获取错误分类策略和处理方式 |
| `reference/dsl-parsing.md` | 解析 DSL 时加载，获取完整解析流程和缩放规则 |
| `reference/checklist.md` | 代码生成完成后加载，逐项验证生成结果 |
| `reference/layout-patterns.md` | 实现布局时加载，获取常见陷阱与正确做法 |
| `examples/workflow.md` | 需要了解完整工作流程时加载 |
| `examples/usage-examples.md` | 需要参考使用示例时加载 |
| `scripts/print-dsl-tree.py` | 打印 DSL 树结构时调用 |

**外部资源**：
- [H5 frontend developer skill](../h5-frontend-developer/SKILL.md)

## Output Format

生成的代码结构：
1. React 组件文件（`.tsx`）
2. SCSS 样式文件（`.module.scss`）
3. 组件类型定义（`.ts`）
4. 代码审查提示

## Validation

- [ ] 是否正确调用 Pixso MCP 获取 DSL
- [ ] 是否按错误处理规则处理异常情况
- [ ] 是否打印完整 DSL 树结构
- [ ] 是否正确缩放到 750px 基准
- [ ] 是否按检查清单逐项验证代码

## Constraints

- 只处理 Pixso 设计稿，不支持其他设计工具
- 必须遵循 React + TypeScript + MobX + SCSS Modules 规范
- 必须遵循 750px 设计稿、px 自动转 vw、禁止手写 vw
- 必须先打印完整树结构，再写代码，禁止凭经验猜测

## 实现模块

- [error-handler.ts](../impl/pixso/error-handler.ts) - 错误分类与检测
- [large-file-reader.ts](../impl/pixso/large-file-reader.ts) - 大文件分块读取
- [dsl-parser.ts](../impl/pixso/dsl-parser.ts) - DSL 解析 + 尺寸缩放
- [dsl-writer.ts](../impl/pixso/dsl-writer.ts) - 安全写入 DSL（解决引号转义问题）
- [bin/write-dsl.cjs](../impl/pixso/bin/write-dsl.cjs) - 命令行写入入口
- [index.ts](../impl/pixso/index.ts) - 入口整合