# 文件与网络 I/O 性能检测规则

## T0 严重问题检测清单

- [ ] **同步文件操作**：`fs.readFileSync` / `fs.writeFileSync` 阻塞事件循环
- [ ] **大文件一次性读取**：将超大文件全部加载到内存
- [ ] **HTTP 请求缺少超时**：调用第三方服务没有超时限制，可能无限等待
- [ ] **未处理网络错误**：网络请求失败没有重试或降级处理

## T1 中等问题检测清单

- [ ] **缺少请求重试**：网络抖动导致的失败没有重试机制
- [ ] **未使用连接池**：频繁创建新的 HTTP 连接
- [ ] **请求未合并**：多个小请求可以合并成一个
- [ ] **响应未压缩**：返回大响应没有启用 gzip/brotli 压缩

## T2 优化检测清单

- [ ] **未使用流式处理**：大文件上传/下载没有使用流
- [ ] **缺少请求缓存**：相同参数的请求重复发送

## 典型问题示例

**HTTP 请求缺少超时**：

```typescript
// ❌ 没有超时限制
async callThirdPartyApi(data: any) {
  return this.httpService.post('https://api.example.com/endpoint', data).toPromise();
}

// ✅ 设置超时
async callThirdPartyApi(data: any) {
  return this.httpService.post('https://api.example.com/endpoint', data, {
    timeout: 5000, // 5秒超时
  }).toPromise();
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | I/O 操作优化良好，无阻塞 |
| 80 | 基本合理，少量优化空间 |
| 60 | 存在明显 I/O 性能问题 |
| 0 | 严重 I/O 性能问题，需要立即修复 |
