# Home 首页

项目脚手架默认首页，展示项目技术特性和开发命令说明，包含一个加载状态测试按钮。

## 功能说明

- 展示项目技术栈特性列表
- 列出常用开发命令
- 提供 MobX 异步状态加载测试演示
- 提供路由跳转演示

## 组件结构

```
src/pages/Home/
├── README.md           # 本文档
├── constant.ts         # 常量定义（特性列表、命令列表）
├── handle.ts           # 工具函数（预留）
├── index.tsx           # 主页组件
├── index.module.scss   # 样式
└── useStore.ts         # 页面局部 MobX Store
```

## 数据流向

- 静态常量从 `constant.ts` 导入
- 页面局部状态由 `useStore.ts` 的 `useLocalObservable` 管理
- 点击跳转使用 React Router `useNavigate`
- 测试加载 → 2 秒模拟异步 → 完成后显示 Toast

## 类型定义

### FeatureItem

特性列表项

| 字段 | 类型 | 说明 |
|------|------|------|
| `icon` | `string` | emoji 图标 |
| `text` | `string` | 特性描述文字 |

### CommandItem

开发命令项

| 字段 | 类型 | 说明 |
|------|------|------|
| `command` | `string` | 命令字符串 |
| `description` | `string` | 命令描述 |

### MobxStoreType

页面局部 Store 类型

| 字段/方法 | 类型 | 说明 |
|----------|------|------|
| `testLoading` | `boolean` | 测试按钮加载状态 |
| `setTestLoading` | `(value: boolean) => void` | 设置加载状态 |
| `handleTestClick` | `() => Promise<void>` | 测试按钮点击处理 |

## 使用示例

这是应用入口首页，由路由自动渲染，不需要手动引入：

```tsx
// 在路由配置中
const routes = [
  { path: '/', element: <Home /> },
  // ...
];
```

## 注意事项

- 这是一个示例页面，用于演示项目代码组织结构
- 所有数据都是静态演示数据，实际开发请替换为业务代码
- 样式使用渐变背景，适配了 iOS 安全区域（刘海屏和底部小黑条）
- MobX 使用局部 store 模式（`useLocalObservable`），符合页面级状态管理最佳实践

## 相关文件

- [useStore](./useStore.ts) - 页面状态管理
- [constant](./constant.ts) - 常量定义
