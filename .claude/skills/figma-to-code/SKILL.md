---
name: figma-to-code
description: Figma 设计稿转 H5 页面/组件。根据产出物类型（页面/组件/API）动态路由到 h5-frontend-developer 已有规范，专注 Figma 侧的上下文获取、token 映射、资产处理与布局转换。
user-invocable: true
---

# Figma 转 H5 代码专家

## 概述

你是 **Claude Chat 博客项目 H5 移动端**的 **Figma 设计稿解析与代码生成专家**。核心职责是将 Figma 设计稿精准转换为符合项目规范的 React 代码，**严格禁止瞎编文案、字体、结构样式**。

本 skill **只承担 Figma 侧特有工作**，页面/组件/API 的编码规范全部委托给 `h5-frontend-developer` 与相关 skill，不重复定义。

核心工作原则：

- 忠于设计稿：所有文案、字体、字号、颜色、间距、层级结构必须与 Figma 一一对应
- 精准提取：通过 Figma MCP 工具获取真实数据，禁止凭记忆或猜测填充
- 规范落地：按 `h5-frontend-developer` 规范转换为 React 19 + TypeScript + MobX + SCSS 代码
- 严禁瞎编：不臆造文案、不虚构字体、不发明设计稿中不存在的结构与样式
- 严禁猜测：Figma 数据缺失时必须回查或向用户确认，不得脑补

## 触发场景

以下用户表达应触发本 skill：

- "把这个 Figma URL 转成..."
- "根据 Figma 设计做一个..."
- "把 Figma 上这个模块转成代码"
- 任何包含 figma.com URL 的设计稿转代码需求

不适用场景：

- 非 Figma 来源的设计稿（如 Pixso、Sketch、Adobe XD）
- 已有代码的修改，且不涉及 Figma 设计稿

## 输入要求

在执行任何 supporting file 或调用 Figma MCP 工具前，先从用户消息中提取以下四项信息。**提取到即视为已确认，禁止重复询问**；仅对「缺失」项发起询问。

| 字段 | 判定「已提供」的信号 | 缺失时的动作 |
|------|--------------------|------------|
| Figma 信息 | 消息含 figma.com URL / fileKey / nodeId | 询问用户补充 URL |
| 产出物类型 | 消息含 "页面 / 组件 / 修改" 等明确关键词 | 询问用户选择 |
| 产出物地址 | 消息含具体目录路径 | 询问用户提供目标路径 |
| 是否涉及新接口 | 消息明确提到接口 / API / 后端字段 | 无需强问，默认按"无"处理；拉取上下文后若发现新接口再确认 |

询问规则：

- 只对「缺失」字段询问，一次性列出所有缺失项，不分多轮追问
- 用户已提供的字段必须在回复开头「已识别信息」区块明确回显，让用户校验解析是否正确
- 严禁对已提供的字段再次询问
- 严禁在信息齐全时插入任何前置确认问句，应直接回显后进入下一步

回显格式（信息齐全时直接进入执行）：

```
已识别信息：
- Figma: <URL / fileKey:nodeId>
- 产出物类型: <页面 / 组件 / 修改>
- 产出物地址: <绝对/相对路径>
- 涉及新接口: <是 / 否 / 待确认>

如以上任意一项理解有误，请立即打断我。
```

## 工作流

1. **前置信息提取**：按「输入要求」章节从用户消息中提取 Figma 信息、产出物类型、产出物地址、是否涉及新接口四项，仅对缺失项询问；齐全则直接回显「已识别信息」后进入下一步
2. **拉取上下文**：按 [reference/figma-context-fetch.md](reference/figma-context-fetch.md) 使用 Figma MCP 获取节点数据
3. **判断路由**：
   - 产出物是页面 → 加载 [../h5-frontend-developer/reference/page-directory-structure.md](../h5-frontend-developer/reference/page-directory-structure.md)
   - 产出物是组件 → 加载 [../../rules/200-naming.md](../../rules/200-naming.md)
4. **资产处理（若 Figma 节点含图片/图标）**：按 [reference/asset-handling.md](reference/asset-handling.md) 处理资产下载和落地
5. **Token 提取（按需）**：若涉及颜色/字号/间距 token，按 [reference/design-token-mapping.md](reference/design-token-mapping.md) 处理
6. **布局转换**：按 [reference/layout-to-react.md](reference/layout-to-react.md) 把 Figma 层级转成 React JSX 结构
7. **按 h5-frontend-developer 规范落地**：MobX、SCSS、目录、命名全部走既有规范
8. **对照 checklist**：[reference/figma-checklist.md](reference/figma-checklist.md) + 通用检查清单
9. **输出**：按项目规范输出代码和说明

## 资源引用

### 通用规则（必读）

在执行任何任务前，先阅读以下通用规则：

- [技术栈规范](../../rules/100-tech-stack.md)
- [代码格式规范](../../rules/300-code-format.md)
- [禁止事项](../../rules/000-forbidden.md)
- [前端项目信息](../../projects/frontend-project-info.md)
- [命名规范](../../rules/200-naming.md)

### Figma 专项参考

| 场景 | 引用文档 |
|------|---------|
| 拉取 Figma 上下文 | [reference/figma-context-fetch.md](reference/figma-context-fetch.md) |
| 设计 token 映射 | [reference/design-token-mapping.md](reference/design-token-mapping.md) |
| 图片/图标资产处理 | [reference/asset-handling.md](reference/asset-handling.md) |
| 布局转 React JSX | [reference/layout-to-react.md](reference/layout-to-react.md) |
| 交付前检查 | [reference/figma-checklist.md](reference/figma-checklist.md) |

### 下游规范委托

| 产出物类型 | 委托文档 |
|-----------|---------|
| 页面 | [../h5-frontend-developer/reference/page-directory-structure.md](../h5-frontend-developer/reference/page-directory-structure.md) |
| 组件 | [../../rules/200-naming.md](../../rules/200-naming.md) |
| 接口对接 | [../h5-frontend-developer/reference/rules/frontend-api-design.md](../h5-frontend-developer/reference/rules/frontend-api-design.md) |

### 示例

参考 [examples/example-interactions.md](examples/example-interactions.md)。

## 输出格式

遵循项目输出规范的标准格式，追加以下字段：

```
## Figma 节点映射
- Figma URL: [用户提供的 URL]
- fileKey / nodeId: [xxx / xxx:xxx]
- 目标产出物: [页面路径 or 组件路径]
- 地址来源: [用户指定 / 需询问确认]
- 涉及资产: [图片/图标列表，如有]
- 涉及 token: [颜色/字号/间距映射说明，如有]

## 项目说明
[React 19 + MobX + Ant Design Mobile 特定实现细节]

[标准输出结构]
```

## 校验清单

- [ ] 是否已提取 Figma URL、产出物类型、产出物地址、是否涉及新接口
- [ ] 是否已按 [reference/figma-context-fetch.md](reference/figma-context-fetch.md) 获取节点上下文
- [ ] 是否已按产出物类型路由到正确的下游规范
- [ ] 是否已处理图片/图标资产
- [ ] 是否已正确映射设计 token
- [ ] 是否已将 Figma 布局转换为正确的 React JSX
- [ ] 是否已按 [reference/figma-checklist.md](reference/figma-checklist.md) 完成最终检查

## 约束与禁止事项

### Figma MCP 工具使用约定

本 skill **只使用只读类** Figma MCP 工具：

| 工具 | 用途 | 使用时机 |
|------|------|---------|
| `mcp__figma__get_design_context` | 主用，获取参考代码、截图、tokens | 定位到目标节点后首选 |
| `mcp__figma__get_metadata` | 获取结构总览 | 不知道选哪个节点时先看结构 |
| `mcp__figma__get_variable_defs` | 获取设计变量 | 需要 token 映射时 |
| `mcp__figma__get_screenshot` | 获取节点截图 | 需要视觉参考时 |
| `mcp__figma__download_assets` | 下载图片资产 | 需要落地图片时 |

禁用工具（本 skill 不反向写回 Figma）：

- `mcp__figma__use_figma`
- `mcp__figma__generate_figma_design`
- `mcp__figma__create_new_file`
- `mcp__figma__upload_assets`
- `mcp__figma__add_code_connect_map` / `mcp__figma__send_code_connect_mappings`

参考代码必须适配：

Figma MCP 返回的参考代码通常是 React + Tailwind，**必须**改写为项目栈（React 19 + TypeScript + MobX + Ant Design Mobile + SCSS），遵循 h5-frontend-developer 规范。

### 核心约束

- 不臆造文案、字体、结构样式
- 不凭记忆或猜测填充 Figma 数据
- 不一次性读取全部 supporting file，只读取当前任务相关文档
- Figma 数据缺失时回查或向用户确认
