# React 19 + MobX 专项检查

## React 19 新特性利用

| 场景 | 推荐方案 | 预期收益 |
|------|----------|----------|
| 非紧急状态更新 | `useTransition` 标记为非阻塞 | 保持 UI 响应 |
| 搜索/过滤大数据 | `useDeferredValue` 延迟渲染 | 输入流畅 |
| 表单异步提交 | `useActionState` | 简化状态管理 |
| 大量列表更新 | `startTransition` 包裹批量更新 | 避免长任务 |
| 外部 store 订阅 | `useSyncExternalStore` 正确使用 | 避免不一致 |

## MobX 高级模式

| 场景 | 优化方案 | 注意事项 |
|------|----------|----------|
| 派生数据 | `computed` 自动缓存 | 避免在 computed 中修改其他状态 |
| 精确订阅 | `observer` 包裹在最小范围 | 大列表项使用 `observer` 而非父组件 |
| 批量更新 | 隐式自动批处理 (React 18+) | 避免手动 `runInAction` 包裹 |
| 状态持久化 | `mobx-persist` 仅必要时使用 | 关注 localStorage 性能 |
| 大表单 | 拆分多个小 store，按字段组划分 | 避免单一大 store 频繁更新 |
| reaction 清理 | 在 cleanup 中返回 untrack 函数 | 避免订阅泄漏 |

## Vite 7 构建优化

| 检查点 | 优化方案 | 验证方式 |
|--------|----------|----------|
| 代码分割 | 路由级 + 组件级分割 | `vite build` 产物分析 |
| Tree Shaking | 检查 ESM 导入、按需引入 | 产物大小对比 |
| 依赖预构建 | `vite.config.ts` 优化 `optimizeDeps` | 启动时间对比 |
| 资源内联 | 小资源 base64 内联 | 产物数量对比 |
| Chunk 策略 | `manualChunks` 提取公共依赖 | 重复模块对比 |
