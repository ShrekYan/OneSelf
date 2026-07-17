# 异步处理检测规则

## T0 严重问题检测清单

- [ ] **本该异步的操作同步执行**：发送邮件、调用第三方推送、上传文件等慢操作同步等待
- [ ] **未使用任务队列处理**：批量导入、发送通知等高延迟操作直接在请求链路中处理
- [ ] `Promise.all` 中包含无关操作，一个失败全部失败

## T1 中等问题检测清单

- [ ] **过度并发**：同时启动上百个并发请求，打满线程池
- [ ] **缺少重试机制**：对第三方服务调用失败没有退避重试

## T2 优化检测清单

- [ ] **可以并行的操作串行执行**：优化空间，但不严重

## 典型问题示例

**慢操作同步执行**：

```typescript
// ❌ 同步发送邮件，阻塞响应
@Post()
async createOrder(@Body() data: CreateOrderDto) {
  const order = await this.prisma.order.create({ data });
  await this.emailService.sendOrderEmail(order);
  return order;
}

// ✅ 异步发送，不阻塞响应
@Post()
async createOrder(@Body() data: CreateOrderDto) {
  const order = await this.prisma.order.create({ data });
  this.emailService.sendOrderEmail(order).catch(console.error);
  return order;
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 异步处理完善，无阻塞操作 |
| 80 | 基本合理，少量优化空间 |
| 60 | 存在明显异步问题 |
| 0 | 严重异步问题，需要立即修复 |
