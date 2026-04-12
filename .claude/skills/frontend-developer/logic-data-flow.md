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

## 多接口并发请求初始化

### 核心原则
- **全并发优先**: 页面初始化需要多个独立接口时，优先全部并发同时请求，避免串行等待，提升首屏速度
- **职责分离**: `fetchXxx` 函数只负责发起请求返回数据，错误处理和状态更新放到外层统一处理
- **统一结果处理**: 使用 `Promise.allSettled` 等待所有请求完成，然后逐个处理每个请求的结果
- **容错隔离**: 单个请求失败不影响其他请求，保证能展示的部分都展示给用户，不白屏

### 推荐模式

```typescript
async fetchInitialData(): Promise<void> {
  const userId = rootStore.app.userInfo?.id;

  // 并发发起所有独立请求（可选请求动态加入）
  const results = await Promise.allSettled([
    this.fetchArticles(),
    this.fetchCategories(),
    this.fetchFeaturedArticles(),
    ...(userId ? [this.fetchUserLikeList()] : []),
  ]);

  // 逐个类型断言处理结果
  const articlesResult = results[0] as PromiseSettledResult<ArticleItem[]>;
  if (articlesResult.status === 'fulfilled') {
    this.setArticles(articlesResult.value);
  } else {
    console.error('加载文章列表失败:', articlesResult.reason);
  }

  const categoriesResult = results[1] as PromiseSettledResult<CategoryItem[]>;
  if (categoriesResult.status === 'fulfilled') {
    this.setCategories(categoriesResult.value);
  } else {
    console.error('加载分类失败:', categoriesResult.reason);
  }

  // ... 其他请求同理逐个处理

  // 所有数据就绪后，统一处理依赖逻辑（如应用点赞状态）
  if (this.likedArticleIds.size > 0) {
    this.applyLikeStatusToArticles();
  }

  // 统一关闭 loading
  this.setLoading(false);
  this.setCategoriesLoading(false);
}

// 每个 fetchXxx 只负责：开启 loading + 发起请求 + 返回数据
private async fetchArticles(): Promise<ArticleItem[]> {
  this.setLoading(true);
  const response = await api.article.listArticles({
    page: 1,
    pageSize: 10,
    categoryId: this.activeCategoryId || undefined,
  });
  return response.list;
}
```

### 方式对比

| 方式 | 特点 | 推荐 |
|------|------|------|
| 每个 `fetchXxx` 内部 `try/catch` 自己处理错误和更新 | 逻辑分散，不便于整体流程把控 | ❌ 不推荐 |
| `Promise.allSettled` 后统一逐个处理 | 职责清晰，集中处理，易于调试 | ✅ 推荐 |

### 关键要点
- ❗ **每个 `fetchXxx` 只返回数据**: 不处理错误，不更新状态，职责单一
- ❗ **类型断言**: `results[0] as PromiseSettledResult<ReturnType>` 解决 TypeScript 类型推断问题
- ❗ **loading 管理**: 需要的请求在 `fetchXxx` 内部**开启**，全部处理完后**统一关闭**
- ❗ **条件并发**: 可选请求（如需要登录的点赞列表）通过展开运算符动态加入
- ❗ **失败不阻塞**: 一个请求失败只打日志，不影响其他成功请求更新状态，页面部分可用比全错更好

## 路由规范
- **编程式导航**: 统一使用 `useNavigate` Hook，**禁止使用 `<a>` 标签跳转**
- **参数获取**: 使用 `useParams` (路径参数) 和 `useSearchParams` (查询参数)

## 常用工具
- **es-toolkit**: `debounce`, `throttle`
- **classnames**: 条件类名合并
- **react-use**: `useEffectOnce` 等常用 Hook
