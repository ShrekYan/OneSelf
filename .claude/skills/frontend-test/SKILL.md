---
name: frontend-test
description: Use this skill when the user wants to generate frontend unit tests for React 19 + TypeScript + MobX projects. Triggers include "写测试"、"生成测试"、"单元测试"、"测试这个组件/函数/Hook"、"test"、"testing". Also use when reviewing or refactoring existing tests. Do NOT use for backend tests (Jest/NestJS) or E2E tests (Playwright/Cypress).
license: Complete terms in LICENSE.txt
---

# 前端测试规范

## 概述

本文档定义了前端项目单元测试的编写规范和生成规则，基于 **Vitest + React Testing Library**，覆盖纯函数、自定义 Hooks、MobX Store、React 组件等被测对象。

核心目标：

- 统一测试编写风格
- 保证测试可重复、可维护
- 使用 AAA 模式组织测试代码
- 通过正确 mock 隔离外部依赖

## 触发场景

以下用户表达应触发本 skill：

- "给这个组件写测试"
- "生成单元测试"
- "测试这个 Hook"
- "这个函数怎么测"
- "帮我补测试"
- "审查测试代码"

不适用场景：

- 后端 NestJS 测试（使用 `nestjs-test-writer`）
- E2E 测试（Playwright/Cypress）
- 非本项目技术栈的测试

## 输入要求

在执行测试生成前，需要获取以下信息：

1. **目标文件路径**：需要测试的源文件绝对路径或相对路径
2. **测试类型**：纯函数 / Hook / Store / 组件 / API 响应解析
3. **特殊依赖**：是否需要 mock API、CSS Modules、第三方库等

如果用户未提供路径，应优先询问；如果用户仅描述功能，可基于当前上下文推断。

## 工作流

1. **读取源文件**：理解实现逻辑、输入输出、副作用和依赖
2. **确定测试类型**：按被测对象选择对应模式
3. **加载规范**：按需读取 [reference/test-patterns.md](reference/test-patterns.md) 和 [reference/mock-guide.md](reference/mock-guide.md)
4. **生成测试计划**：列出测试场景（正常路径、边界条件、异常输入）
5. **生成测试代码**：使用对应 [templates/](templates/) 起步，遵循 AAA 模式
6. **验证输出**：检查命名、路径、mock、断言是否符合 [reference/best-practices.md](reference/best-practices.md)
7. **交付结果**：输出完整测试代码、覆盖说明和运行命令

## 资源引用

### 必读参考

| 资源 | 用途 |
|------|------|
| [reference/core-philosophy.md](reference/core-philosophy.md) | 核心哲学与测试原则 |
| [reference/tech-stack.md](reference/tech-stack.md) | 技术栈说明 |
| [reference/file-location-and-principles.md](reference/file-location-and-principles.md) | 测试文件位置与测试原则 |
| [reference/test-patterns.md](reference/test-patterns.md) | 各类测试编写规范 |
| [reference/mock-guide.md](reference/mock-guide.md) | Mock 函数与 API 模拟 |
| [reference/coverage-requirements.md](reference/coverage-requirements.md) | 覆盖率指标 |
| [reference/best-practices.md](reference/best-practices.md) | 命名规范、AAA 模式、检查清单 |
| [reference/commands-and-traits.md](reference/commands-and-traits.md) | 运行命令与行为特征 |
| [reference/workflow-and-output.md](reference/workflow-and-output.md) | 响应流程与输出格式 |

### 模板

| 模板 | 用途 |
|------|------|
| [templates/pure-function-test.template.ts](templates/pure-function-test.template.ts) | 纯函数 / 工具函数测试起步 |
| [templates/hook-test.template.ts](templates/hook-test.template.ts) | 自定义 Hook 测试起步 |
| [templates/store-test.template.ts](templates/store-test.template.ts) | 页面 useStore 测试起步 |
| [templates/component-test.template.tsx](templates/component-test.template.tsx) | React 组件测试起步 |
| [templates/mobx-store-test.template.ts](templates/mobx-store-test.template.ts) | MobX 全局 Store 测试起步 |

### 示例

| 示例 | 说明 |
|------|------|
| [examples/pure-function-test.example.ts](examples/pure-function-test.example.ts) | 纯函数测试示例 |
| [examples/hook-test.example.ts](examples/hook-test.example.ts) | 自定义 Hook 测试示例 |
| [examples/store-test.example.ts](examples/store-test.example.ts) | 页面 useStore 测试示例 |
| [examples/component-test.example.tsx](examples/component-test.example.tsx) | React 组件测试示例 |
| [examples/mobx-store-test.example.ts](examples/mobx-store-test.example.ts) | MobX 全局 Store 测试示例 |

## 输出格式

### 完整代码输出

```typescript
// 完整的测试文件代码
```

### 测试覆盖说明

| 测试目标 | 覆盖场景 |
|---------|---------|
| `functionName` | 正常输入 / 边界条件 / 异常输入 |

### Mock 说明

- `@/api`：mock API 调用，隔离网络依赖
- `./handle`：mock 工具函数

### 运行测试

```bash
# 运行单个测试文件
npm run test:run -- src/components/ComponentName/__tests__/index.test.tsx

# 运行所有测试
npm run test:run

# 查看覆盖率
npm run test:coverage
```

## 校验清单

- [ ] 是否已读取源文件并理解依赖？
- [ ] 测试文件位置和命名是否符合规范？
- [ ] 是否覆盖了正常路径、边界条件和异常输入？
- [ ] Mock 是否正确重置？
- [ ] 断言是否精确？
- [ ] 是否遵循 AAA 模式？
- [ ] 命名是否符合 `should ... when ...` 格式？
- [ ] 是否清理了副作用（定时器、fakeTimers）？
- [ ] TypeScript 类型是否正确，无 `any`？
- [ ] 导入排序是否正确（第三方 → 别名 → 相对）？

## 约束与禁止事项

- 不测试第三方库和 UI 组件库内部实现
- 不使用相对路径导入项目内部模块，始终使用 `@/` 别名
- 不在测试中写复杂逻辑
- 不直接用 `axios`，所有 API mock 通过 `@/api` 或 MSW
- 生产代码中不能保留测试专用 `data-testid`（除非必要）
