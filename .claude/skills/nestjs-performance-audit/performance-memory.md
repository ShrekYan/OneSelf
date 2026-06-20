# 内存管理检测规则

## T0 严重问题检测清单

- [ ] **大对象静态存储**：把超大查询结果存在静态变量/全局变量中永远不释放
- [ ] **内存泄漏风险**：全局 Map/Set 不断增长，只增不删
- [ ] **一次性加载全表数据到内存**：把几万条数据全查到内存再过滤，应该让数据库过滤
- [ ] **未正确清理定时器/事件监听器**：模块销毁后仍然持有引用

## T1 中等问题检测清单

- [ ] **不必要的大对象克隆**：对大对象做深度拷贝消耗内存和 CPU
- [ ] **闭包持有大对象引用**：导致 GC 无法回收

## T2 优化检测清单

- [ ] **过多使用全局状态**：应该请求级别的状态存在全局

## 典型问题示例

**内存泄漏 - 全局 Map 只增不减**：

```typescript
// ❌ 全局缓存永不清理
const globalCache = new Map<string, any>();
async processRequest(id: string) {
  const data = await fetchData(id);
  globalCache.set(id, data); // 只增不减，内存持续增长
}

// ✅ 使用带过期策略的缓存
const cache = new Map<string, { data: any; expiresAt: number }>();
async processRequest(id: string) {
  // 清理过期缓存
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expiresAt < now) cache.delete(key);
  }
  // ...
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 内存管理完善，无泄漏风险 |
| 80 | 基本合理，少量优化空间 |
| 60 | 存在明显内存问题 |
| 0 | 严重内存问题，需要立即修复 |
