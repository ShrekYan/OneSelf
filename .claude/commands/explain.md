# 代码逻辑解释规范

当需要解释一段代码或一个模块的逻辑时，按照本规范进行清晰、结构化的解释。

---

## 解释步骤

### 第一步：整体概览

1. **这段代码/这个模块是做什么的？** - 一句话概括核心功能
2. **在整个项目中处于什么位置？** - 说明它的上下文和依赖关系
3. **谁在使用它？** - 哪些模块或页面依赖它

### 第二步：结构分析

1. **导出了什么内容？** - 组件、函数、类型、Store
2. **主要组成部分是什么？** - 按顺序说明每个部分职责
3. **数据流是怎样的？** - 输入如何变成输出

### 第三步：逐段（或逐函数）详细解释

对于每个关键函数/逻辑块：

1. **它的输入是什么？** - 参数类型和含义
2. **它做了什么？** - 核心逻辑描述
3. **它返回什么？** - 返回值含义
4. **有什么副作用？** - 是否修改了外部状态、发送了请求等

### 第四步：设计决策说明

1. **为什么这么设计？** - 有什么其他方案吗，为什么选择这个
2. **这里处理了哪些边界情况？** - 错误处理、空值处理、异常情况
3. **有什么性能优化吗？** - 使用了什么优化手段

### 第五步：使用示例

给出一个最简使用示例，帮助理解。

---

## 输出模板

```markdown
## 📝 代码解释：`文件路径`

### 整体功能

一句话说明这段代码解决什么问题。

### 上下文关系

- **位置**: `文件路径`
- **被谁使用**: ...
- **依赖**:
  - `依赖A` - 做什么用
  - `依赖B` - 做什么用

### 结构分析

主要导出：
- `导出1` - 功能说明
- `导出2` - 功能说明

内部结构：
1. `部分A` - 职责说明
2. `部分B` - 职责说明

### 详细逻辑解释

#### `functionName` 函数

```typescript
// 代码片段
```

**输入**:
- `param1: Type` - 说明含义

**逻辑**:
1. 第一步做了什么
2. 第二步做了什么
3. ...

**输出**: `Type` - 说明含义

**边界处理**:
- 处理了什么特殊情况

### 设计决策

> **为什么这里使用 XXX 而不是 YYY？**
>
> 解释原因，比如：
> - 因为项目中已经使用 XXX 保持一致
> - 因为 XXX 在这种场景下性能更好
> - 因为 XXX API 更简洁，减少代码量

### 使用示例

```typescript
// 示例代码
```

### 📌 关键点总结

1. 核心点一
2. 核心点二
3. ...
```

---

## 解释要点

### 针对不同类型代码的解释重点

#### 1. React 组件

重点解释：
- Props 有哪些，各自含义
- 内部状态管理哪些数据
- 副作用（useEffect）做了什么
- 用户交互如何处理
- 什么时候重新渲染

#### 2. 自定义 Hook

重点解释：
- Hook 封装了什么逻辑
- 返回了哪些状态和方法
- 依赖了哪些其他 Hooks
- 清理逻辑做了什么

#### 3. MobX Store

重点解释：
- 管理了什么状态
- 哪些 action 可以修改状态
- computed 派生了哪些数据
- 被哪些组件使用

#### 4. 工具函数

重点解释：
- 输入输出
- 处理了哪些边界情况
- 算法思路（如果复杂）

#### 5. API 模块

重点解释：
- 提供了哪些接口
- 请求/响应类型
- 特殊配置（cache, skipAuth 等）

#### 6. 页面模块

重点解释：
- 页面整体业务流程
- 数据从哪来，到哪去
- 用户操作流程
- 业务规则

---

## 示例解释

看一个完整示例：

---

## 📝 代码解释：`src/hooks/useCountDown.ts`

### 整体功能

实现一个可控制的倒计时功能，支持开始、停止、重置。

### 上下文关系

- **位置**: `src/hooks/useCountDown.ts`
- **被谁使用**: `CountDown` 组件、验证码按钮等需要倒计时的场景
- **依赖**: React `useState`, `useEffect`, `useCallback`

### 结构分析

主要导出：
- `useCountDown` - 自定义 Hook，提供倒计时能力

### 详细逻辑解释

#### `useCountDown` Hook

```typescript
export function useCountDown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  return { seconds, isRunning, start, stop, reset };
}
```

**输入**:
- `initialSeconds: number` - 倒计时初始秒数

**逻辑**:

1. **状态初始化**
   - `seconds` 记录当前剩余秒数，初始为 `initialSeconds`
   - `isRunning` 记录倒计时是否在运行，初始为 `false`

2. **控制方法**
   - `start()` - 设置 `isRunning = true`，开始倒计时
   - `stop()` - 设置 `isRunning = false`，暂停倒计时
   - `reset()` - 重置 `seconds` 为初始值，停止倒计时

3. **定时器逻辑**
   - `useEffect` 依赖 `isRunning` 和 `seconds`，当它们变化时重新执行
   - 如果不在运行或已经到 0，不启动定时器
   - 否则每秒（1000ms）执行一次，秒数减 1
   - 当秒数减到 0 时，自动停止
   - effect 清理函数清除定时器，防止内存泄漏

**输出**:
- `seconds` - 当前剩余秒数
- `isRunning` - 是否正在运行
- `start` - 开始方法
- `stop` - 停止方法
- `reset` - 重置方法

**边界处理**:
- 当秒数到 0 自动停止
- effect 清理定时器，组件卸载时不会内存泄漏
- 重新开始时正确清除旧定时器

### 设计决策

> **为什么把定时器放在 useEffect 里，而不是放在 start 方法里？**
>
> 因为依赖 `isRunning` 和 `seconds`，当它们变化时需要重新创建定时器。放在 useEffect 中，React 会在依赖变化时自动清理旧的 effect 并重新执行，刚好符合我们的需求。这样代码更简洁，也不容易忘记清理。

> **为什么使用 useCallback 包装 start/stop/reset？**
>
> 因为这些方法会作为依赖传给其他 Hook 或者作为 props 传给子组件，使用 `useCallback` 可以保持引用稳定，避免不必要的重渲染。

### 使用示例

```typescript
const { seconds, isRunning, start, stop, reset } = useCountDown(60);

// 开始倒计时
start();

// 暂停
stop();

// 重置
reset();

console.log(`剩余 ${seconds} 秒`);
```

### 📌 关键点总结

1. 使用 `setInterval` 实现每秒递减
2. useEffect 自动管理定时器生命周期，依赖变化自动清理
3. 通过 `useCallback` 稳定方法引用
4. 倒计时到 0 自动停止
5. 支持手动开始、暂停、重置

---

## 解释原则

1. **由粗到细** - 先说整体，再说细节
2. **重点突出** - 复杂逻辑多花篇幅，简单代码一句话带过
3. **不说废话** - 不要重复代码已经说清楚的东西
4. **回答为什么** - 不仅说做了什么，更要解释为什么这么做
5. **帮助理解** - 站在阅读者的角度，哪里可能看不懂就解释哪里

---

## 需要避免

- ❌ 不要逐行翻译代码
- ❌ 不要说"这行定义了一个变量 x"这种废话
- ❌ 不要跳过复杂的设计决策
- ❌ 不要使用太技术化的黑话，用通俗语言解释
- ❌ 不要遗漏边界情况和错误处理的说明
