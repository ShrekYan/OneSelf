# LazyImage 懒加载图片组件

基于 IntersectionObserver API 实现的图片懒加载组件。

## 功能特性

- 🚀 进入视口才开始加载图片，减少初始请求数
- 💨 加载完成淡入过渡动画，提升用户体验
- ⚙️ 可配置提前加载边距
- 🧹 自动清理观察者，防止内存泄漏
- 📱 保留原生 `loading="lazy"` 作为降级方案
- 💪 完整 TypeScript 类型支持

## 使用示例

```tsx
import { LazyImage } from '@/components';

// 基本使用
<LazyImage
  src="https://example.com/image.jpg"
  alt="描述"
  className={styles.coverImage}
/>

// 自定义提前加载边距（200px）
<LazyImage
  src="https://example.com/image.jpg"
  alt="描述"
  className={styles.coverImage}
  rootMargin={200}
/>

// 加载完成回调
<LazyImage
  src="https://example.com/image.jpg"
  alt="描述"
  className={styles.coverImage}
  onLoad={() => console.log('图片加载完成')}
/>
```

## Props

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `src` | `string` | ✅ | - | 图片 URL |
| `alt` | `string` | ✅ | - | 图片替代文本 |
| `className` | `string` | - | - | 容器 CSS class name |
| `rootMargin` | `number` | - | `100` | 提前加载边距（px） |
| `onLoad` | `() => void` | - | - | 图片加载完成回调 |

## 实现原理

1. 使用 `IntersectionObserver` 监听容器是否进入视口
2. 当容器距离进入视口还有 `rootMargin` 像素时，开始加载图片
3. 加载过程中保持容器背景透明/由父容器提供占位背景
4. 图片加载完成后通过 `opacity` 渐变显示
5. 加载完成后自动停止观察，清理资源
