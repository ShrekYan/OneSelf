# 接口性能检测规则

## T0 严重问题检测清单

- [ ] **缺少分页机制**：列表接口没有分页，一次性返回全部数据
- [ ] **未限制最大查询数量**：`pageSize` 没有上限，攻击者可以一次拉取全表
- [ ] **大结果集返回**：不做裁剪直接返回上千条记录给前端
- [ ] **同步阻塞操作**：在请求线程中执行 CPU 密集计算或同步 IO 操作
- [ ] **串行执行多个独立查询**：多个独立查询没有用 `Promise.all` 并行执行

## T1 中等问题检测清单

- [ ] **未使用流式返回**：导出大文件一次性读到内存再返回
- [ ] **响应包含不必要的字段**：返回敏感字段或前端不需要的冗余字段
- [ ] **没有使用压缩**：返回大 JSON 没有开启 gzip/brotli 压缩

## T2 优化检测清单

- [ ] **HTTP 方法选择不当**：用 POST 查询数据（不利于缓存）
- [ ] **接口响应时间过长**：超过 500ms 需要优化

## 典型问题示例

**串行执行独立查询**：

```typescript
// ❌ 串行执行，总耗时 = 查询用户 + 查询订单 + 查询消息
const user = await this.prisma.user.findUnique({ where: { id: userId } });
const orders = await this.prisma.order.findMany({ where: { userId } });
const messages = await this.prisma.message.findMany({ where: { userId } });

// ✅ 并行执行，总耗时 = max(查询用户, 查询订单, 查询消息)
const [user, orders, messages] = await Promise.all([
  this.prisma.user.findUnique({ where: { id: userId } }),
  this.prisma.order.findMany({ where: { userId } }),
  this.prisma.message.findMany({ where: { userId } }),
]);
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 接口设计完全符合性能最佳实践 |
| 80 | 基本符合，少量优化空间 |
| 60 | 存在明显性能问题 |
| 0 | 严重性能问题，需要立即修复 |
