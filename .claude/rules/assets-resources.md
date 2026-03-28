# 静态资源规范

本文档定义 `src/assets/` 目录下图片、字体、图标等静态资源的存放规则。

> 基础目录命名规则遵循 `CLAUDE.md` 主指南约定。

---

## 目录结构

```
src/assets/
├── images/     # 业务图片、照片、背景图
├── icons/      # SVG 图标文件
└── fonts/      # 字体文件
```

---

## SVG 使用规范

根据使用场景选择不同的引入方式：

### 1. 需要动态修改颜色 → React Component
```tsx
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

// 可以通过 CSS 修改 color
<CloseIcon className={styles.closeIcon} />
```

### 2. 不需要改色 → 静态图片引用
```tsx
import logo from '@/assets/images/logo.png';

<img src={logo} alt="Logo" />
```

---

## 优化建议

1. **图片压缩**：所有图片在放入项目前需要适当压缩
2. **现代格式**：优先使用 WebP 格式，提供 JPG/PNG 降级
3. **雪碧图**：小图标建议合并成雪碧图，减少请求数
4. **懒加载**：长页面中的非首屏图片需要懒加载
