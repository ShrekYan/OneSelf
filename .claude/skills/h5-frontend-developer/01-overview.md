# 01 - 技术栈与项目概览

## 技术栈

- **框架**: React 19.2.3 + TypeScript 5.5.3
- **构建工具**: Vite 7.3.1
- **UI 组件库**: Ant Design Mobile 5.42.3
- **状态管理**: MobX 6.13.5
- **路由**: React Router DOM 6.27.0
- **样式**: SCSS + PostCSS + postcss-px-to-viewport
- **数据验证**: Zod
- **日期处理**: Dayjs
- **HTTP 请求**: Axios
- **本地存储**: localforage
- **工具库**: classnames, es-toolkit

## 代码组织

### 项目目录结构

```
src/
├── api/          # API 接口定义
├── assets/       # 静态资源
├── components/   # 公共组件
├── hooks/        # 自定义 Hooks
├── pages/        # 页面组件
├── routes/       # 路由配置
├── store/        # MobX 状态管理
├── styles/       # 全局样式
├── types/        # TypeScript 类型定义
├── App.tsx       # 根组件
└── main.tsx      # 入口文件
```

### 导入规范

- 使用 `@/` 别名作为 src 目录的引用，禁止使用过长的相对路径 `../../xxx`
- 组件放在 `@/components/` 目录
- 页面放在 `@/pages/` 目录
- 工具函数放在 `@/utils/` 目录
- Hooks 放在 `@/hooks/` 目录
- 状态管理放在 `@/store/` 目录
- API 接口放在 `@/api/` 目录
- 全局类型放在 `@/types/` 目录
