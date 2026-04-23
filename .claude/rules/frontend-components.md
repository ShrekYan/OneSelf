# 公共组件开发规范

本文档定义 `apps/web/src/components/` 目录下**全局公共组件**的开发规范，所有公共组件必须遵循此规范。

---

## 目录结构

每个公共组件必须独立占用一个目录，结构如下：

```
apps/web/src/components/
└── [ComponentName]/    # 组件名：PascalCase
    ├── index.tsx        # 组件源码
    ├── index.module.scss # 组件样式
    └── README.md        # (可选) 组件使用说明
```

**示例**：
```
apps/web/src/components/
├── LazyImage/
│   ├── index.tsx
│   └── index.module.scss
└── ErrorFallback/
    ├── index.tsx
    └── index.module.scss
```

---

## 命名规范

| 项 | 规则 | 示例 |
|----|------|------|
| **目录名** | PascalCase | `LazyImage` 不是 `lazy-image` |
| **组件名** | 和目录名一致，PascalCase | `const LazyImage: React.FC<Props> = (...)` |
| **样式文件** | 固定 `index.module.scss` | - |
| **根容器 class** | `{componentName}Container` (首字母小写 camelCase) | `.lazyImageContainer` |

---

## 技术栈约定

| 项 | 规则 |
|----|------|
| **样式方案** | SCSS + CSS Modules，必须遵循 [frontend-css-scss.md](.claude/rules/frontend-css-scss.md) |
| **类型系统** | TypeScript 显式类型，必须遵循 [frontend-typescript.md](.claude/rules/frontend-typescript.md) |
| **状态管理** | 纯组件，仅依赖 Props，不使用 MobX |
| **第三方依赖** | 必须遵循 [frontend-third-party-libraries.md](.claude/rules/frontend-third-party-libraries.md) |

---

## Props 规范

### 基本要求
1. **必须**为组件定义显式的 `Props` 接口
2. **必须**使用 TypeScript 严格类型检查
3. **可选属性**使用 `?:`，**必填属性**不使用 `?`
4. **所有回调事件**必须定义类型，不能使用 `any`

```typescript
// ✅ 正确示例
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  placeholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  onLoad,
  onError,
}) => {
  // ...
};

export default LazyImage;
```

### Props 设计原则
1. **单一职责**：一个组件只做一件事
2. **最小接口**：只暴露必要的 Props，内部状态不暴露
3. **回调命名**：事件回调使用 `onXxx` 命名，如 `onClick`、`onChange`、`onLoad`
4. **默认值**：可选 Props 提供合理默认值

---

## 样式规范

公共组件样式必须遵循 [CSS/SCSS 规范](.claude/rules/frontend-css-scss.md)，额外要求：

### 根容器命名强制要求
```scss
// LazyImage 组件
// ✅ 正确
.lazyImageContainer {
  // 样式
}

// ❌ 错误
.container {
}
```

### 外部覆盖能力
- 根容器允许通过 `className` prop 接收额外样式
- 使用 `classnames` 拼接内部样式和外部样式

```tsx
// ✅ 正确示例
import classNames from 'classnames';

interface LazyImageProps {
  className?: string;
  // ...
}

const LazyImage: React.FC<LazyImageProps> = ({ className, ...rest }) => {
  return (
    <div className={classNames(styles.lazyImageContainer, className)}>
      {/* ... */}
    </div>
  );
};
```

---

## 导出规范

### 组件导出
- 使用 `export default` 导出组件
- 在 `apps/web/src/components/index.tsx` 统一注册，便于全局导入

```typescript
// apps/web/src/components/index.tsx
export { default as LazyImage } from './LazyImage';
export { default as ErrorFallback } from './ErrorFallback';
```

### 类型导出
- 组件 Props 类型如果需要外部使用，使用 `export type` 导出

```typescript
// ✅ 正确
export type { LazyImageProps };
export default LazyImage;
```

---

## 导入使用

全局公共组件统一从 `@/components` 导入：

```tsx
// ✅ 正确
import { LazyImage, ErrorFallback } from '@/components';

// ❌ 错误
import LazyImage from '@/components/LazyImage';
```

---

## 纯组件原则

公共组件必须是**纯组件**，以下规则严格执行：

| 规则 | 要求 | 反例 |
|------|------|------|
| 数据输入 | 所有数据来自 Props | 直接调用 API、访问全局 Store |
| 事件输出 | 所有用户交互通过 `onXxx` 回调通知父组件 | 直接修改全局状态、调用父组件方法 |
| 局部状态 | 只有组件自身的交互状态可以使用 `useState` | 使用 MobX、Context 等全局状态 |
| 无副作用 | 不直接调用 API、不产生副作用 | 在组件内 `fetch()`、`axios.get()` |
| 无业务绑定 | 不绑定特定业务逻辑，保持通用性 | 硬编码业务 ID、特定业务逻辑判断 |

**正反示例对比**：

| ❌ 错误（业务绑定） | ✅ 正确（纯组件） |
|---------------------|-------------------|
| 直接使用 `useStores()` 获取全局数据 | 通过 `props` 传入所有数据 |
| 直接调用 `api.user.getCurrent()` | 通过 `props.onClick` 通知父组件 |

```tsx
// ✅ 正确示例
interface UserAvatarProps {
  src: string;
  size?: number;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, size = 40, onClick }) => {
  return (
    <div className={styles.userAvatarContainer} style={{ width: size, height: size }}>
      <img src={src} alt="avatar" onClick={onClick} />
    </div>
  );
};
```

---

## 移动端适配

| 适配项 | 要求 | 代码示例 |
|--------|------|---------|
| 点击区域 | 可点击元素最小尺寸 **≥ 44px × 44px**（750 设计稿 88px | `min-height: 88px;` |
| 单位 | 基于 750px 设计稿写 px，插件自动转 vw | `width: 200px;` |
| 安全区域 | 底部组件适配底部安全区域 | `padding-bottom: env(safe-area-inset-bottom);` |
| 点击反馈 | 可点击元素 `:active` 状态透明度变化 | `&:active { opacity: 0.8; }` |

```scss
// 完整示例
.actionButton {
  min-height: 88px;
  padding-bottom: env(safe-area-inset-bottom);
  &:active {
    opacity: 0.8;
  }
}
```

---

## 性能优化

| 优化手段 | 适用场景 |
|----------|---------|
| `React.memo` | 频繁重渲染的组件，props 变化不频繁 |
| `useCallback` | 传递给子组件的回调函数 |
| `useMemo` | 复杂计算结果、大数组、对象计算 |
| 懒加载 | 非首屏大图、长列表、低优先级组件 |

```typescript
// ✅ 标准写法
const MyComponent = React.memo<MyProps>(({ data, onItemClick }) => {
  const handleClick = useCallback((id) => onItemClick(id), [onItemClick]);

  const sortedData = useMemo(() => heavySort(data), [data]);

  // ...
});
```

---

## 错误处理

| 场景 | 处理方案 |
|------|---------|
| 高风险动态组件 | 嵌套 `ErrorBoundary` 隔离 |
| 普通组件 | 使用项目内置 `ErrorFallback` |

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ErrorFallback';

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <HighRiskComponent />
</ErrorBoundary>
```

---

## 可访问性

| 要求 | 正确 | 错误 |
|------|------|------|
| 无文本可点击元素 | 添加 `aria-label` | 只放图标无说明 |
| 可点击元素标签 | `<button>` 或 `<a>` | `<div onClick={...}>` |
| 图片 | 必须有 `alt` 属性 | 空 alt |

```tsx
// ✅ 正确
<button aria-label="关闭弹窗" onClick={onClose}>
  <CloseIcon />
</button>

// ❌ 错误
<div aria-label="关闭弹窗" onClick={onClose}>
  <CloseIcon />
</div>
```

---

## 检查清单

创建公共组件后请检查：

- [ ] 目录结构是否正确？(`index.tsx` + `index.module.scss`)
- [ ] 命名是否符合规范？(目录 PascalCase，根容器 camelCase 后缀 Container)
- [ ] 是否定义了完整的 Props 接口？
- [ ] 是否保持纯组件，没有依赖 MobX 或全局 Store？
- [ ] 根容器 class 是否遵循命名规则？
- [ ] 是否支持 `className` 覆盖样式？
- [ ] 是否使用了 CSS Modules 而不是全局样式？
- [ ] 是否使用 px 单位而不是手动 vw？
- [ ] 可点击元素尺寸是否 ≥ 44px (设计稿 ≥ 88px)？
- [ ] 是否添加了 `:active` 点击反馈？
- [ ] 是否优先使用了 Ant Design Mobile 组件？
- [ ] 是否已在 `apps/web/src/components/index.tsx` 注册导出？
- [ ] 是否遵循了导入排序规则？
- [ ] 是否适配了安全区域？
- [ ] 是否处理了加载和错误状态？

---

## 最佳实践

1. **先设计 Props，再写实现**：接口设计比实现更重要
2. **尽量复用 antd-mobile**：不要重复封装已有的组件
3. **保持小而美**：过大的组件考虑拆分成更小的子组件
4. **添加必要注释**：复杂交互或非直观 API 需要注释说明
5. **考虑边缘情况**：空数据、加载中、错误状态都要有兜底展示
