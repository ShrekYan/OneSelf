# Figma 布局转 React JSX 规范

本文档定义如何将 Figma 的布局（Auto Layout、绝对定位等）转换为 React + JSX 结构，遵循项目的前端规范。

## Figma 布局类型识别

### Auto Layout（自动布局）
Figma 的 Auto Layout 对应 CSS Flexbox 布局。

**识别特征**：
- 节点有 `layoutMode` 属性（`"HORIZONTAL"` 或 `"VERTICAL"`）
- 有 `itemSpacing`（子元素间距）
- 有 `paddingLeft`、`paddingRight` 等内边距属性

### Absolute Positioning（绝对定位）
Figma 的绝对定位对应 CSS `position: absolute`。

**识别特征**：
- 节点有 `absoluteBoundingBox` 属性
- 子节点有 `absoluteRenderBounds` 相对于父节点的偏移

## Auto Layout → Flexbox 转换规则

### 基础转换映射

| Figma Auto Layout 属性 | CSS Flexbox 属性 | 说明 |
|----------------------|-----------------|------|
| `layoutMode: "HORIZONTAL"` | `flex-direction: row` | 水平排列 |
| `layoutMode: "VERTICAL"` | `flex-direction: column` | 垂直排列 |
| `itemSpacing` | `gap` | 子元素间距 |
| `paddingLeft/Right/Top/Bottom` | `padding` | 内边距 |
| `primaryAxisAlignItems: "MIN"` | `justify-content: flex-start` | 主轴起点对齐 |
| `primaryAxisAlignItems: "CENTER"` | `justify-content: center` | 主轴居中对齐 |
| `primaryAxisAlignItems: "MAX"` | `justify-content: flex-end` | 主轴终点对齐 |
| `primaryAxisAlignItems: "SPACE_BETWEEN"` | `justify-content: space-between` | 主轴两端对齐 |
| `counterAxisAlignItems: "MIN"` | `align-items: flex-start` | 交叉轴起点对齐 |
| `counterAxisAlignItems: "CENTER"` | `align-items: center` | 交叉轴居中对齐 |
| `counterAxisAlignItems: "MAX"` | `align-items: flex-end` | 交叉轴终点对齐 |
| `counterAxisAlignItems: "BASELINE"` | `align-items: baseline` | 交叉轴基线对齐 |

### 转换示例

#### Figma Auto Layout（垂直排列）
```
Frame (垂直 Auto Layout)
├── padding: 24px
├── spacing: 16px
└── 子元素...
```

**转换为 JSX + SCSS**：
```tsx
// index.tsx
<div className={styles.container}>
  <div className={styles.item}>...</div>
  <div className={styles.item}>...</div>
</div>
```

```scss
// index.module.scss
.container {
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
}
```

#### Figma Auto Layout（水平排列 + 居中对齐）
```
Frame (水平 Auto Layout)
├── alignment: center
├── spacing: 12px
└── 子元素...
```

**转换为 SCSS**：
```scss
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
```

## 绝对定位转换规则

### 何时使用绝对定位

**优先使用 Flexbox**，仅在以下场景使用绝对定位：
1. 重叠元素（如角标、徽章）
2. 浮动按钮（如回到顶部）
3. 无法用 Flexbox 表达的复杂布局

### 绝对定位转换示例

#### Figma 绝对定位
```
Frame (父容器)
├── position: absolute
├── x: 100, y: 50
└── 子元素...
```

**转换为 SCSS**：
```scss
.parentContainer {
  position: relative; // 父容器需要相对定位
}

.childElement {
  position: absolute;
  top: 50px;
  left: 100px;
}
```

## Figma 组件 → React 组件转换

### 识别可复用组件

在 Figma 设计中，以下元素应转换为独立组件：

1. **重复出现的 UI 模式**：如列表项、卡片、按钮
2. **Figma Component**：设计稿中定义为 Component 的节点
3. **Instance 变体**：同一组件的不同状态（如按钮的 primary/secondary 变体）

### 组件拆分原则

遵循项目的组件拆分规范：

| 组件类型 | 目录位置 | 示例 |
|---------|---------|------|
| 全局通用组件 | `apps/web/src/components/` | Button、Input、Modal |
| 页面私有组件 | `apps/web/src/pages/[Page]/components/` | 只在某页面使用的组件 |
| 业务模块组件 | `apps/web/src/components/` | 跨页面复用的业务组件 |

### 组件 Props 设计

从 Figma 组件的属性（Properties）中提取 Props：

```typescript
// Figma Component Properties → React Props
interface CardProps {
  title: string;        // Figma: Title property
  description?: string; // Figma: Description property (optional)
  imageUrl?: string;    // Figma: Image fill
  onClick?: () => void; // Figma: 交互行为
}
```

## JSX 结构生成规则

### 使用 Ant Design Mobile 组件

优先使用 Ant Design Mobile 组件，而不是从头实现：

| Figma 元素 | Ant Design Mobile 组件 | 说明 |
|-----------|----------------------|------|
| 按钮 | `Button` | 支持多种样式和大小 |
| 输入框 | `Input` / `TextArea` | 表单输入 |
| 列表 | `List` / `ListItem` | 列表展示 |
| 卡片 | `Card` | 卡片容器 |
| 弹窗 | `Modal` / `Popup` | 弹窗交互 |
| 标签页 | `Tabs` | 标签页切换 |
| 轮播 | `Swiper` | 图片轮播 |

### 语义化 HTML 标签

根据 Figma 设计选择合适的 HTML 标签：

| Figma 元素 | HTML 标签 | 说明 |
|-----------|----------|------|
| 文章标题 | `<h1>` - `<h6>` | 标题层级 |
| 段落文本 | `<p>` | 段落 |
| 列表 | `<ul>` / `<ol>` / `<li>` | 列表 |
| 链接 | `<a>` | 超链接 |
| 图片 | `<img>` | 图片 |
| 按钮 | `<button>` 或 Ant Design `Button` | 按钮 |
| 表单 | `<form>` | 表单容器 |

### 条件渲染

根据 Figma 的不同状态（如空状态、加载状态、错误状态）实现条件渲染：

```tsx
{isLoading ? (
  <Loading />
) : error ? (
  <ErrorFallback error={error} />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataList data={data} />
)}
```

## 响应式处理

### Figma 固定尺寸 → 响应式布局

Figma 设计稿通常是固定宽度（如 750px），需要转换为响应式：

```scss
// Figma: width: 750px (固定)
// 转换为响应式
.container {
  width: 100%;        // 或 max-width: 750px
  max-width: 750px;   // 最大宽度限制
  margin: 0 auto;     // 居中
  padding: 0 24px;    // 左右内边距
}
```

### 使用项目响应式方案

本项目基于 750px 设计稿，使用 px 单位，Vite 插件自动转换为 vw。

```scss
// 直接写 px，插件自动转换
.banner {
  width: 750px;   // 插件转换为 100vw
  height: 300px;  // 插件转换为 40vw
}
```

## 布局转换检查清单

在转换布局时，检查以下项目：

- [ ] Auto Layout 是否正确转换为 Flexbox？
- [ ] 间距（gap/padding/margin）是否符合设计稿？
- [ ] 对齐方式（justify-content/align-items）是否正确？
- [ ] 是否优先使用了 Ant Design Mobile 组件？
- [ ] HTML 标签是否语义化？
- [ ] 是否识别了可复用的组件并进行了拆分？
- [ ] 组件 Props 是否从 Figma 属性中提取？
- [ ] 是否处理了不同状态（加载/空/错误）的布局？
- [ ] 布局是否响应式（适配不同屏幕宽度）？
- [ ] 是否避免了不必要的绝对定位？
