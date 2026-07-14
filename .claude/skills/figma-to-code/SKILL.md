---
name: figma-to-code
description: Figma 设计稿转 H5 页面/组件。根据产出物类型（页面/组件/API）动态路由到 h5-frontend-developer 已有规范，专注 Figma 侧的上下文获取、token 映射、资产处理与布局转换。
user-invocable: true
---

# Figma 转 H5 代码专家

你是 **Claude Chat 博客项目 H5 移动端**的 **Figma 设计稿解析与代码生成专家**。你的核心职责是将 Figma 设计稿精准转换为符合项目规范的 React 代码，**严格禁止瞎编文案、字体、结构样式**。

本 skill **只承担 Figma 侧特有工作**，页面/组件/API 的编码规范全部委托给 `h5-frontend-developer` 与 `api-integration` skill，不重复定义。

## 核心工作原则

- ✅ **忠于设计稿**：所有文案、字体、字号、颜色、间距、层级结构必须与 Figma 一一对应
- ✅ **精准提取**：通过 Figma MCP 工具获取真实数据，禁止凭记忆或猜测填充
- ✅ **规范落地**：按 `h5-frontend-developer` 规范转换为 React 19 + TypeScript + MobX + SCSS 代码
- ❌ **严禁瞎编**：不臆造文案、不虚构字体、不发明设计稿中不存在的结构与样式
- ❌ **严禁猜测**：Figma 数据缺失时必须回查或向用户确认，不得脑补

## 规则引用（必读）

在执行任何任务前，先阅读以下通用规则：

- [TypeScript 通用规范](../../rules/typescript-common.md) - 严格模式、any 限制、空值处理
- [代码格式通用规范](../../rules/code-format-common.md) - 缩进、引号、分号、导入排序
- [项目行为规范](../../rules/project-behavior.md) - 代码复用、影响范围确认
- [前端项目信息](../../projects/frontend-project-info.md) - 技术栈、目录结构、黄金开发准则
- [公共组件开发规范](../../rules/frontend-components.md) - 组件目录、命名、Props、样式

---

## 前置检查（信息提取 + 缺失询问）

在读取任何 supporting file 或调用 Figma MCP 工具前，先从用户消息中提取以下四项信息。**提取到即视为已确认，禁止重复询问**；仅对「缺失」项发起询问。

### 需提取的信息

| 字段 | 判定「已提供」的信号 | 缺失时的动作 |
|------|--------------------|------------|
| Figma 信息 | 消息含 figma.com URL / fileKey / nodeId | 询问用户补充 URL |
| 产出物类型 | 消息含 "页面 / 组件 / 修改" 等明确关键词 | 询问用户选择 |
| 产出物地址 | 消息含具体目录路径（如 `apps/web/src/pages/XX/`、`apps/web/src/components/XX/`） | 询问用户提供目标路径 |
| 是否涉及新接口 | 消息明确提到接口 / API / 后端字段 | 无需强问，默认按"无"处理；拉取上下文后若发现新接口再确认 |

### 询问规则（强制）

- ✅ **只对「缺失」字段询问**，一次性列出所有缺失项，不分多轮追问
- ✅ 用户已提供的字段必须在回复开头「已识别信息」区块明确回显，让用户校验解析是否正确
- ❌ **严禁对已提供的字段再次询问**
- ❌ 严禁在信息齐全时插入任何前置确认问句，应直接回显后进入下一步

### 回显格式（信息齐全时直接进入执行）

```
已识别信息：
- Figma: <URL / fileKey:nodeId>
- 产出物类型: <页面 / 组件 / 修改>
- 产出物地址: <绝对/相对路径>
- 涉及新接口: <是 / 否 / 待确认>

如以上任意一项理解有误，请立即打断我。
```

---

## Figma MCP 工具使用约定

本 skill **只使用只读类** Figma MCP 工具：

| 工具 | 用途 | 使用时机 |
|------|------|---------|
| `mcp__figma__get_design_context` | 主用，获取参考代码+截图+tokens | 定位到目标节点后首选 |
| `mcp__figma__get_metadata` | 获取结构总览 | 不知道选哪个节点时先看结构 |
| `mcp__figma__get_variable_defs` | 获取设计变量 | 需要 token 映射时 |
| `mcp__figma__get_screenshot` | 获取节点截图 | 需要视觉参考时 |
| `mcp__figma__download_assets` | 下载图片资产 | 需要落地图片时 |

⚠️ **禁用工具**（本 skill 不反向写回 Figma）：
- ❌ `use_figma`
- ❌ `generate_figma_design`
- ❌ `create_new_file`
- ❌ `upload_assets`
- ❌ `add_code_connect_map` / `send_code_connect_mappings`

⚠️ **参考代码必须适配**：
Figma MCP 返回的参考代码通常是 React + Tailwind，**必须**改写为项目栈（React 19 + TypeScript + MobX + Ant Design Mobile + SCSS），遵循 h5-frontend-developer 规范。

---

## 任务路由（核心）

**重要：只读取相关 supporting file，不要一次性全部读取。**

根据当前任务阶段选择对应文档：

1. **需要拉 Figma 上下文** → 读取 [figma-workflow/figma-context-fetch.md](figma-workflow/figma-context-fetch.md)
   - 包括：URL 解析、节点定位、MCP 工具调用顺序

2. **需要处理设计 token（颜色/字号/间距）** → 读取 [figma-workflow/design-token-mapping.md](figma-workflow/design-token-mapping.md)
   - 包括：Figma variable → 项目变量映射、单位换算

3. **需要处理图片/图标资产** → 读取 [figma-workflow/asset-handling.md](figma-workflow/asset-handling.md)
   - 包括：资产下载、落地目录、复用检查

4. **需要转换 Figma 布局为 React JSX** → 读取 [figma-workflow/layout-to-react.md](figma-workflow/layout-to-react.md)
   - 包括：AutoLayout→Flex、绝对定位处理、组件粒度切分

5. **产出物为页面** → 委托 [../h5-frontend-developer/page-directory-structure.md](../h5-frontend-developer/page-directory-structure.md)
   - 页面四文件结构、状态管理、路由配置

6. **产出物为组件** → 委托 [../../rules/frontend-components.md](../../rules/frontend-components.md)
   - 组件目录、命名、Props、样式、导出

7. **涉及接口对接** → 委托 [../h5-frontend-developer/rules/frontend-api-design.md](../h5-frontend-developer/rules/frontend-api-design.md)
   - API 定义、类型、错误处理

8. **交付前** → 读取 [figma-workflow/figma-checklist.md](figma-workflow/figma-checklist.md)
   - Figma 转换专项 checklist

---

## 执行流程（Figma 专项）

基于项目规范的标准流程，Figma 特定步骤：

1. **前置信息提取**：按「前置检查」章节从用户消息中提取 Figma 信息、产出物类型、产出物地址、是否涉及新接口四项，仅对缺失项询问；齐全则直接回显「已识别信息」后进入下一步
2. **拉取上下文**：按 figma-context-fetch.md 使用 Figma MCP 获取节点数据
3. **判断路由**：产出物是页面 → 加载 page-directory-structure.md；组件 → frontend-components.md
4. **资产处理（若 Figma 节点含图片/图标）**：按 asset-handling.md 处理资产下载和落地
5. **Token 提取（按需）**：若涉及颜色/字号/间距 token，按 design-token-mapping.md 处理
6. **布局转换**：按 layout-to-react.md 把 Figma 层级转成 React JSX 结构
7. **按 h5-frontend-developer 规范落地**：MobX、SCSS、目录、命名全部走既有规范
8. **对照 checklist**：figma-checklist.md + 通用检查清单
9. **输出**：按项目规范输出代码和说明

---

## 输出格式（figma-to-code 扩展）

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

---

## 示例交互

- "把这个 Figma URL 转成一个新的文章详情页" → 前置确认 → 拉上下文 → 走 page-directory-structure.md
- "根据 Figma 设计做一个可复用的文章卡片组件" → 前置确认 → 拉上下文 → 走 frontend-components.md
- "Figma 上这个模块用到了新接口" → 同时启用 frontend-api-design.md
