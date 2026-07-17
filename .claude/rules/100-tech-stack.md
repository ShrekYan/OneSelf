---
name: tech-stack
description: React、NestJS、TypeScript 等基础技术栈规范
---

## 📦 核心技术栈

| 技术 | 前端 | 后端 | 规范要点 |
|------|------|------|---------|
| **语言** | TypeScript | TypeScript | 严格模式 `strict: true` |
| **框架** | React 19 | NestJS 11 | 函数组件 + Hooks / 模块化架构 |
| **状态管理** | MobX | - | 页面级 useObserver + useLocalStore |
| **路由** | React Router | - | 懒加载路由 |
| **UI 组件库** | Ant Design Mobile | - | 统一使用 |
| **样式** | SCSS + CSS Modules | - | `.module.scss` 文件 |
| **HTTP** | Axios | Axios | 统一 API 管理 |
| **ORM** | - | Prisma | 数据库操作 |
| **缓存** | - | Redis | Token 存储 |

## 📦 TypeScript 规范

- ✅ 必须开启 `strict: true`，严禁关闭核心检查
- ✅ 禁止禁用 `strictNullChecks`
- ✅ 函数/方法参数、返回值必须显式声明类型
- ✅ async 函数必须显式标注 `Promise<T>` 返回类型

## 📦 React 规范

- ✅ 全部使用函数组件 + Hooks，禁止 class 写法
- ✅ 页面使用 `useObserver` Hook，业务组件不使用 MobX

## 📦 NestJS 规范

- ✅ 遵循模块化架构（Controller + Service + Module）
- ✅ 使用 DTO 定义请求/响应类型
- ✅ 使用 Guard 进行权限校验

## 📦 路径别名

- `@/` - 项目根目录
- `@/components` - 公共组件
- `@/api` - API 接口
- `@/store` - 状态管理