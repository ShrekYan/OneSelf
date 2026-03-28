# CSS / SCSS 样式开发规范

本文档定义项目中 CSS/SCSS 的编写规范，基于 **CSS Modules + SCSS** 技术栈。

---

## 基础规则

### 文件命名
- 样式文件必须命名为 `index.module.scss`
- 放在组件/页面目录下，和 `index.tsx` 同级

### 选择器命名
- **class 选择器：必须使用 camelCase**（SCSS 源码和 TS 引用一致）
- 禁止使用 ID 选择器 (`#id`)
- 禁止使用标签选择器直接全局样式

```scss
// ✅ 正确
.searchBar {
  .searchInput {
    // ...
  }
}

// ❌ 错误
.search-bar {
  // kebab-case 已废弃
}

#search-bar {
  // ID 选择器禁止使用
}
```

### 根容器命名特殊规则

为了避免 `.container` 过度复用导致搜索结果污染，**每个组件/页面的根容器必须使用组件前缀命名**：

| 场景 | 所在目录 | 根容器命名规则 | 示例 |
|------|----------|---------------|------|
| **页面根容器** | `src/pages/[PageName]/` | `{pageName}Container` | `About` → `.aboutContainer` |
| **页面内子组件** | `src/pages/.../components/[ComponentName]/` | `{componentName}Container` | `ArticleListItem` → `.articleListItemContainer` |
| **全局公共组件** | `src/components/[ComponentName]/` | `{componentName}Container` | `LazyImage` → `.lazyImageContainer` |
| **Discover 分页** | `src/pages/Discover/routes/[RouteName]/` | `{routeName}Container` | `profile` → `.profileContainer` |

**规则细节**：
1. 只有根容器需要遵循此规则，内部元素保持原有灵活命名规则不变
2. 大小写转换：PascalCase 目录 → 首字母小写 camelCase
   - `ArticleListItem` → `articleListItemContainer`
   - `bottom-nav` (kebab-case) → `bottomNavContainer`
3. 完全兼容现有规范：依然是 camelCase，不违反当前 CSS/SCSS 规范
4. 渐进式迁移：新建文件必须遵守，旧文件逐步修改

```scss
// ✅ 正确 - About 页面根容器
.aboutContainer {
  padding: 16px;
}
```

```tsx
// TSX 引用方式不变
import styles from './index.module.scss';

<div className={styles.aboutContainer}>
  {/* 内容 */}
</div>
```

### CSS 属性顺序
推荐按以下顺序编写，提高可读性：
1. 位置属性 (`position`, `top`, `left`, `right`, `bottom`, `z-index`)
2. 盒模型 (`display`, `flex`, `width`, `height`, `padding`, `margin`, `border`)
3. 文字排版 (`font`, `font-size`, `font-weight`, `line-height`, `color`, `text-align`)
4. 视觉效果 (`background`, `border-radius`, `box-shadow`, `opacity`)
5. 动画 (`transition`, `animation`)

---

## 移动端适配规范

### 单位规则
- **设计稿基于 750px 宽度**
- 直接使用 `px` 编写，由 `postcss-px-to-viewport` 自动转换为 `vw`
- **禁止手动使用 `vw`/`vh`/`%` 除非特殊场景**

```scss
// ✅ 正确
font-size: 28px;
padding: 20px 16px;

// ❌ 错误
font-size: 10vw;
```

### 交互规范
- 点击区域最小尺寸：**≥ 44px × 44px**（移动端触摸要求）
- 按钮需要点击反馈（`:active` 透明度变化）
- 适配安全区域（`env(safe-area-inset-bottom)` 等）

```scss
// ✅ 示例
.button {
  min-height: 88px;
  padding-bottom: env(safe-area-inset-bottom);

  &:active {
    opacity: 0.8;
  }
}
```

---

## SCSS 使用规范

### @import 顺序
> **重要**: `$variables` 和 `mixins` 已经通过 `additionalData` 在全局注入，**不需要手动 import**，直接使用即可！

如果需要导入其他 SCSS 文件，按以下顺序：
1. 全局变量（已自动注入，无需导入）
2. 工具混入（已自动注入，无需导入）
3. 其他局部导入

### 嵌套规则
- 嵌套深度不超过 **3 层**
- 使用 `&` 伪类和修饰符

```scss
// ✅ 正确
.card {
  padding: 16px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.active {
    background-color: #f0f0f0;
  }

  .header {
    // 第二层
    .title {
      // 第三层 - 不要再深了
    }
  }
}
```

<!-- ### 变量使用
- 颜色使用全局变量 `$color-primary` 等
- 不要在局部硬编码颜色值
- 间距、圆角也使用全局变量

--- -->

## CSS Modules

### 导入方式
```tsx
import styles from './index.module.scss';

// ✅ 正确
<div className={styles.container}>

// ❌ 错误
<div className="container">  // 全局污染
```

### 全局样式
项目采用 CSS Modules 模块化，**禁止全局样式污染**：
- 全局样式统一放在 `src/styles/`
- 如果真需要全局，请使用 `:global()` 包裹

---

## 媒体查询

### 断点
- 项目为移动端 H5，默认移动端优先
- 如需适配平板/桌面端，使用以下断点：
  - `≥ 768px` 平板
  - `≥ 1024px` 桌面

```scss
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }
}
```

---

## 检查清单

编写或修改样式后检查：

- [ ] 文件命名是否为 `index.module.scss`？
- [ ] class 选择器是否使用 camelCase？
- [ ] **根容器是否遵循命名规则**（`{componentName}Container`）？
- [ ] 是否使用 px 单位（不是手动 vw）？
- [ ] 点击元素尺寸是否 ≥ 44px？
- [ ] 嵌套深度是否 ≤ 3 层？
- [ ] 是否使用了全局变量（颜色、间距）？
- [ ] 是否适配了安全区域？
