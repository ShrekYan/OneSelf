# H5 前端开发记忆

## 核心技术栈
- React 19 + TypeScript 5 + Vite 7
- Ant Design Mobile 5
- MobX 6 状态管理 (useLocalObservable + useObserver)
- React Router 6 路由

## 重要配置
- 设计稿宽度: 750px (px 自动转 vw)
- 路径别名: @/ 指向 src/
- CSS Modules: 使用 .module.scss
- 多环境: outDev/test/fofTest/sit/pre/production

## 目录结构
- @/components/ - 公共组件
- @/pages/ - 页面组件（RateStructure 风格）
- @/store/ - 全局 MobX 状态
- @/api/ - API 接口
- @/utils/ - 工具函数
- @/hooks/ - 自定义 Hooks
- @/types/ - TypeScript 类型（requests/responses）
- @/styles/ - 全局样式

## 页面结构（RateStructure 风格）
```
@/pages/
├── RateStructure/
│   ├── index.tsx - 主组件（useObserver 包裹）
│   ├── useStore.ts - 页面级 Store（useLocalObservable）
│   ├── handle.ts - 处理逻辑
│   ├── constant.ts - 常量定义
│   ├── index.module.scss - 样式文件
│   └── components/
│       ├── PurchaseRateRow/
│       │   └── index.tsx
│       └── BottomDesc/
│           └── index.tsx
```

## 开发规范
- 严格 TypeScript，避免 any
- 使用 useLocalObservable 定义局部状态
- 页面使用 useObserver 监听状态变化
- 使用 withPersist 进行数据持久化（支持加密）
- CSS Modules 隔离样式
- Commitlint 规范提交
- Prettier + ESLint 格式化代码

## 常用工具函数
- `withPersist` - 持久化存储
- `useLocalObservable` - 局部状态管理
- `useObserver` - 响应式监听
- `encryptByAES/decryptByAES` - 加密工具
- `classnames` - 类名合并
- `react-use` - 常用 Hook

## 常用命令
- npm run dev - 启动开发服务器
- npm run build - 生产环境打包
- npm run lint - 代码检查
