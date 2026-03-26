# 前端组件开发规范

当前项目为 **H5 移动端 React 项目**，遵循以下规范开发公共组件。

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.2.3 | React 框架 |
| TypeScript | 5.5.3 | 类型检查 |
| Ant Design Mobile | 5.42.3 | 基础组件库 |
| SCSS | 1.79.6 | 样式预处理 |
| CSS Modules | - | 样式模块化 |
| postcss-px-to-viewport | - | px 自动转 vw |

---

## 组件目录结构

每个组件独立文件夹，结构如下：

```
components/
└── ComponentName/
    ├── index.tsx         # 组件主文件
    ├── index.module.scss # 组件样式
    └── README.md         # 组件说明（可选）
```

**示例**：
```
Loading/
├── index.tsx
└── index.module.scss
```

---

## TypeScript 规范

### Props 接口定义

- 必须为组件 Props 定义明确的接口
- 所有可选属性必须标记 `?`
- 添加必要的注释说明

```typescript
// ✅ 正确
interface ButtonProps {
  /** 按钮文字 */
  text: string;
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'danger';
  /** 点击事件 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
}
```

### 组件导出

```typescript
// ✅ 正确
const Button: React.FC<ButtonProps> = ({
  text,
  type = 'default',
  onClick,
  disabled = false,
}) => {
  // ...
};

export default Button;
```

---

## 样式规范

### 使用 CSS Modules

- 样式文件名必须是 `index.module.scss`
- **SCSS 文件中直接使用 camelCase 命名 class**（如 `.searchBar`）
- **TSX 文件中使用相同的 camelCase 引用**（`styles.searchBar` 直接对应 `.searchBar`）
- 不允许全局样式污染

```scss
// index.module.scss
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.searchBar {
  .searchInput {
    // ...
  }
}
```

```tsx
// 在组件中引入 - 命名保持一致
import styles from './index.module.scss';

<div className={styles.container}>
  <div className={styles.searchBar}>...
</div>
```

### 像素单位

- 设计稿基于 **750px** 宽度
- 直接使用 `px` 编写，工具自动转为 `vw`
- **禁止手动使用 vw/vh**

```scss
// ✅ 正确
font-size: 28px;
padding: 20px 16px;

// ❌ 错误
font-size: 10vw;
```

---

## Ant Design Mobile 使用规范

- 优先使用 Ant Design Mobile 组件，不重复造轮子
- 导入路径：`import { Button } from 'antd-mobile'`
- 需要自定义样式时使用 `className` 覆盖

```tsx
// ✅ 正确
import { Button } from 'antd-mobile';

<Button className={styles.customBtn} onClick={onClick}>
  按钮
</Button>
```

---

## 导入路径规范

必须使用路径别名 `@/`，禁止过长相对路径：

```typescript
// ✅ 正确
import { xxx } from '@/components/xxx';
import { store } from '@/store';
import { api } from '@/api';

// ❌ 错误
import { xxx } from '../../../../components/xxx';
```

---

## 响应式设计

- 移动端优先开发
- 使用 Flexbox 布局
- 不固定宽度，使用百分比或 flex 自适应
- 内容超出需要滚动处理

```scss
// ✅ 正确
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.list {
  flex: 1;
  overflow-y: auto;
}
```

---

## 性能优化

- 使用 `React.memo` 避免不必要重渲染
- 使用 `useCallback` 缓存回调函数
- 使用 `useMemo` 缓存计算结果
- 大图需要懒加载

```typescript
// 对于需要频繁重渲染的组件
const MyComponent = React.memo<MyProps>(({ prop1, prop2 }) => {
  const handleClick = useCallback(() => {
    // ...
  }, [dependency]);

  const computedValue = useMemo(() => {
    return heavyCalculation(data);
  }, [data]);

  // ...
});

export default MyComponent;
```

---

## 移动端交互

- 点击区域不小于 `48px × 48px`
- 按钮点击需要反馈效果
- 处理点击穿透问题
- 长按需要防止误触

```scss
// 示例：点击反馈
.button {
  min-height: 96px;
  &:active {
    opacity: 0.8;
  }
}
```

---

## 可访问性

- 添加适当的 `aria-label`
- 可点击元素使用 `button` 或 `a`，不使用 `div`
- 图片添加 `alt` 属性

```tsx
// ✅ 正确
<button
  aria-label="关闭弹窗"
  onClick={onClose}
>
  <CloseIcon />
</button>

// ❌ 错误
<div aria-label="关闭弹窗" onClick={onClose}>
  <CloseIcon />
</div>
```

---

## 组件导出规范

在组件根目录 `components/index.tsx`（如果存在）统一导出所有组件：

```typescript
export { default as Button } from './Button';
export { default as Loading } from './Loading';
export { default as ErrorFallback } from './ErrorFallback';
```

使用方导入：
```typescript
import { Button, Loading } from '@/components';
```

---

## 检查清单

创建或修改组件后检查：

- [ ] 是否定义了完整的 Props 接口？
- [ ] 是否所有 props 都有正确的类型？
- [ ] 是否使用 CSS Modules 而不是全局样式？
- [ ] 是否使用 px 而不是手动 vw？
- [ ] 是否优先使用了 Ant Design Mobile 组件？
- [ ] 是否使用正确的路径别名 `@/`？
- [ ] 点击区域是否足够大（≥ 48px）？
- [ ] 是否处理了加载和错误状态？
- [ ] 是否适配了不同屏幕尺寸？
