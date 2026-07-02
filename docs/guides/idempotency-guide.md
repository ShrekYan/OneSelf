# 分布式系统幂等键学习指南

> **适用对象**: 后端开发新手
> **学习目标**: 理解幂等概念、掌握幂等键的实现方法、能在项目中正确应用
> **预计阅读时间**: 15分钟

---

## 目录

1. [什么是幂等](#1-什么是幂等)
2. [为什么需要幂等](#2-为什么需要幂等)
3. [幂等键的工作原理](#3-幂等键的工作原理)
4. [幂等实现的几种方式](#4-幂等实现的几种方式)
5. [你的博客项目中的幂等场景](#5-你的博客项目中的幂等场景)
6. [分布式系统为什么必须用幂等键](#6-分布式系统为什么必须用幂等键)
7. [完整实现案例](#7-完整实现案例)
8. [幂等键的生成规则](#8-幂等键的生成规则)
9. [常见坑和解决方案](#9-常见坑和解决方案)
10. [什么时候需要用幂等键](#10-什么时候需要用幂等键)
11. [学习检查清单](#11-学习检查清单)

---

## 1. 什么是幂等

### 1.1 简单理解

**幂等（Idempotent）**：同一个操作执行**1次**和执行**N次**，结果是一样的。

### 1.2 生活中的例子

| 操作 | 是否幂等 | 原因 |
|------|---------|------|
| 把音量调到50 | ✅ 幂等 | 调1次和调10次，音量都是50 |
| 音量加1 | ❌ 不幂等 | 调1次是51，调10次是60 |
| 把门设置为"打开" | ✅ 幂等 | 开1次和开10次，门都是开的 |
| 按门铃 | ❌ 不幂等 | 按1次响1次，按10次响10次 |

### 1.3 技术层面的定义

```typescript
// 幂等操作
function setId(value: number): void {
  this.value = value; // 调用1次和调用N次，结果一样
}

// 非幂等操作
function increment(): void {
  this.value++; // 调用1次和调用N次，结果不同
}
```

---

## 2. 为什么需要幂等

### 2.1 核心问题

**网络是不可靠的**，客户端不知道请求是否成功。

### 2.2 真实场景

```
用户点击"支付"按钮
    ↓
前端发送支付请求
    ↓
后端处理成功，但网络断了
    ↓
前端没收到响应，以为失败了
    ↓
用户再次点击"支付" ← 钱被扣了两次！
```

### 2.3 没有幂等的后果

| 场景 | 后果 |
|------|------|
| 支付 | 重复扣款 |
| 创建订单 | 创建多个相同订单 |
| 发送通知 | 用户收到多条相同通知 |
| 更新库存 | 库存被重复扣减 |

---

## 3. 幂等键的工作原理

### 3.1 核心思想

每次重要操作，客户端生成一个**唯一ID**，服务端用这个ID来判断"这个操作是否已经执行过"。

### 3.2 工作流程

```
客户端生成: idempotencyKey = "pay-20240702-abc123"

第一次请求:
  POST /pay
  Headers: { 'Idempotency-Key': 'pay-20240702-abc123' }
  Body: { orderId: '123', amount: 10 }

服务端:
  1. 检查Redis: GET idem:pay-20240702-abc123
  2. 没有 → 执行支付 → 结果存到Redis
  3. 返回结果

网络断了，客户端重试:
  POST /pay
  Headers: { 'Idempotency-Key': 'pay-20240702-abc123' }  ← 同一个key
  Body: { orderId: '123', amount: 10 }

服务端:
  1. 检查Redis: GET idem:pay-20240702-abc123
  2. 有！→ 直接返回上次缓存的结果
  3. 不会重复执行支付 ← 这就是幂等
```

### 3.3 关键要素

| 要素 | 说明 |
|------|------|
| **幂等键生成** | 客户端生成，保证唯一性 |
| **服务端检查** | 在处理前检查这个键是否已存在 |
| **结果缓存** | 成功后把结果缓存起来 |
| **过期时间** | 设置合理的过期时间，避免无限增长 |

---

## 4. 幂等实现的几种方式

### 4.1 方式对比

| 方式 | 怎么做 | 适合场景 | 你的项目 |
|------|---------|---------|---------|
| **唯一约束** | 数据库建唯一索引 | 点赞、收藏、关注 | ✅ 已用在点赞 |
| **状态检查** | `if (alreadyDone) return` | 订单状态变更、文章发布 | ✅ 适合发布文章 |
| **幂等键** | 客户端生成唯一ID，服务端缓存结果 | 支付、分布式事务、跨服务调用 | ⚠️ 当前未用到 |

### 4.2 唯一约束方式

```typescript
// Prisma schema
model ArticleLikes {
  article_id String
  user_id    String
  @@unique([article_id, user_id]) // ← 保证幂等
}
```

**优点**：简单，数据库层面保证
**缺点**：只适合简单的关系型操作

### 4.3 状态检查方式

```typescript
async publishArticle(articleId: string) {
  const article = await this.prisma.articles.findUnique({
    where: { id: articleId },
  });

  // ✅ 已经是发布状态，直接返回（幂等）
  if (article.is_published) {
    return article;
  }

  return this.prisma.articles.update({
    where: { id: articleId },
    data: { is_published: true },
  });
}
```

**优点**：简单直观
**缺点**：只适合状态变更场景

### 4.4 幂等键方式

```typescript
async payOrder(orderId: string, idempotencyKey: string) {
  // 1. 先检查这个幂等key是否已经处理过
  const cached = await this.redis.get(`idem:${idempotencyKey}`);
  if (cached) {
    return JSON.parse(cached); // 已处理过，直接返回
  }

  // 2. 执行业务逻辑
  const result = await this.processPayment(orderId);

  // 3. 缓存结果
  await this.redis.set(
    `idem:${idempotencyKey}`,
    JSON.stringify(result),
    'EX',
    3600
  );

  return result;
}
```

**优点**：适用于复杂场景和分布式系统
**缺点**：需要引入Redis，实现稍复杂

---

## 5. 你的博客项目中的幂等场景

### 5.1 点赞/取消点赞（最典型）

**文件位置**：`services/backend/src/article/article.service.ts` - `toggleLike()`

```typescript
async toggleLike(articleId: string, userId: string) {
  return this.prisma.$transaction(async (tx) => {
    const existing = await tx.articleLikes.findUnique({
      where: { article_id_user_id: { article_id: articleId, user_id: userId } },
    });

    if (existing) {
      // 已点赞 → 取消点赞
      await tx.articleLikes.delete({ where: { id: existing.id } });
      await tx.articles.update({
        where: { id: articleId },
        data: { likes: { decrement: 1 } },
      });
      return { isLiked: false };
    } else {
      // 未点赞 → 点赞
      await tx.articleLikes.create({ data: { article_id: articleId, user_id: userId } });
      await tx.articles.update({
        where: { id: articleId },
        data: { likes: { increment: 1 } },
      });
      return { isLiked: true };
    }
  });
}
```

**为什么幂等**：
- 唯一约束 `@@unique([article_id, user_id])` 保证同一用户同一文章只有一条点赞记录
- 无论前端因为网络问题调用几次 `toggleLike`，结果都一样
- 不会产生重复点赞

### 5.2 用户注册（需要幂等）

**文件位置**：`services/auth-service/src/auth/auth.service.ts` - `register()`

```typescript
async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
  const { mobile, password } = registerDto;

  // ✅ 幂等实现：先检查用户是否存在
  const existing = await this.prisma.users.findUnique({
    where: { username: mobile },
  });

  if (existing) {
    throw new BusinessException(AUTH_USER_ALREADY_EXISTS);
  }

  // 创建用户...
}
```

**为什么不幂等会有问题**：
```
用户点击"注册" → 请求发出 → 页面卡顿 → 用户再点一次
                                              ↓
                                    如果没做检查，会创建两个账号！
```

### 5.3 创建文章（需要幂等保护）

```typescript
// ❌ 不幂等的写法
async createArticle(createArticleDto: CreateArticleDto, authorId: string) {
  return this.prisma.articles.create({
    data: {
      title: createArticleDto.title,
      author_id: authorId,
      // ... 每次都会创建新文章
    },
  });
}

// ✅ 幂等写法：使用客户端唯一标识
async createArticle(createArticleDto: CreateArticleDto, authorId: string) {
  const { clientId } = createArticleDto; // 前端生成唯一ID

  // 检查这个 clientId 是否已经处理过
  const existing = await this.prisma.articles.findFirst({
    where: { client_id: clientId },
  });

  if (existing) {
    return existing; // 已创建过，直接返回
  }

  return this.prisma.articles.create({
    data: {
      title: createArticleDto.title,
      author_id: authorId,
      client_id: clientId, // 存储唯一标识
    },
  });
}
```

---

## 6. 分布式系统为什么必须用幂等键

### 6.1 单机 vs 分布式 的区别

```
【单机场景 - 唯一约束就够了】
前端 → 后端(一个服务) → 同一个数据库
         ↑
    唯一约束能拦截重复

【分布式场景 - 唯一约束不够】
前端 → auth-service(登录) → backend(创建资料) → log-service(写日志)
         ↑                    ↑                    ↑
    三个不同服务，三个不同数据库，唯一约束跨不过去
```

### 6.2 真实事故案例

```
用户支付10元
    ↓
支付服务调用订单服务：POST /confirm-order { orderId: "123" }
    ↓
订单服务处理成功，返回"已确认"
    ↓
网络超时！支付服务没收到响应
    ↓
支付服务重试：POST /confirm-order { orderId: "123" }
    ↓
订单服务：又确认了一次 ← 用户只付了10元，却确认了两次订单！
```

**唯一约束解决不了**，因为：
- 第一次调用已经成功了，数据库里订单状态已经是"已确认"
- 第二次调用时，唯一约束检查不会报错（订单已经存在）
- 但业务逻辑被重复执行了

### 6.3 幂等键解决分布式幂等问题

```
支付服务 → 订单服务: POST /confirm-order
              Headers: { 'Idempotency-Key': 'confirm-123-abc' }
              Body: { orderId: '123' }
              ↓
          订单服务检查Redis → 没处理过 → 执行确认 → 缓存结果
              ↓
          网络超时，支付服务重试
              ↓
支付服务 → 订单服务: POST /confirm-order
              Headers: { 'Idempotency-Key': 'confirm-123-abc' }  ← 同一个key
              ↓
          订单服务检查Redis → 已处理过 → 直接返回上次结果 ✅
```

---

## 7. 完整实现案例

### 7.1 场景设定

假设你的博客要加一个**"发布付费文章"**功能，涉及两个服务：

```
backend(创建文章) → auth-service(扣余额) → log-service(记录操作)
```

### 7.2 第一步：前端生成幂等键

```typescript
// apps/web/src/pages/PublishArticle/hooks/usePublishArticle.ts
import { v4 as uuidv4 } from 'uuid';

const usePublishArticle = () => {
  const publishArticle = async (data: PublishArticleRequest) => {
    // 每次发布生成一个唯一键
    const idempotencyKey = `publish-${uuidv4()}`;

    const response = await articleApi.publish({
      ...data,
      idempotencyKey, // 传给后端
    });

    return response;
  };

  return { publishArticle };
};
```

### 7.3 第二步：后端存储和检查幂等键

```typescript
// services/backend/src/article/article.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from '@instor/redis'; // 假设用Redis

@Injectable()
export class ArticleService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {}

  async publishArticle(
    publishDto: PublishArticleDto,
    userId: string,
  ) {
    const { title, content, idempotencyKey } = publishDto;

    // ① 先检查这个幂等键是否已经处理过
    if (idempotencyKey) {
      const cached = await this.redis.get(`idem:${idempotencyKey}`);
      if (cached) {
        console.log('幂等键命中，直接返回缓存结果');
        return JSON.parse(cached);
      }
    }

    // ② 核心业务逻辑（可能失败的部分）
    const result = await this.prisma.$transaction(async (tx) => {
      // 创建文章
      const article = await tx.articles.create({
        data: {
          title,
          content,
          author_id: userId,
          is_published: true,
        },
      });

      // 调用auth-service扣余额（分布式调用）
      await this.authServiceClient.deductBalance(userId, 10);

      return article;
    });

    // ③ 成功后将结果缓存到Redis
    if (idempotencyKey) {
      await this.redis.set(
        `idem:${idempotencyKey}`,
        JSON.stringify(result),
        'EX',
        3600, // 1小时过期
      );
    }

    return result;
  }
}
```

### 7.4 第三步：请求拦截器自动处理（可选优化）

```typescript
// services/backend/src/common/interceptors/idempotency.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Redis } from '@instor/redis';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly redis: Redis) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['idempotency-key'];

    if (idempotencyKey) {
      // 检查是否已处理
      const cached = await this.redis.get(`idem:${idempotencyKey}`);
      if (cached) {
        // 直接返回缓存结果，不执行后续逻辑
        return new Observable(subscriber => {
          subscriber.next(JSON.parse(cached));
          subscriber.complete();
        });
      }
    }

    // 继续执行
    return next.handle().pipe(
      tap(async (response) => {
        // 响应成功后缓存
        if (idempotencyKey) {
          await this.redis.set(
            `idem:${idempotencyKey}`,
            JSON.stringify(response),
            'EX',
            3600,
          );
        }
      }),
    );
  }
}
```

---

## 8. 幂等键的生成规则

### 8.1 生成方式对比

| 场景 | 生成方式 | 示例 |
|------|---------|------|
| 支付 | `pay-{orderId}-{timestamp}` | `pay-123-1723456789` |
| 创建文章 | `publish-{uuid}` | `publish-a1b2c3d4` |
| 更新操作 | `update-{resourceId}-{version}` | `update-article-123-v2` |
| 通用 | 直接用UUID | `a1b2c3d4-e5f6-7890` |

### 8.2 推荐原则

| 原则 | 说明 | ✅ 正确 | ❌ 错误 |
|------|------|---------|---------|
| 客户端生成 | 前端或调用方生成 | 前端生成UUID | 后端生成 |
| 保证唯一性 | 使用UUID v4 | `uuidv4()` | 时间戳 |
| 包含业务含义 | 方便排查问题（可选） | `pay-order-123` | `abc123` |
| 不可预测 | 安全性考虑 | UUID | 自增ID |

### 8.3 实现示例

```typescript
import { v4 as uuidv4 } from 'uuid';

// 通用方式（推荐）
const idempotencyKey = uuidv4();
// 示例: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

// 带业务含义的方式
const idempotencyKey = `pay-order-${orderId}-${uuidv4()}`;
// 示例: "pay-order-123-a1b2c3d4-e5f6-7890"

// 带版本的方式（适合更新操作）
const idempotencyKey = `update-article-${articleId}-v${version}`;
// 示例: "update-article-123-v2"
```

---

## 9. 常见坑和解决方案

### 9.1 坑1：缓存结果时事务还没提交

```typescript
// ❌ 错误：在事务提交前就缓存
const result = await this.prisma.$transaction(async (tx) => {
  const article = await tx.articles.create({...});
  await this.redis.set(`idem:${key}`, JSON.stringify(article)); // 太早了！
  return article;
});

// ✅ 正确：事务成功后再缓存
const result = await this.prisma.$transaction(async (tx) => {
  return await tx.articles.create({...});
});
// 事务成功才会执行到这里
await this.redis.set(`idem:${key}`, JSON.stringify(result));
```

### 9.2 坑2：不同接口用了相同的幂等键

```typescript
// ❌ 错误：支付和退款用了同一个key
POST /pay { idempotencyKey: "order-123" }
POST /refund { idempotencyKey: "order-123" }  // 会误认为是重复请求！

// ✅ 正确：不同操作用不同前缀
POST /pay { idempotencyKey: "pay-order-123" }
POST /refund { idempotencyKey: "refund-order-123" }
```

### 9.3 坑3：幂等键永久有效

```typescript
// ❌ 错误：不设置过期时间，Redis会爆
await redis.set(`idem:${key}`, JSON.stringify(result));

// ✅ 正确：设置合理过期时间
await redis.set(`idem:${key}`, JSON.stringify(result), 'EX', 3600); // 1小时
```

### 9.4 坑4：幂等键检查在事务内部

```typescript
// ❌ 错误：在事务内部检查，可能导致幻读
await this.prisma.$transaction(async (tx) => {
  const cached = await this.redis.get(`idem:${key}`); // 不应该在事务内
  if (cached) return JSON.parse(cached);
  // ...
});

// ✅ 正确：在事务外部检查
const cached = await this.redis.get(`idem:${key}`);
if (cached) return JSON.parse(cached);

const result = await this.prisma.$transaction(async (tx) => {
  // ...
});
```

---

## 10. 什么时候需要用幂等键

### 10.1 决策表

| 操作类型 | 需要幂等键吗 | 原因 | 推荐方案 |
|---------|------------|------|---------|
| GET查询 | ❌ 不需要 | 天然幂等 | 无需处理 |
| 更新资料 | ❌ 不需要 | 更新成相同值结果一样 | 状态检查 |
| 点赞/收藏 | ❌ 不需要 | 唯一约束就够 | 唯一约束 |
| 创建订单 | ✅ 需要 | 重复创建会出大问题 | 幂等键 |
| 支付 | ✅ 需要 | 钱会被扣多次 | 幂等键 |
| 跨服务调用 | ✅ 需要 | 唯一约束跨不过去 | 幂等键 |
| 分布式事务 | ✅ 需要 | 需要协调多个服务 | 幂等键 |

### 10.2 你的博客项目建议

| 当前功能 | 是否需要幂等键 | 说明 |
|---------|------------|------|
| 点赞 | ❌ 不需要 | 唯一约束已够 |
| 发布文章 | ❌ 不需要 | 状态检查已够 |
| 更新资料 | ❌ 不需要 | 天然幂等 |
| 未来支付功能 | ✅ 需要 | 涉及金额，必须幂等 |
| 未来跨服务调用 | ✅ 需要 | 分布式场景 |

---

## 11. 学习检查清单

学完后，请确认你能回答以下问题：

### 基础概念
- [ ] 什么是幂等？用一句话解释
- [ ] 为什么需要幂等？举一个真实场景
- [ ] 幂等键的作用是什么？

### 实现方式
- [ ] 幂等实现的三种方式是什么？
- [ ] 唯一约束方式适合什么场景？
- [ ] 状态检查方式适合什么场景？
- [ ] 幂等键方式适合什么场景？

### 实际应用
- [ ] 你的博客项目中，点赞为什么是幂等的？
- [ ] 如何为"创建文章"添加幂等保护？
- [ ] 分布式系统为什么必须用幂等键？

### 进阶问题
- [ ] 如何生成幂等键？有哪些推荐方式？
- [ ] 幂等键的常见坑有哪些？如何避免？
- [ ] 什么时候需要用幂等键？什么时候不需要？

---

## 总结

> **幂等 = 重复操作不会产生副作用**
>
> **核心做法**：
> 1. **查询操作**天然幂等，不用处理
> 2. **唯一约束**解决"重复创建关系"问题
> 3. **状态检查**解决"重复状态变更"问题
> 4. **幂等键**解决"重复重要操作"和"分布式场景"问题
>
> **你的项目**：
> - 当前用**唯一约束**（点赞）和**状态检查**（发布）就够了
> - 未来做到**支付**或**跨服务调用**时，再引入幂等键

---

## 参考资料

- [你的项目点赞实现](../architecture/sequence/04-用户交互序列图.md)
- [分布式事务最终一致性方案](../../.claude/TECH-DECISIONS.md#adr-019-分布式事务最终一致性方案)
- [NestJS 后端开发规范](../../.claude/projects/backend-project-info.md)

---

**文档版本**: v1.0
**最后更新**: 2026-07-02
**作者**: Claude Code (学习指南生成)
