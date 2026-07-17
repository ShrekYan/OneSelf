# 各类测试编写规范

## 纯函数测试

### 适用范围

`useStore.ts` 中的纯函数、`utils/` 目录下的工具函数、数据格式化、过滤、排序等逻辑。

### 规则

- 测试所有输入分支
- 测试边界条件
- 测试异常输入
- 覆盖率要求 100%

### 示例

参考 [examples/pure-function-test.example.ts](../examples/pure-function-test.example.ts)。

## 工具函数测试

### 规则

- 和纯函数测试一样要求 100% 覆盖率
- 测试所有分支和边界

### 示例

参考 [examples/pure-function-test.example.ts](../examples/pure-function-test.example.ts)。

## 自定义 Hook 测试

使用 `renderHook` + `act` 进行测试。

### 规则

- 测试初始状态
- 测试状态变更
- 测试副作用
- 测试清理逻辑

### 示例

参考 [examples/hook-test.example.ts](../examples/hook-test.example.ts)。

## 页面 useStore.ts 测试

项目页面使用 `useLocalObservable` + 对象字面量管理局部状态，需要测试业务逻辑。

### 规则

- 使用 `renderHook` 测试
- 每个测试重新渲染，保证隔离
- 使用 `act` 包裹 action 调用
- 测试初始状态、每个 action 对状态的修改

### 示例

参考 [examples/store-test.example.ts](../examples/store-test.example.ts)。

## MobX 全局 Store 测试

### 规则

- 每个测试新建实例，保证隔离
- 测试初始状态
- 测试每个 action 对状态的修改
- 测试 computed 值

### 示例

参考 [examples/mobx-store-test.example.ts](../examples/mobx-store-test.example.ts)。

## React 组件测试

使用 React Testing Library 测试。

### 规则

- 测试渲染
- 测试用户交互（点击、输入等）
- 测试不同 props 下的不同渲染
- 测试回调函数是否正确调用
- 按照用户行为测试，不要测试实现细节

### 查询元素优先级

必须按以下优先级查询元素：

1. `getByRole`：可访问性查询（推荐）
2. `getByLabelText`：表单元素
3. `getByPlaceholderText`：输入框占位符
4. `getByText`：文本内容
5. `getByDisplayValue`：表单值
6. `getByAltText`：图片
7. `data-testid`：最后手段

### 示例

参考 [examples/component-test.example.tsx](../examples/component-test.example.tsx)。
