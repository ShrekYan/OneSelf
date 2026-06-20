# 技术栈能力

必须严格遵循项目现有技术栈：

| 技术 | 版本 | 优化要点 |
|---|---|---|
| React | 19.2.3 | 充分利用 React 19 新特性：自动批处理、`useTransition`、`useDeferredValue`、`useActionState` |
| TypeScript | 5.5.3 | 类型优化不影响运行时性能，避免过度复杂泛型 |
| Vite | 7.3.1 | 利用 tree-shaking、代码分割、打包压缩、预构建优化 |
| MobX | 6.13.5 | 合理粒度划分可观察状态，使用 `computed` 缓存，避免不必要重渲染 |
| Ant Design Mobile | 5.42.3 | 按需引入组件，避免全包导入 |
| React Router | 6.x | 路由懒加载，代码分割 |
| Axios | 1.7.7 | 利用项目内置缓存、重复请求取消、自动重试 |
| es-toolkit | latest | 优先使用，代替 lodash，包体积更小 |

## React 19 专项优化

| 场景 | 推荐方案 | 收益 |
|---|---|---|
| 非紧急状态更新 | `useTransition` 标记为非阻塞 | 保持 UI 响应，避免输入/滚动卡顿 |
| 搜索/过滤大数据 | `useDeferredValue` 延迟渲染 | 输入流畅，列表渲染不影响响应 |
| 表单异步提交 | `useActionState` (React 19+) | 简化状态管理，减少样板代码 |
| 大量列表更新 | `startTransition` 包裹批量更新 | 避免长任务阻塞主线程 |
| 外部 store 订阅 | `useSyncExternalStore` 正确使用 | 避免 concurrent 模式下的不一致 |

## MobX 高级模式

| 场景 | 优化方案 | 注意事项 |
|---|---|---|
| 派生数据 | `computed` 自动缓存，只在依赖变化时重算 | 避免在 computed 中修改其他状态 |
| 精确订阅 | `observer` 包裹在最小范围 | 大列表项使用 `observer` 而非父组件 |
| 批量更新 | 隐式自动批处理 (React 18+) | 避免手动 `runInAction` 包裹 |
| 状态持久化 | `mobx-persist` 仅必要时使用 | 关注 localStorage 性能 |
| 大表单 | 拆分多个小 store，按字段组划分 | 避免单一大 store 频繁更新 |
| reaction 清理 | 在 cleanup 中返回 untrack 函数 | 避免订阅泄漏 |

## 移动端 H5 专项优化

| 领域 | 优化要点 |
|---|---|
| **WebView 优化** | 预加载 WebView，减少首次加载时间；避免同步 bridge 调用 |
| **电池消耗** | 减少长定时器、避免持续重渲染、合理使用 GPU 加速 |
| **低网速适配** | 骨架屏降级、小图占位、数据分页加载 |
| **内存管理** | 及时释放大对象、避免图片缓存无限增长、监控 `performance.memory` |
| **触控优化** | 300ms 点击延迟处理、`touch-action: manipulation`、避免手势冲突 |
| **安全区域** | 使用 `env(safe-area-inset-*)` 适配刘海屏/圆角屏 |
