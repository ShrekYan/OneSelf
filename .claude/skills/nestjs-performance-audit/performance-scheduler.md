# 定时任务与调度性能检测规则

## T0 严重问题检测清单

- [ ] **定时任务重叠执行**：上一次任务还未完成，下一次任务又开始
- [ ] **任务没有超时控制**：定时任务可能无限运行，占用资源
- [ ] **分布式任务冲突**：多实例部署时，同一任务被多个实例同时执行
- [ ] **任务失败没有重试**：定时任务失败后没有重试机制

## T1 中等问题检测清单

- [ ] **任务调度策略不合理**：高峰期执行资源密集型任务
- [ ] **任务没有隔离**：一个任务失败影响其他任务
- [ ] **任务缺少监控**：任务执行状态和耗时没有监控

## T2 优化检测清单

- [ ] **任务可以合并**：多个小任务可以合并执行
- [ ] **任务没有优先级**：所有任务同等优先级，关键任务可能被延迟

## 典型问题示例

**定时任务重叠执行**：

```typescript
// ❌ 如果执行时间超过1分钟，会重叠
@Cron('0 * * * *') // 每分钟执行
async generateReport() {
  await this.longRunningTask();
}

// ✅ 防止重叠执行
private isRunning = false;
@Cron('0 * * * *')
async generateReport() {
  if (this.isRunning) {
    this.logger.warn('Report generation is already running');
    return;
  }
  this.isRunning = true;
  try {
    await this.longRunningTask();
  } finally {
    this.isRunning = false;
  }
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 任务调度合理，无冲突和重叠 |
| 80 | 基本合理，少量优化空间 |
| 60 | 存在明显调度问题 |
| 0 | 严重调度问题，需要立即修复 |
