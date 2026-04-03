# 03 - 状态、逻辑与数据流规范

## 状态管理 (MobX)
- **局部状态**: 页面级使用 `useLocalObservable` 创建，`useObserver` 渲染
- **更新规范**: 异步操作中的状态更新必须包裹在 `runInAction` 中
- **类型定义**: 必须为 Store 显式定义 Interface 类型
- **监听规范**: ❌ **禁止**在 `useEffect` 依赖数组中监听 `store` 或 store 对象属性（引用不变，监听无效）。如需监听可观察变量变化，请使用 MobX 的 `reaction`。

  ```tsx
  // ✅ 正确：使用 reaction 监听具体的 observable 值变化
  useEffect(() => {
    const dispose = reaction(
      () => store.selectedCategoryId, // 监听具体的 observable
      () => {
        // 变化时执行副作用（如请求接口）
        store.fetchArticles();
      }
    );
    return dispose;
  }, [store]);

  // ❌ 错误：store 引用不变，React 依赖数组无法追踪 MobX 内部变化
  useEffect(() => {
    store.fetchArticles();
  }, [store.selectedCategoryId]);
  ```

## 表单处理 (React Hook Form + Zod)
- **验证**: 使用 Zod 定义 Schema，通过 `z.infer` 推断类型
- **结构**: 分离 `schema.ts` (校验) 和 `constant.ts` (配置)

## API 请求
- **统一调用**: 严禁在组件内直接使用 axios，必须使用 `@/api/` 下定义的模块
- **全局拦截**: 拦截器自动处理 Token、401 跳转及通用错误 Toast
- **缓存**: 静态配置类数据建议开启 `cache: true`

## 路由规范
- **编程式导航**: 统一使用 `useNavigate` Hook，**禁止使用 `<a>` 标签跳转**
- **参数获取**: 使用 `useParams` (路径参数) 和 `useSearchParams` (查询参数)

## 常用工具
- **es-toolkit**: `debounce`, `throttle`
- **classnames**: 条件类名合并
- **react-use**: `useEffectOnce` 等常用 Hook
