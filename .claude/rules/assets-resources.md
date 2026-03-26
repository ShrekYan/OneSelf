# 静态资源规范

本文档定义 `src/assets/` 目录下图片、字体、图标等静态资源的存放规则。

---

## 目录结构

```
src/assets/
├── images/     # 业务图片、照片、背景图
├── icons/      # SVG 图标文件
└── fonts/      # 字体文件
```

---

## 命名规范

### images/ - 业务图片
- 存放：jpg、png、gif、webp 等格式
- 命名：**kebab-case**（短横线分隔）
- 示例：
  - `banner-bg.jpg`
  - `user-avatar-default.png`
  - `empty-state.webp`

### icons/ - SVG 图标
- 存放：独立的 SVG 图标文件
- 命名：**kebab-case**，以 `-icon` 结尾
- 示例：
  - `close-icon.svg`
  - `search-icon.svg`
  - `arrow-left-icon.svg`

### fonts/ - 字体文件
- 存放：woff、woff2、ttf、iconfont 等字体
- 命名：保持原始包命名或使用 kebab-case

---

## 导入规范

- **必须使用路径别名**：`@/assets/` 开头
- **禁止使用相对路径**：`../../assets/xxx.png`

```typescript
// ✅ 正确
import bannerBg from '@/assets/images/banner-bg.jpg';

// ❌ 错误
import bannerBg from '../../../../assets/images/banner-bg.jpg';
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
