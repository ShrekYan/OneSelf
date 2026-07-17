# 设计 Token 映射规则

本文档定义如何将 Figma 设计 token（颜色、字号、间距等）映射到项目的前端变量体系。

## 项目变量体系

本项目的前端变量定义在 `apps/web/src/styles/variables.scss`，包括：

### 颜色系统
- 主色：`$primary-color`
- 状态色：`$success-color`、`$warning-color`、`$error-color`
- 文本色：`$text-color`、`$text-color-secondary`、`$text-color-light`
- 背景色：`$bg-color`、`$bg-color-light`
- 边框色：`$border-color`

### 字体层级
- 大标题：`$font-size-xxl`（36px）
- 标题：`$font-size-xl`（32px）
- 副标题：`$font-size-lg`（28px）
- 正文：`$font-size-md`（28px）
- 辅助文本：`$font-size-sm`（24px）
- 小文本：`$font-size-xs`（20px）

### 间距系统（8px 网格）
- `$spacing-xs`（8px）
- `$spacing-sm`（16px）
- `$spacing-md`（24px）
- `$spacing-lg`（32px）
- `$spacing-xl`（48px）

### 圆角系统
- `$border-radius-sm`（8px）
- `$border-radius-md`（16px）
- `$border-radius-lg`（24px）
- `$border-radius-round`（50%）

## Figma Token 映射规则

### 颜色映射

#### 策略 1：优先使用项目变量
如果 Figma 颜色值与项目变量值一致（或非常接近），**必须**使用项目变量而不是硬编码。

```scss
// ✅ 正确：使用项目变量
.color-text {
  color: $text-color;
}

// ❌ 错误：硬编码（即使值一样）
.color-text {
  color: #333333;
}
```

#### 策略 2：Figma 变量映射
如果 Figma 使用了 Design Variables，按以下规则映射：

| Figma 变量名 | 项目变量 | 说明 |
|-------------|---------|------|
| `color/primary` | `$primary-color` | 主色 |
| `color/success` | `$success-color` | 成功色 |
| `color/warning` | `$warning-color` | 警告色 |
| `color/error` | `$error-color` | 错误色 |
| `color/text/primary` | `$text-color` | 主要文本 |
| `color/text/secondary` | `$text-color-secondary` | 次要文本 |
| `color/bg/primary` | `$bg-color` | 主要背景 |

#### 策略 3：无对应变量时的处理
如果 Figma 颜色在项目变量中没有对应值：
1. 优先检查是否可以使用现有变量的变体（如透明度）
2. 如果必须硬编码，使用 RGB 格式并添加注释说明来源

```scss
// Figma: #FF6B6B (设计稿特定红色)
.special-text {
  color: rgb(255, 107, 107);
}
```

### 字号映射

#### Figma 字号 → 项目变量映射表

| Figma 字号 | 项目变量 | 说明 |
|-----------|---------|------|
| 20px | `$font-size-xs` | 小文本 |
| 24px | `$font-size-sm` | 辅助文本 |
| 28px | `$font-size-md` | 正文 |
| 28px | `$font-size-lg` | 副标题 |
| 32px | `$font-size-xl` | 标题 |
| 36px | `$font-size-xxl` | 大标题 |

#### 特殊情况处理
- 如果 Figma 字号与项目变量都不匹配，使用最接近的变量
- 禁止为了完全匹配 Figma 而新增项目变量（除非设计系统确实需要）

### 间距映射

#### Figma padding/margin/gap → 项目变量

| Figma 值 | 项目变量 | 说明 |
|---------|---------|------|
| 8px | `$spacing-xs` | 最小间距 |
| 16px | `$spacing-sm` | 小间距 |
| 24px | `$spacing-md` | 中间距 |
| 32px | `$spacing-lg` | 大间距 |
| 48px | `$spacing-xl` | 最大间距 |

#### 注意事项
- Figma 的 Auto Layout gap 对应 CSS `gap` 属性
- Figma 的 padding 对应 CSS `padding` 属性
- 如果 Figma 间距值不是 8 的倍数，向上取整到最近的 8px 网格值

### 圆角映射

| Figma cornerRadius | 项目变量 | 说明 |
|-------------------|---------|------|
| 0px | 0 | 直角 |
| 8px | `$border-radius-sm` | 小圆角 |
| 16px | `$border-radius-md` | 中圆角 |
| 24px | `$border-radius-lg` | 大圆角 |
| 999px 或 50% | `$border-radius-round` | 圆形 |

### 字重映射

| Figma fontWeight | CSS font-weight | 说明 |
|-----------------|----------------|------|
| 300 | 300 | Light |
| 400 | 400 | Regular |
| 500 | 500 | Medium |
| 600 | 600 | Semi Bold |
| 700 | 700 | Bold |
| 800 | 800 | Extra Bold |

## 单位换算

### Figma 像素 → CSS 像素
- Figma 设计稿通常使用 1x 或 2x 尺寸
- 本项目基于 750px 设计稿，直接使用 px 单位
- Vite 插件会自动将 px 转换为 vw

```scss
// Figma: width: 750px (设计稿宽度)
// 代码：直接写 px，插件自动转换
.container {
  width: 750px; // 插件会转换为 100vw
}
```

### 特殊处理
- **字体大小**：直接使用 Figma 的 fontSize 值（px）
- **行高**：如果 Figma 使用百分比，转换为数值（如 150% → 1.5）
- **透明度**：Figma opacity 直接使用（0-1 数值）

## 映射检查清单

在转换设计 token 时，检查以下项目：

- [ ] 颜色是否优先使用了项目变量？
- [ ] 字号是否使用了项目字体层级变量？
- [ ] 间距是否符合 8px 网格系统？
- [ ] 圆角是否使用了项目圆角变量？
- [ ] 单位是否正确（px 而不是 rem/em）？
- [ ] 是否有硬编码值可以用变量替代？
- [ ] 是否添加了必要的注释说明设计稿来源？
