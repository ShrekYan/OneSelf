## 三、测试文件位置

### 命名规范

```
src/
├── components/
│   ├── CountDown/
│   │   ├── index.tsx           # 组件源码
│   │   ├── index.module.scss  # 样式
│   │   └── __tests__/
│   │       └── index.test.tsx  # 单元测试
│   └── ...
├── hooks/
│   ├── useCountDown.ts         # Hook 源码
│   └── __tests__/
│       └── useCountDown.test.ts
├── utils/
│   ├── format.ts               # 工具函数
│   └── __tests__/
│       └── format.test.ts
├── store/
│   ├── product.store.ts        # MobX Store
│   └── __tests__/
│       └── product.store.test.ts
└── pages/
    └── ArticleList/
        ├── index.tsx
        ├── useStore.ts         # 页面 Store (useLocalObservable)
        ├── hooks/              # 页面级自定义 Hooks
        └── __tests__/
            ├── useStore.test.ts # useStore 测试
            └── useXxx.test.ts   # Hooks 测试
```

**规则：**
- 测试文件放在 `__tests__` 目录下
- 测试文件名：`{name}.test.ts` 或 `{name}.test.tsx`（组件）
- 一个源文件对应一个测试文件

---

## 四、测试原则

### 测试金字塔

```
        ^
        |  E2E 测试 (少)
        |
        |  集成测试 (中)
        |
        |  单元测试 (多)  ← 这里
```

### 测试什么

✅ **应该测试：**
- 纯函数（`useStore.ts` 中、`utils/` 下）- 各种输入输出、分支处理
- 工具函数 - 纯函数的各种输入输出
- 自定义 Hooks - 状态变化和副作用
- MobX Store - 业务逻辑和状态变更
- 组件 - 用户交互和不同状态下的渲染
- API 接口 - 响应解析

❌ **不应该测试：**
- 第三方库（已经测试过了）
- Ant Design Mobile 组件库（不需要重复测试）
- 简单的 getter/setter
- 已经测试过的逻辑

### 测试隔离

- 每个测试用例独立运行
- 每个测试前清理状态
- 不共享状态 between 测试用例
- Mock 每次都要重置
