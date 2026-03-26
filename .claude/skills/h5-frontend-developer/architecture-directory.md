# 01 - 架构与目录规范

## 核心技术栈
- **React 19** + **TypeScript**
- **Vite** + **MobX** (useLocalObservable + useObserver)
- **Ant Design Mobile** (UI 库) + **SCSS Modules** (样式)

## 项目目录结构
- `src/api/`: API 接口定义与 Axios 实例
- `src/components/`: 全局公共组件
- `src/pages/`: 业务页面
- `src/store/`: 全局状态管理
- `src/types/`: 全局 TypeScript 类型

## 页面组织规范
每个页面目录应包含：
- `index.tsx`: 主组件（必须使用 `useObserver`）
- `useStore.ts`: 页面级 MobX 状态
- `handle.ts`: 业务逻辑函数（处理跳转、API 调用等）
- `constant.ts`: 常量定义
- `index.module.scss`: 页面样式
- `components/`: 页面专用子组件

## 导入规范
- 使用 `@/` 别名引用 `src` 目录
- 禁止过长相对路径 `../../xxx`
- 遵循单一职责，业务逻辑从视图中分离到 `handle.ts` 或 `useStore.ts`
