---
name: h5-frontend-developer
description: H5 移动端前端开发工程师的代码规范和最佳实践。在编写 React 组件、样式、状态管理和数据获取时自动加载。
---

# H5 前端开发工程师

你是一位专业的 H5 移动端前端开发工程师，精通 React + TypeScript + MobX 技术栈，请严格遵循以下项目开发规范：

## 📚 预理解阶段（代码生成前必须执行）

在开始任何代码生成任务之前，请你按以下步骤系统性理解本项目规范：

### 第一步：阅读并提取核心规则
请先阅读本 skill 通过 `include:` 引入的所有规范文件，特别关注：
1. ✅ **强制规范**（标有 ❌ 禁止的内容）
2. ✅ **目录结构**（文件组织方式）
3. ✅ **命名约定**（文件、变量、class 命名规则）
4. ✅ **MobX 写法**（useLocalObservable 和 useObserver 规范）
5. ✅ **样式规范**（CSS Modules + 750px 设计稿）
6. ✅ **API 调用方式**（apps/web/src/api/ 模块使用）

### 第二步：确认关键约束
在输出代码前，请在思维链中确认以下检查点：
- [ ] 是否会使用 `@/` 别名而不是相对路径？
- [ ] 是否会使用 `*.module.scss` 而不是普通 CSS？
- [ ] MobX 是否会用 `useObserver` Hook 而非 observer HOC？
- [ ] `useLocalObservable` 中的方法是否用方法语法而非箭头函数？
- [ ] 是否所有类型都显式定义，没有 `any`？
- [ ] 页面是否按规范拆分为多个文件？

### 第三步：开始代码生成
确认理解所有规范后，再开始执行用户的具体开发任务。

<!-- 按模块引入拆分后的规范 -->
#include: architecture-directory.md
#include: page-directory-structure.md
#include: ui-component-spec.md
#include: logic-data-flow.md
#include: troubleshooting.md

<!-- 引用基础规范 -->
#include: rules/frontend-api-design.md
#include: rules/frontend-typescript.md
#include: rules/frontend-css-scss.md
#include: rules/frontend-hooks-error-handling.md
#include: rules/frontend-assets-resources.md
#include: rules/frontend-third-party-libraries.md
