---
name: naming
description: 文件、组件、变量、CSS 类名、缩进规范
---

## 📝 文件命名

- 组件目录：**PascalCase**（如 `LazyImage/`）
- 组件入口：`index.tsx`
- 样式文件：`index.module.scss`
- 页面 Store：`useStore.ts`
- 页面常量：`constant.ts`
- DTO 文件：`{name}.dto.ts`

## 📝 组件与变量命名

- 组件名：**PascalCase**（与文件夹同名）
- JS/TS 变量 / 函数：**camelCase**
- 常量：**UPPER_SNAKE_CASE**
- Boolean 变量：`is/has/can/should` 前缀（如 `isLoading`、`hasError`）
- 事件处理函数：`handle{Event}` / `on{Event}`（如 `handleClick`、`onConfirm`）

## 📝 CSS 类名

- 全部使用 **camelCase**，与 JSX DOM 层级一一对应
- 页面根类名：`{模块名}Container`（小驼峰 + Container 后缀）
- 组件根类名：`{组件名}Container`（小驼峰，首字母小写）
- 不使用中划线、下划线、BEM

## 📝 缩进规范

- JS/TS/JSX 文件：2 空格缩进
- SCSS 文件：2 空格缩进

## 📝 注释规范

- 文件头使用 `/** */`，包含功能描述
- JSX 区域划分使用 `{/* */}`
- SCSS 使用 `/* */` 块注释，禁止 `//`
- 关键局部变量、派生 className、复杂计算需注释