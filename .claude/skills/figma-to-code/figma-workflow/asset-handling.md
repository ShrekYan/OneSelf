# 图片/图标资产处理规范

本文档定义 Figma 设计稿中图片、图标等资产的处理流程，包括下载、落地目录、命名规范、复用检查。

## 资产类型识别

### Figma 节点类型判断

| Figma 节点类型 | 资产类型 | 处理方式 |
|---------------|---------|---------|
| `type: "RECTANGLE"` + `imageRef` | 图片 | 下载后放到 `assets/images/` |
| `type: "VECTOR"` | 图标/SVG | 下载 SVG 或转为组件 |
| `type: "TEXT"` | 文本 | 不需要下载，提取文案 |
| `type: "FRAME"` + 填充图片 | 背景图 | 下载后作为背景处理 |

## 资产下载流程

### 步骤 1：复用检查（强制）

在下载任何资产前，**必须**先检查项目中是否已存在相同资产：

```bash
# 检查图片是否已存在
ls apps/web/src/assets/images/

# 检查图标是否已存在
ls apps/web/src/assets/icons/
```

**复用优先级**：
1. 优先复用 `assets/images/` 和 `assets/icons/` 中已有的资产
2. 如果 Figma 资产与现有资产视觉一致，直接使用现有资产
3. 仅在确认无复用可能时，才下载新资产

### 步骤 2：使用 Figma MCP 下载

调用 `mcp__figma__download_assets` 工具下载资产：

```
参数：
- fileKey: 从 Figma URL 提取
- nodeId: 目标节点 ID
- count: 1（单个资产）或需下载的资产数量
```

**注意事项**：
- 下载的资产生成在 Figma MCP 返回的临时目录中
- 需要手动将资产移动到项目目录

### 步骤 3：资产落地目录

根据产出物类型，资产必须放到以下目录：

#### 页面级资产
```
apps/web/src/pages/[PageName]/
├── assets/           # 页面私有资产（可选）
│   ├── images/
│   └── icons/
```

#### 组件级资产
```
apps/web/src/components/[ComponentName]/
├── assets/           # 组件私有资产（可选）
│   ├── images/
│   └── icons/
```

#### 全局共享资产
```
apps/web/src/assets/
├── images/           # 全局图片（按业务模块分子目录）
│   ├── home/         # 首页相关
│   ├── profile/      # 个人中心相关
│   └── common/       # 通用图片
└── icons/            # 全局图标（SVG）
    ├── navigation/   # 导航图标
    └── common/       # 通用图标
```

### 步骤 4：资产命名规范

#### 图片命名
- 格式：`kebab-case`（小写 + 短横线）
- 示例：`user-avatar.png`、`article-cover.jpg`、`bg-gradient.png`

#### 图标命名
- 格式：`kebab-case` + `-icon` 后缀
- 示例：`search-icon.svg`、`back-icon.svg`、`like-icon.svg`

#### 命名规则
- 使用描述性名称，不使用 `img1`、`pic2` 这种无意义名称
- 多个相似资产使用数字后缀：`banner-1.png`、`banner-2.png`
- 不同状态使用状态后缀：`like-icon.svg`、`like-active-icon.svg`

## 资产引用方式

### 图片引用（img 标签）

```tsx
import userAvatar from '@/assets/images/user-avatar.png';

<img src={userAvatar} alt="用户头像" />
```

### 背景图引用（CSS）

```scss
.bannerContainer {
  background-image: url('@/assets/images/banner.png');
  background-size: cover;
  background-position: center;
}
```

### 图标引用（SVG）

#### 方式 1：直接导入 SVG
```tsx
import SearchIcon from '@/assets/icons/search-icon.svg?react';

<SearchIcon className={styles.searchIcon} />
```

#### 方式 2：作为背景图
```scss
.searchIcon {
  background-image: url('@/assets/icons/search-icon.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

## 特殊场景处理

### 场景 1：Figma 是矢量图标（Vector）

**优先转为 SVG 文件**，而不是位图：
1. 从 Figma 导出 SVG
2. 优化 SVG 代码（移除冗余属性）
3. 放到 `assets/icons/` 目录

### 场景 2：Figma 是渐变背景

**优先使用 CSS 渐变实现**，而不是导出图片：
```scss
.gradientBg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 场景 3：Figma 是圆角图片

**使用 CSS border-radius 实现**，而不是裁剪图片：
```scss
.avatar {
  border-radius: 50%; // 圆形
  // 或
  border-radius: 16px; // 圆角矩形
}
```

### 场景 4：Figma 是图标字体

**优先使用 SVG 或 Ant Design Mobile 图标**，不使用图标字体。

## 资产优化建议

### 图片优化
- 压缩 PNG/JPG：使用 `imagemin` 或在线工具压缩
- 选择合适的格式：照片用 JPG，透明图用 PNG，简单图形用 SVG
- 响应式图片：大图考虑使用 `srcset`

### SVG 优化
- 移除编辑器元数据
- 简化路径数据
- 使用 `SVGO` 工具优化

## 资产处理检查清单

在交付前检查以下项目：

- [ ] 是否先检查了资产复用可能性？
- [ ] 资产是否放到了正确的目录？
- [ ] 资产命名是否符合 kebab-case 规范？
- [ ] 图片是否进行了压缩优化？
- [ ] SVG 是否进行了优化？
- [ ] 背景图是否优先使用 CSS 实现（渐变、圆角）？
- [ ] 资产引用路径是否使用了 `@/` 别名？
- [ ] 图片是否添加了 `alt` 属性（可访问性）？
- [ ] 是否在代码中硬编码了图片 URL？
