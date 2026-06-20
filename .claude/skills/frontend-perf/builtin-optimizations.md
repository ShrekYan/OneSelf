# 项目已内置优化设施

| 优化设施 | 位置 | 使用场景 | 正确用法 |
|----------|------|----------|----------|
| **请求缓存** | `apps/web/src/api/request-cache.ts` | 不常变的 GET 数据 | `api.get(url, { cache: true, cacheTime: 5 * 60 * 1000 })` |
| **重复请求取消** | `apps/web/src/api/cancel-manager.ts` | 并发重复请求 | 自动处理，无需手动 |
| **路由缓存** | `react-activation` + `react-freeze` | 保留列表状态 | 只缓存列表页，不缓存详情页 |
| **自动重试** | `axios-instance.ts` | 网络抖动失败 | 自动重试幂等请求 |
| **MobX 工具** | `mobx`、`mobx-react-lite` | 响应式状态 | 使用 `observer`、`computed` |
