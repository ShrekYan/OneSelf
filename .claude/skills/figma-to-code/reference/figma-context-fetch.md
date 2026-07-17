# Figma 上下文获取流程

本文档定义如何从 Figma 设计稿中精准提取上下文信息，包括 URL 解析、节点定位、MCP 工具调用顺序。

## URL 解析规则

Figma URL 格式：`https://www.figma.com/design/{fileKey}/{fileName}?node-id={nodeId}`

### 提取步骤

1. **解析 fileKey**：从 URL 路径中提取 `/design/` 后的字符串，到下一个 `/` 之前
   - 示例：`https://www.figma.com/design/abc123/My-Design?node-id=1:2` → fileKey = `abc123`

2. **解析 nodeId**：从 URL 参数中提取 `node-id` 值，将 `-` 替换为 `:`
   - 示例：`node-id=1-2` → nodeId = `1:2`

3. **处理特殊情况**：
   - 如果 URL 没有 `node-id` 参数，需要先调用 `mcp__figma__get_metadata` 获取文件结构，让用户选择节点
   - 如果 nodeId 包含 `%3A`（URL 编码的 `:`），需要解码为 `:`

## MCP 工具调用顺序

### 场景 1：用户提供了完整的 Figma URL（含 node-id）

```
1. 解析 URL 提取 fileKey 和 nodeId
2. 调用 mcp__figma__get_design_context(fileKey, nodeId)
   - 获取参考代码、截图、tokens
3. 如需更详细的结构信息，调用 mcp__figma__get_metadata(fileKey, nodeId)
4. 如需设计变量，调用 mcp__figma__get_variable_defs(fileKey, nodeId)
```

### 场景 2：用户只提供了 fileKey 或 URL（不含 node-id）

```
1. 调用 mcp__figma__get_metadata(fileKey)
   - 获取文件结构总览
2. 展示页面/节点列表，让用户选择目标节点
3. 用户选择后，按场景 1 流程执行
```

### 场景 3：需要视觉参考

```
1. 按场景 1 或 2 获取基础数据
2. 调用 mcp__figma__get_screenshot(fileKey, nodeId)
   - 获取节点截图，用于视觉确认
```

## 节点定位策略

### 如何选择合适的节点

1. **优先选择组件或 Frame**：直接对应页面或组件的节点
2. **避免选择整个页面**：如果 Figma 页面包含多个模块，选择具体模块节点
3. **避免选择过细的叶子节点**：至少选择包含完整布局逻辑的容器节点

### 节点类型判断

| Figma 节点类型 | 对应产出物 | 处理方式 |
|---------------|-----------|---------|
| Frame / Group | 页面或组件容器 | 作为根节点转换 |
| Component | 可复用组件 | 按组件规范处理 |
| Instance | 组件实例 | 按实例属性覆盖处理 |
| Text | 文本节点 | 提取文案和样式 |
| Rectangle / Vector | 图形节点 | 处理为背景或图标 |

## 数据提取清单

从 Figma MCP 返回的数据中提取以下信息：

### 结构信息
- [ ] 节点层级关系（父子关系）
- [ ] 节点类型（Frame / Text / Component / Instance）
- [ ] 节点名称（用于生成代码注释）

### 样式信息
- [ ] 布局方式（Auto Layout / 绝对定位）
- [ ] 尺寸（width / height）
- [ ] 间距（padding / margin / gap）
- [ ] 背景色（fills）
- [ ] 边框（strokes）
- [ ] 圆角（borderRadius）
- [ ] 阴影（effects）
- [ ] 透明度（opacity）

### 文本信息
- [ ] 文案内容（characters）
- [ ] 字体家族（fontFamily）
- [ ] 字号（fontSize）
- [ ] 字重（fontWeight）
- [ ] 行高（lineHeight）
- [ ] 字间距（letterSpacing）
- [ ] 文本对齐（textAlignHorizontal）

### 资产信息
- [ ] 图片节点（imageRef）
- [ ] 图标节点（vector 类型）
- [ ] SVG 内容（如有）

## 注意事项

1. **数据缺失处理**：如果 Figma 返回的数据缺少关键信息，必须向用户确认，不得猜测
2. **组件变体处理**：如果节点是 Component Instance 且有变体属性，需要提取变体值
3. **响应式考虑**：Figma 设计稿通常是固定尺寸，需要转换为响应式布局
4. **设计 token 优先**：如果 Figma 使用了变量（Variables），优先使用变量值而不是硬编码值
