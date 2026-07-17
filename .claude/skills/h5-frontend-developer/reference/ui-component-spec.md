# 02 - 组件与 UI 开发规范

## 组件开发核心
- **单一职责**: 长页面或复杂模块必须拆分为子组件
- **子组件位置**: 存放在页面目录下的 `components/` 文件夹中
- **性能优化**: 优先使用 `React.memo` 包装子组件
- **响应式渲染**: 统一使用 `useObserver` Hook 模式，严禁 HOC 写法

## 示例模式
```tsx
import React from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';

export const MyComponent = React.memo(({ data }) => {
  return useObserver(() => (
    <div className={styles.container}>
      <h3 className={styles.title}>{data.name}</h3>
    </div>
  ));
});
```
