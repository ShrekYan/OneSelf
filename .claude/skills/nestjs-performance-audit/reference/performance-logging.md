# 日志与监控性能检测规则

## T0 严重问题检测清单

- [ ] **过度日志记录**：在高频循环或热点路径中进行大量日志输出
- [ ] **同步日志写入**：使用同步方式写入日志文件，阻塞事件循环
- [ ] **日志级别配置不当**：生产环境使用 DEBUG 级别，产生大量日志
- [ ] **敏感信息日志**：日志中记录密码、token 等敏感信息（同时也是安全问题）

## T1 中等问题检测清单

- [ ] **缺少性能监控埋点**：关键业务路径没有埋点，无法追踪性能问题
- [ ] **日志格式化开销过大**：复杂的日志格式化在高频调用中累积性能损耗
- [ ] **未使用结构化日志**：使用字符串拼接而非 JSON 结构化日志，增加解析开销

## T2 优化检测清单

- [ ] **日志缺少采样**：高频操作每次都记录日志，可以采样记录
- [ ] **未使用日志轮转**：日志文件无限增长，占用磁盘空间

## 典型问题示例

**高频循环中的日志记录**：

```typescript
// ❌ 高频循环中每次都记录日志
async processItems(items: Item[]) {
  for (const item of items) {
    this.logger.debug(`Processing item: ${JSON.stringify(item)}`);
    await this.processItem(item);
  }
}

// ✅ 只在 DEBUG 级别且采样率内记录
async processItems(items: Item[]) {
  this.logger.debug(`Processing ${items.length} items`);
  for (const item of items) {
    if (this.logger.isDebugEnabled() && Math.random() < 0.1) {
      this.logger.debug(`Processing item: ${item.id}`);
    }
    await this.processItem(item);
  }
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 日志配置合理，无性能影响 |
| 80 | 基本合理，少量优化空间 |
| 60 | 存在明显日志性能问题 |
| 0 | 严重日志性能问题，需要立即修复 |
