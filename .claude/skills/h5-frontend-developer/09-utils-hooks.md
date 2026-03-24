# 09 - 常用工具与 Hooks

## 常用工具库

- **es-toolkit**: 现代 JavaScript 工具库，包含 `debounce`, `throttle` 等工具
- **classnames**: 条件性合并 CSS 类名
- **react-use**: 提供常用 React Hooks，如 `useEffectOnce`
- **dayjs**: 轻量级日期处理
- **localforage**: 改进的本地存储

## 常用 Hooks

| Hook | 来源 | 用途 |
|------|------|------|
| `useLocalObservable` | mobx-react | 创建局部 MobX 可观察状态 |
| `useObserver` | mobx-react | MobX 响应式渲染 |
| `useEffectOnce` | react-use | 只执行一次的 Effect |
| `useParams` | react-router-dom | 获取路由参数 |
| `useSearchParams` | react-router-dom | 获取查询参数 |
| `useNavigate` | react-router-dom | 编程式导航 |
| `debounce` | es-toolkit | 防抖函数 |

## 代码片段

### 使用 debounce 防抖搜索

```tsx
import { useMemo, useCallback } from 'react'
import { debounce } from 'es-toolkit'

const debouncedSearch = useMemo(
  () => debounce((keyword: string) => {
    store.search(keyword)
  }, 300),
  []
)
```

### 使用 classnames 合并类名

```tsx
import cn from 'classnames'
import styles from './index.module.scss'

const buttonClass = cn(
  styles.button,
  isPrimary && styles.primary,
  disabled && styles.disabled
)
```
