# Auth 模块 Redis 密码缓存重构记录

## 重构背景

重构前：
- `auth.service.ts` 达到 **664 行**，代码臃肿
- 添加 Redis 密码缓存后，`login` 方法内联了约 120 行缓存逻辑
- 职责不清晰，`AuthService` 同时承担核心认证 + 缓存逻辑，阅读维护困难
- 缓存逻辑无法复用，如果其他地方需要密码缓存只能复制代码

## 重构目标

1. 抽离 Redis 密码缓存逻辑到独立服务，实现**职责分离**
2. 保持原有业务逻辑不变，只做代码重构，不改变行为
3. 提高代码可维护性和可复用性
4. 便于后期问题排查，添加完善的日志记录

---

## 方案演进过程

### 第一步：初始需求 - 抽离密码缓存服务

#### 原始问题
> 近期添加了 redisService 服务，导致注册和登陆接口的方法极速膨胀，阅读和维护起来比较困难。

#### 第一个方案：抽离 `PasswordCacheService`

| 设计要点 | 内容 |
|---------|------|
| **新增文件** | `src/auth/password-cache.service.ts` |
| **职责** | 封装密码缓存所有 Redis 操作（get/set/delete/update） |
| **TTL** | 原代码 10 分钟 (600s) |
| **缓存键** | `login:password:${username}` |

**讨论点：TTL 时长**

用户提出问题：**10 分钟是否太短了，因为用户不可能经常退出和登陆**

分析：

| TTL | 优点 | 缺点 |
|-----|------|------|
| 10 分钟 | 一致性好，修改密码后很快生效 | 缓存命中率低，用户几小时/几天才登录一次几乎命中不了 |
| 1 小时 | 缓存命中率提高，更实用 | 一致性窗口扩大到 1 小时，可接受 |

**决策**：**TTL 改为 1 小时 (3600s)**

---

### 第二步：架构设计讨论 - 分层公共服务

用户提出要求：
> 为了后期便于使用 redis 服务，redis 的基本配置、设置和获取是否同一做成公共服务，便于后期扩展。

#### 方案对比

| 方案 | 描述 | 评价 |
|------|------|------|
| 方案一：密码缓存服务直接使用 `RedisService` | 当前设计 | ✅ 推荐，分层清晰 |
| 合并方案：`RedisService` 直接包含业务缓存方法 | 把密码缓存逻辑放在 `RedisService` 中 | ❌ 不推荐，违反单一职责，公共服务变臃肿 |

**最终采纳的分层架构**：

| 层 | 服务 | 位置 | 职责 |
|------|------|------|------|
| **基础设施层** | `RedisService` | `src/redis/redis.service.ts` | 统一 Redis 连接配置、自动重连、健康检查、基础 `get/set/del` 操作 |
| **业务缓存层** | `PasswordCacheService` | `src/auth/password-cache.service.ts` | 基于 `RedisService` 封装业务特定的缓存逻辑（键格式、TTL、错误处理） |

**优点**：
- ✅ 单一职责：每个服务只做一件事
- ✅ 可扩展性：未来新增其他缓存需求（Token 黑名单、文章缓存）只需要新增业务缓存服务，不需要修改 `RedisService`
- ✅ 符合 NestJS 模块化原则：基础设施层和业务层分离

---

### 第三步：日志设计讨论

用户提出想法：
> redis 成功调用后应该记录在日志中（我们自定义的日志系统），这样方便后续问题排查，有没有更好的方案，类似于全局监听的这种，不然我每一个方法都需要添加，类似于拦截器的。

#### 方案对比

| 方案 | 描述 | 优点 | 缺点 |
|------|------|------|------|
| 方案一：每个业务方法手动加日志 | 在 `PasswordCacheService` 的每个方法里添加 `appendJsonLog` | 简单直接 | 重复代码，新增方法还要手动加，格式可能不统一 |
| **方案二：`RedisService` 层统一日志** | 重写 `get/set/del` 方法，在基础设施层统一记录 | ✅ **推荐**：一次配置，所有使用自动受益；格式统一；对业务零侵入 | 需要修改 `RedisService` |

**最终采纳**：**在 `RedisService` 层统一记录所有 `get/set/del` 操作日志**

---

## 最终设计方案

### 架构图

```
┌─────────────────────────────────────────────────────────┐
│          业务层 (AuthService)                              │
│                                                             │
│  核心认证逻辑：用户查找 → 密码验证 → Token 生成              │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│        业务缓存层 (PasswordCacheService)                    │
│                                                             │
│  封装业务规则：缓存键生成 → TTL → 业务错误处理                │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│        基础设施层 (RedisService)                            │
│                                                             │
│  统一处理：连接配置 → 自动重连 → 健康检查 → 操作日志记录    │
│  （所有 get/set/del 自动记录到自定义日志系统）              │
└─────────────────────────────────────────────────────────┘
```

### 文件变更

| 文件 | 变更类型 | 行数 | 说明 |
|------|----------|------|------|
| `src/auth/password-cache.service.ts` | 新增 | +129 | 独立密码缓存服务，封装所有密码缓存逻辑 |
| `src/auth/auth.module.ts` | 修改 | +2 | 添加 `PasswordCacheService` 到 providers |
| `src/auth/auth.service.ts` | 修改 | 664 → 610 (-54) | 移除内联缓存代码，注入 `PasswordCacheService`，委托缓存逻辑 |
| `src/redis/redis.service.ts` | 修改 | 168 → 269 (+101) | 新增统一 Redis 操作日志，重写 `get/set/del` |

### 核心代码设计

#### 1. `PasswordCacheService` (业务缓存层)

```typescript
@Injectable()
export class PasswordCacheService {
  private readonly logger = new Logger(PasswordCacheService.name);
  private readonly passwordCacheTtl = 3600; // 1小时

  constructor(private readonly redisService: RedisService) {}

  // 获取缓存密码哈希
  async getCachedPasswordHash(username: string): Promise<string | null>

  // 删除密码缓存
  async deletePasswordCache(username: string): Promise<void>

  // 设置密码缓存
  async setPasswordCache(username: string, passwordHash: string): Promise<void>

  // 密码迁移后更新缓存
  async updatePasswordCacheAfterMigration(
    username: string,
    newPasswordHash: string,
  ): Promise<void>
}
```

#### 2. `RedisService` 统一日志 (基础设施层)

```typescript
// 新增私有方法：统一记录操作日志
private logRedisOperation(
  operation: 'get' | 'set' | 'del',
  key: string,
  success: boolean,
  error?: Error,
): void {
  appendJsonLog({
    timestamp: new Date().toISOString(),
    level: success ? 'debug' : 'error',
    context: RedisService.name,
    message: `Redis ${operation} operation ${success ? 'succeeded' : 'failed'}`,
    operation,
    key,
    error: error ? (error instanceof Error ? error.message : String(error)) : undefined,
    env: process.env.NODE_ENV || 'development',
  });
}

// 重写 get
override async get(key: string): Promise<string | null> {
  try {
    const result = await super.get(key);
    this.logRedisOperation('get', key, true);
    return result;
  } catch (error) {
    this.logRedisOperation('get', key, false, error as Error);
    throw error;
  }
}

// 重写 set
override async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
  try {
    const result = await super.set(key, value, ...args);
    this.logRedisOperation('set', key, true);
    return result;
  } catch (error) {
    this.logRedisOperation('set', key, false, error as Error);
    throw error;
  }
}

// 重写 del（兼容 ioredis 重载）
override del(...args: any[]): Promise<number> {
  try {
    const keys = args.filter(arg => typeof arg === 'string' || Buffer.isBuffer(arg)) as string[];
    const result = super.del(...args) as Promise<number>;
    keys.forEach(key => {
      if (typeof key === 'string') {
        this.logRedisOperation('del', key, true);
      }
    });
    return result;
  } catch (error) {
    const keys = args.filter(arg => typeof arg === 'string' || Buffer.isBuffer(arg)) as string[];
    const firstKey = keys.length > 0 ? keys[0] : 'unknown';
    this.logRedisOperation('del', String(firstKey), false, error as Error);
    throw error;
  }
}
```

### 日志输出示例

```json
{
  "timestamp": "2026-04-11T10:30:00.000Z",
  "level": "debug",
  "context": "RedisService",
  "message": "Redis get operation succeeded",
  "operation": "get",
  "key": "login:password:admin",
  "env": "development"
}
```

---

## 方案优缺点评价

### 最终方案优点

| 维度 | 评价 |
|------|------|
| **单一职责** | ⭐⭐⭐⭐⭐ - 每个服务职责清晰，不越界 |
| **可复用性** | ⭐⭐⭐⭐⭐ - `RedisService` 可被所有业务缓存服务复用 |
| **可扩展性** | ⭐⭐⭐⭐⭐ - 新增缓存需求只需新增业务服务，不影响基础设施 |
| **可维护性** | ⭐⭐⭐⭐⭐ - 日志统一记录，格式一致，方便排查 |
| **DRY 原则** | ⭐⭐⭐⭐⭐ - 避免重复代码，一次编写处处受益 |
| **对业务侵入性** | ⭐⭐⭐⭐⭐ - 零侵入，业务代码不需要修改自动受益 |
| **风险可控** | ⭐⭐⭐⭐⭐ - 不改变原有业务逻辑，只做代码移动 |

### 可能的改进点（未来）

| 改进点 | 说明 | 优先级 |
|--------|------|--------|
| 日志级别可配置 | 通过环境变量 `REDIS_DEBUG_LOG` 控制是否开启 debug 日志，生产环境可以关闭减少日志量 | ⭐⭐ 低 |
| 支持更多 Redis 命令 | 目前只日志 `get/set/del`，如果用到其他命令可以继续扩展 | ⭐⭐ 低 |
| 慢查询日志 | 记录执行时间，超过阈值（如 100ms）输出警告，便于性能排查 | ⭐⭐⭐ 中 |
| 修改密码主动清缓存 | 在修改密码接口调用 `passwordCacheService.deletePasswordCache()`，保证即时一致性 | ⭐⭐⭐⭐ 高（当有修改密码功能时需要加）|

---

## 重构前后对比

| 指标 | 重构前 | 重构后 |
|------|--------|--------|
| `auth.service.ts` 行数 | 664 | 610 (-54) |
| `login` 方法内联缓存代码 | 约 120 行 | ~30 行（仅调用）|
| 缓存逻辑可复用 | ❌ 不可复用 | ✅ 可复用 |
| Redis 操作日志 | ⚠️ 只有错误记录，成功不记录 | ✅ 所有成功失败都记录 |
| 架构分层 | ❌ 混乱 | ✅ 清晰 |

---

## 验证结果

重构后验证：

```bash
cd backend
npm run build   # ✅ TypeScript 编译通过
npm run lint    # ✅ ESLint 检查通过（0 错误 0 警告）
```

所有测试用例预期：

| 测试用例 | 预期结果 |
|---------|---------|
| 缓存命中：二次登录 | 登录成功，日志有 `Redis get operation succeeded` |
| 缓存未命中：首次登录 | 登录成功，写入缓存，日志有 get + set 两条记录 |
| 用户不存在 | 登录失败，删除缓存，日志有 get + del 两条记录 |
| 密码算法迁移 | 迁移成功，缓存更新，日志有 set 记录 |
| Redis 不可用 | 降级到数据库，登录成功，日志有 error 记录 |

---

## 最终决策总结

1. **TTL**：1 小时 (3600s) → 平衡命中率和一致性
2. **架构**：分层设计 → `RedisService` (基础设施) + `PasswordCacheService` (业务缓存)
3. **日志**：基础设施层统一拦截 → 所有 Redis 操作自动日志，对业务零侵入
4. **原则**：单一职责 + DRY + 对原有代码最小修改 → 风险可控

---

## 改造时间线

| 阶段 | 时间 | 内容 |
|------|------|------|
| 需求分析 | - | `auth.service.ts` 方法膨胀，需要抽离 Redis 逻辑 |
| 方案讨论 | - | TTL 时长 → 分层架构 → 日志方案 |
| 实施编码 | - | 创建新服务 + 修改现有代码 + 解决类型问题 |
| 验证编译 | - | 编译通过 + lint 通过 |
| 文档整理 | 2026-04-11 | 本文档 |

---

## 相关文件

- [password-cache.service.ts](../../../src/auth/password-cache.service.ts)
- [auth.service.ts](../../../src/auth/auth.service.ts)
- [auth.module.ts](../../../src/auth/auth.module.ts)
- [redis.service.ts](../../../src/redis/redis.service.ts)
