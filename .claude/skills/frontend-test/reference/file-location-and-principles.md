# 测试文件位置与原则

## 文件位置

### 目录结构示例

```text
src/
├── components/
│   ├── CountDown/
│   │   ├── index.tsx
│   │   ├── index.module.scss
│   │   └── __tests__/
│   │       └── index.test.tsx
│   └── ...
├── hooks/
│   ├── useCountDown.ts
│   └── __tests__/
│       └── useCountDown.test.ts
├── utils/
│   ├── format.ts
│   └── __tests__/
│       └── format.test.ts
├── store/
│   ├── product.store.ts
│   └── __tests__/
│       └── product.store.test.ts
└── pages/
    └── ArticleList/
        ├── index.tsx
        ├── useStore.ts
        ├── hooks/
        └── __tests__/
            ├── useStore.test.ts
            └── useXxx.test.ts
```

### 命名规范

- 测试文件放在 `__tests__` 目录下
- 测试文件名：`{name}.test.ts` 或 `{name}.test.tsx`（组件）
- 一个源文件对应一个测试文件

## 测试原则

### 测试金字塔

```text
        ^
        |  E2E 测试（少）
        |
        |  集成测试（中）
        |
        |  单元测试（多） ← 本项目重点
```

### 应该测试的内容

- 纯函数（`useStore.ts` 中、`utils/` 下）的各种输入输出和分支处理
- 工具函数的各种输入输出
- 自定义 Hooks 的状态变化和副作用
- MobX Store 的业务逻辑和状态变更
- 组件的用户交互和不同状态下的渲染
- API 接口的响应解析

### 不应该测试的内容

- 第三方库（已经由库自身测试）
- Ant Design Mobile 组件库（不需要重复测试）
- 简单的 getter/setter
- 已经测试过的逻辑

### 测试隔离

- 每个测试用例独立运行
- 每个测试前清理状态
- 不在测试用例之间共享状态
- 每次测试后重置 mock
