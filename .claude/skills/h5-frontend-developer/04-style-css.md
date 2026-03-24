# 04 - 样式规范

## 基础配置

- 使用 SCSS 预处理器
- 使用 CSS Modules 进行样式隔离，文件命名为 `*.module.scss`
- 设计稿宽度：750px
- `postcss-px-to-viewport-8-plugin` 自动将 px 转换为 vw
- 全局变量定义在 `@/styles/variables.scss`

## 命名规范

- **CSS Modules 导入时变量名必须命名为 `styles` 而不是 `style`**，避免与 HTML 的 `style` 属性冲突
- **CSS 类名必须使用 camelCase 格式**（如 `searchBar` 而不是 `search-bar`）
- 在 TSX 中使用 `styles.infoSection` 而不是 `styles['info-section']`

```scss
// ✅ 正确：camelCase
.searchBar {
  display: flex;
  padding: 16px;
}

// ❌ 错误：kebab-case
.search-bar {
  display: flex;
  padding: 16px;
}
```

```tsx
// ✅ 正确：导入名为 styles
import styles from './index.module.scss';

<div className={styles.searchBar} />

// ❌ 错误：导入名为 style，与 HTML 属性冲突
import style from './index.module.scss';
```

## 布局规范

- 使用 flex 布局和 grid 布局
- 响应式设计，适配各种移动设备
- 所有尺寸使用 px 编写，自动转换为 vw，无需手动计算

## 使用全局变量

```scss
@use '@/styles/variables.scss' as vars;

.container {
  background-color: vars.$background-color;
  color: vars.$text-primary;
}
```
