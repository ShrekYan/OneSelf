# About 关于我们页面

展示应用基本信息、功能特性介绍和相关链接入口。

## 业务流程

1. 用户进入页面，从 Store 加载应用信息和配置数据
2. 页面按区块展示：应用名称/版本 → 应用描述 → 功能特性 → 相关链接 → 版权信息
3. 用户点击链接项，触发跳转或打开对应地址

## 数据流向

- 数据来源：本地 `mock.ts` 静态数据（可切换为 API 获取）
- 状态管理：`useAboutStore` 使用 MobX `useLocalObservable` 管理局部状态
- 组件拆分：按 UI 区块拆分为 `Header`/`Description`/`Features`/`Links`/`Footer` 五个子组件

## 目录结构

```
src/pages/about/
├── README.md           # 本文档
├── index.tsx           # 页面主入口
├── index.module.scss   # 页面样式
├── types.ts            # 类型定义
├── constant.ts         # 常量定义
├── useStore.ts         # MobX Store
├── mock.ts             # 模拟数据
└── components/         # 子组件
    ├── Header/         # 头部（应用名称+版本）
    ├── Description/    # 应用描述
    ├── Features/       # 功能特性列表
    ├── Links/          # 相关链接列表
    ├── Footer/         # 底部版权
    ├── icons.tsx       # SVG 图标组件
    └── index.ts        # 统一导出
```

## 特殊业务规则

- 目前使用静态 mock 数据，后续可轻松切换为从 API 动态拉取应用信息
- 链接点击默认为 `console.log` 占位，接入路由后需要补全跳转逻辑
- 功能特性和链接数据均可配置，新增只需要在 `mock.ts` 添加数据即可

## 类型定义

| 类型 | 说明 |
|------|------|
| `Feature` | 功能项配置，包含 id、标题、描述、图标key |
| `Link` | 链接项配置，包含 id、标题、图标key |
| `AppInfo` | 应用基本信息，包含名称、版本、描述、版权 |
| `IconKey` | 图标key联合类型，约束可用图标 |
