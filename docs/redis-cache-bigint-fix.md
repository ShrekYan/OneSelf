# Redis 用户信息缓存写入失败问题排查与修复

## 问题描述

用户登录后，代码逻辑执行到「写入 Redis 用户信息缓存」步骤，但实际在 Redis 中找不到缓存数据。

## 问题根因

**核心原因：`bigint` 类型无法直接通过 `JSON.stringify()` 序列化**

### 详细分析

1. **数据来源**：Prisma ORM 将 MySQL 中的 `BIGINT` 类型映射为 TypeScript/JavaScript 的 `bigint` 类型
2. **缓存流程**：登录成功后，从数据库查询到用户信息，准备序列化存入 Redis
3. **失败点**：调用 `JSON.stringify(userInfo)` 时，遇到 `created_at` 和 `updated_at` 两个 `bigint` 字段，抛出异常：

```
TypeError: Do not know how to serialize a BigInt
```

4. **异常处理**：异常被 `catch` 捕获，只记录一条警告日志，主流程继续执行，但缓存实际并未写入成功。

### 代码问题位置

`backend/src/users/user-cache.service.ts` 第 92 行（修复前）：

```typescript
const json = JSON.stringify(userInfo); // ❌ 遇到 bigint 抛出异常
```

## 解决方案

### 修复方式

在 `JSON.stringify` 中添加 `replacer` 回调函数，自动将所有 `bigint` 转换为 `number`：

```typescript
const json = JSON.stringify(userInfo, (key, value) =>
  typeof value === 'bigint' ? Number(value) : value,
);
```

### 为什么安全

| 检查项 | 结论 |
|--------|------|
| 数值范围 | `created_at`/`updated_at` 存储毫秒时间戳，不超过 `Number.MAX_SAFE_INTEGER` (2^53 - 1 ≈ 9e15)，当前时间戳约为 1.7e12，远在安全范围内 |
| 精度丢失 | 不会丢失精度，可以准确还原 |
| 通用性 | 自动处理所有 `bigint` 字段，未来新增字段无需额外修改 |
| 兼容性 | 反序列化读取缓存时，`number` 类型在运行时不影响业务逻辑（代码只做透传） |

## 修复代码对比

**修复前：**

```typescript
try {
  const json = JSON.stringify(userInfo);
  await this.redisService.set(cacheKey, json, 'EX', this.userInfoCacheTtl);
  this.logger.debug(
    `User info cached for username=${username}, ttl=${this.userInfoCacheTtl}s`,
  );
} catch (error) {
  this.logger.warn(...);
}
```

**修复后：**

```typescript
try {
  const json = JSON.stringify(userInfo, (key, value) =>
    typeof value === 'bigint' ? Number(value) : value,
  );
  await this.redisService.set(cacheKey, json, 'EX', this.userInfoCacheTtl);
  this.logger.debug(
    `User info cached for username=${username}, ttl=${this.userInfoCacheTtl}s`,
  );
} catch (error) {
  this.logger.warn(...);
}
```

## 验证方法

### 步骤

1. 清除 Redis 中已有缓存：
   ```bash
   redis-cli
   > DEL user:info:your-username
   ```

2. 重启后端服务

3. 执行登录操作

4. 在 Redis 中检查是否存在缓存：
   ```bash
   redis-cli
   > KEYS user:info:*
   1) "user:info:your-username"
   > GET user:info:your-username
   ```

   应该能得到完整的 JSON 字符串，说明写入成功。

5. 再次登录，应该能命中缓存，跳过数据库查询，查看日志会有：
   ```
   User info cache hit for username=xxx
   ```

### 预期结果

- ✅ Redis 中能看到用户信息缓存
- ✅ 日志中没有 `Failed to cache user info` 警告
- ✅ 二次登录能命中缓存

## 经验总结

1. **JavaScript 特性**：记住 `JSON.stringify` 不支持 `bigint` 序列化，这是常见坑点
2. **Prisma 映射**：Prisma 默认将 `BIGINT` 映射为 `bigint`，使用序列化场景需要特别注意
3. **日志设计**：当前异常捕获设计合理，写入缓存失败不影响主登录流程，只是降级走数据库查询
4. **调试建议**：遇到缓存不生效问题，先看警告日志，本例中警告日志已经提示了问题

## 相关文件

| 文件 | 变更 |
|------|------|
| `backend/src/users/user-cache.service.ts` | 添加 `bigint` 序列化处理 |
| `.claude/plans/tidy-cuddling-shore.md` | 修复方案计划 |

## 修复时间

2026-04-11
