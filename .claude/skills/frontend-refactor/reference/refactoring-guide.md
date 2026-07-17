# 重构分析指南

本文件定义前端代码重构分析的完整流程，包括代码嗅探、影响评估、规范匹配、方案提出、风险分析和优先级排序。

## 重构分析六步走

### 第一步：代码嗅探

识别代码中的坏味道和项目规范违规点。

#### 通用代码问题

| 坏味道 | 说明 |
|--------|------|
| 冗长 | 函数/组件超过 500 行 |
| 重复 | 复制粘贴代码，逻辑重复 |
| 复杂 | 圈复杂度过高，分支太多 |
| 模糊 | 命名不清晰 |
| 冗余 | 死代码、未使用导入/变量 |
| 依赖过多 | 一个文件依赖太多外部模块 |
| 违反单一职责 | 做太多不相关的事 |

#### 项目特定规范检查

| 检查项 | 规范要求 |
|--------|----------|
| 目录结构 | 页面遵循 `index.tsx` + `useStore.ts` + `constant.ts` + `types.ts` + `hooks/` + `components/` 拆分 |
| useStore.ts | 使用 `useLocalObservable` + 对象字面量，禁止 class 写法 |
| hooks/ | 复杂业务逻辑抽离到 `hooks/useXxx.ts` |
| 样式文件 | 使用 `index.module.scss`，class 命名 camelCase，根容器 `{pageName}Container` |
| 导入路径 | 使用路径别名 `@/`，禁止 `../../../../` |
| TypeScript | 禁止滥用 `any`，类型用 `export type`，优先联合类型代替 enum |
| MobX | 使用 `useObserver` Hook，禁止 observer HOC |
| 第三方库 | 按需导入（如 `react-use/lib/useDebounce`） |

### 第二步：评估影响

| 严重程度 | 说明 |
|---------|------|
| 🔴 严重 | 违反核心架构，影响功能、导致 bug |
| 🟠 中等 | 违反规范，影响可读性 |
| 🟡 轻微 | 代码风格问题 |

### 第三步：匹配项目规范

分析时应重点对照以下规范：

- [前端 TypeScript 规范](../h5-frontend-developer/reference/rules/frontend-typescript.md)
- [前端 CSS/SCSS 规范](../h5-frontend-developer/reference/rules/frontend-css-scss.md)
- [前端 API 设计规范](../h5-frontend-developer/reference/rules/frontend-api-design.md)
- [前端 Hooks 开发规范](../h5-frontend-developer/reference/rules/frontend-hooks-ts.md)

### 第四步：提出重构方案

每个问题必须给出三个要素：

1. **怎么改**：具体改动点和代码示例
2. **为什么**：改动的收益和原因
3. **示例代码**：符合项目规范的修改后代码

### 第五步：评估风险

对每个重构方案回答以下问题：

- 是否影响现有功能？
- 需要什么测试确保不回归？
- 改动范围有多大？

### 第六步：排定优先级

综合严重程度和改动风险，给出实施顺序建议。具体优先级划分见 [refactoring-principles.md](refactoring-principles.md)。
