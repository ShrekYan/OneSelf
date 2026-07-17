---
name: h5-frontend-developer
description: Use this skill when the user wants to develop H5 mobile frontend applications using React + TypeScript + MobX. Triggers include creating React components, implementing styles with CSS Modules, managing state with MobX, handling API calls, and following frontend coding standards. Also use when refactoring existing frontend code or debugging frontend issues. Do NOT use for non-frontend tasks or backend development.
license: Complete terms in LICENSE.txt
---

# H5 前端开发工程师

## Overview

本 skill 提供 H5 移动端前端开发的完整规范和最佳实践，技术栈为 React 19 + TypeScript + MobX + Vite + Ant Design Mobile + SCSS Modules。适用于页面开发、组件设计、状态管理、API 调用、样式开发等场景。

## When to use this skill

- 用户需要创建或修改 React 组件
- 用户需要实现 CSS/SCSS 样式
- 用户需要使用 MobX 管理状态
- 用户需要调用 API 接口
- 用户需要遵循前端代码规范
- 用户需要重构现有前端代码
- 用户需要排查前端常见问题

## Inputs

- 用户需求描述（页面功能、组件需求等）
- 技术栈约束（如必须使用特定框架）
- 设计稿或样式要求
- 接口文档或 API 信息
- 项目现有代码结构

## Workflow

1. 识别任务类型（页面开发、组件开发、状态管理、API 调用等）
2. 读取相关参考文档和模板
3. 收集必要输入信息
4. 按照规范生成代码
5. 验证代码符合规范要求
6. 交付结果并说明

## Resources

| 资源 | 何时使用 |
|------|----------|
| `templates/` | 创建新页面、组件或文件时，使用模板作为起点 |
| `reference/` | 需要查阅详细规范、最佳实践或分语言指南时 |

## Output format

根据任务类型输出：
- 完整的页面代码（包含所有必要文件）
- 组件代码（包含 TSX 和样式文件）
- API 调用代码
- 状态管理代码
- 代码修改建议
- 问题排查报告

## Validation

- [ ] 是否使用了 `@/` 别名而非相对路径？
- [ ] 是否使用了 `*.module.scss` 而非普通 CSS？
- [ ] MobX 是否使用了 `useObserver` Hook 而非 observer HOC？
- [ ] 是否所有类型都显式定义，没有 `any`？
- [ ] 是否遵循了目录结构规范？
- [ ] 是否通过了 TypeScript 类型检查？

## Constraints

- 禁止在组件内直接使用 axios，必须通过 `@/api/` 模块调用
- 禁止滥用 `any` 类型，优先使用 `unknown` + 类型守卫
- 禁止使用 ID 选择器和标签选择器直接定义全局样式
- 禁止在 useEffect 依赖数组中监听 MobX store 对象
- 禁止使用常规 enum，使用联合类型替代

## Additional resources

### 核心架构与页面规范

- [架构与目录规范](reference/architecture-directory.md)
- [页面目录结构规范](reference/page-directory-structure.md)
- [组件与 UI 开发规范](reference/ui-component-spec.md)
- [状态、逻辑与数据流规范](reference/logic-data-flow.md)
- [常见问题与排错](reference/troubleshooting.md)

### 前端规则

- [API 设计规范](reference/rules/frontend-api-design.md)
- [TypeScript 规范](reference/rules/frontend-typescript.md)
- [CSS/SCSS 样式规范](reference/rules/frontend-css-scss.md)
- [自定义 Hooks 与错误处理规范](reference/rules/frontend-hooks-error-handling.md)
- [Hooks 目录规范](reference/rules/frontend-hooks-ts.md)
- [静态资源规范](reference/rules/frontend-assets-resources.md)
- [第三方工具库使用规范](reference/rules/frontend-third-party-libraries.md)

### 模板文件

- [页面模板](templates/page-template/)
- [组件模板](templates/component-template/)
- [Store 模板](templates/store-template/)
- [Hook 模板](templates/hook-template/)
- [API 模块模板](templates/api-module-template/)

