# 安全认证性能检测规则

## T0 严重问题检测清单

- [ ] **JWT 验证开销过大**：每个请求都重新解析和验证 JWT，没有缓存验证结果
- [ ] **频繁数据库权限检查**：每个请求都查询数据库验证权限
- [ ] **认证中间件阻塞**：同步执行耗时的认证逻辑
- [ ] **会话存储效率低**：使用数据库存储会话，频繁查询

## T1 中等问题检测清单

- [ ] **缺少认证缓存**：相同 token 重复验证
- [ ] **权限检查粒度太细**：每次操作都检查权限，没有批量验证
- [ ] **密码哈希开销过大**：使用过强的哈希算法导致登录缓慢

## T2 优化检测清单

- [ ] **可以缓存的权限没有缓存**：用户角色权限基本不变，但每次都查询
- [ ] **缺少请求频率限制**：可能被恶意请求耗尽资源

## 典型问题示例

**JWT 验证没有缓存**：

```typescript
// ❌ 每次请求都重新验证 JWT
async use(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = this.jwtService.verify(token);
  req.user = decoded;
  next();
}

// ✅ 缓存已验证的 token
private tokenCache = new Map<string, any>();
async use(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  let decoded = this.tokenCache.get(token);
  if (!decoded) {
    decoded = this.jwtService.verify(token);
    this.tokenCache.set(token, decoded);
    setTimeout(() => this.tokenCache.delete(token), 300000); // 5分钟过期
  }
  req.user = decoded;
  next();
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 认证配置合理，无性能瓶颈 |
| 80 | 基本合理，少量优化空间 |
| 60 | 存在明显认证性能问题 |
| 0 | 严重认证性能问题，需要立即修复 |
