---
name: nestjs-performance-audit
description: NestJS 后端性能检测规范，Prisma ORM 性能问题检查清单。性能审计时自动加载。
---

## 优先级定义（必须严格遵循）

| 优先级 | 级别 | 说明 | 处理要求 |
|--------|------|------|----------|
| **T0** | 严重性能问题 | 必须立即修复，可能导致接口超时、OOM 内存溢出、数据库雪崩 | P0 级，上线前必须修复 |
| **T1** | 中等性能问题 | 建议尽快修复，影响接口响应速度，高并发下容易出问题 | P1 级，本次迭代或下次迭代尽早修复 |
| **T2** | 低风险优化 | 可以后续优化，属于性能改进点，不影响当前功能可用性 | P2 级，有空就优化，不阻塞上线 |

---

## 检测工作流程

### 第一步：确认检测范围
- 检查用户是否提供了需要检测的完整文件内容
- 如果只有部分代码，明确告知需要提供完整上下文才能准确检测

### 第二步：按维度从高风险到低风险逐项检测
不要遗漏任何一个检测维度，严格按照以下顺序检测：

---

## 1. 数据库性能（Prisma ORM）- 最高风险

### T0 严重问题检测清单

- [ ] **N+1 查询问题**：循环中逐次查询，没有使用 `include` 或 `join` 一次性预加载关联数据
- [ ] **缺少必要索引**：高频查询条件字段没有添加索引
- [ ] **全表扫描**：没有添加查询条件直接查询全表数据
- [ ] **连接池配置错误**：连接池大小配置不合理（太小导致等待，太大打满数据库连接）
- [ ] **大事务长时间持有连接**：业务逻辑包含在事务中但执行时间过长

### T1 中等问题检测清单

- [ ] **没有使用 `select` 指定字段**：查询所有字段，传输和内存浪费
- [ ] **事务使用不当**：不需要事务的操作使用了事务，增加数据库开销
- [ ] **大批量操作未分页**：批量更新/删除上万条数据在一个事务中执行
- [ ] **重复查询相同数据**：同一个请求多次查询相同的数据到内存

### T2 优化检测清单

- [ ] **查询条件没有使用覆盖索引**：可以优化但不影响正确性
- [ ] **软删除数据没有过滤**：查询结果包含已删除数据但前端不需要，增加数据传输

---

#### N+1 问题示例：

**问题代码**:
```typescript
// ❌ N+1 问题：先查出所有文章，再循环逐个查询作者
const articles = await this.prisma.articles.findMany();
for (const article of articles) {
  article.author = await this.prisma.users.findUnique({
    where: { id: article.authorId },
  });
}
```

**修复后**:
```typescript
// ✅ 一次性查询，使用 include 预加载关联数据
const articles = await this.prisma.articles.findMany({
  include: {
    users: true,
  },
});
```

**问题**: 如果有 100 篇文章，会触发 1 + 100 = 101 次数据库查询，网络开销翻倍。

---

#### 缺少索引示例：

**问题代码**:
```prisma
// ❌ 高频按 categoryId 查询，但字段没有加索引
model articles {
  id        String  @id @uuid
  title     String
  content   String
  categoryId String  // ← 高频查询但没加索引
}
```

**修复后**:
```prisma
// ✅ 给查询字段添加索引
model articles {
  id        String  @id @uuid
  title     String
  content   String
  categoryId String

  @@index([categoryId]) // ← 添加索引
}
```

---

## 2. 接口性能 - 高风险

### T0 严重问题检测清单

- [ ] **缺少分页机制**：列表接口没有分页，一次性返回全部数据
- [ ] **未限制最大查询数量**：`pageSize` 没有上限，攻击者可以一次拉取全表
- [ ] **大结果集返回**：不做裁剪直接返回上千条记录给前端
- [ ] **同步阻塞操作**：在请求线程中执行 CPU 密集计算或同步 IO 操作
- [ ] **串行执行多个独立查询**：多个独立查询没有用 `Promise.all` 并行执行

### T1 中等问题检测清单

- [ ] **未使用流式返回**：导出大文件一次性读到内存再返回
- [ ] **响应包含不必要的字段**：返回敏感字段或前端不需要的冗余字段
- [ ] **没有使用压缩**：返回大 JSON 没有开启 gzip/brotli 压缩

### T2 优化检测清单

- [ ] **HTTP 方法选择不当**：用 POST 查询数据（不利于缓存）
- [ ] **接口响应时间过长**：超过 500ms 需要优化

---

#### 缺少分页问题示例：

**问题代码**:
```typescript
// ❌ 没有分页，文章多了会一次性返回几万条
async findAll(): Promise<Article[]> {
  return this.prisma.articles.findMany();
}
```

**修复后**:
```typescript
// ✅ 正确分页，限制最大 pageSize
async findAll(params: PaginationDto): Promise<PageResult<Article>> {
  const { page = 1, pageSize = 10 } = params;
  // 限制最大 pageSize 防止一次性拉取过多
  const take = Math.min(pageSize, 50);
  const skip = (page - 1) * take;

  const [list, total] = await Promise.all([
    this.prisma.articles.findMany({ skip, take }),
    this.prisma.articles.count(),
  ]);

  return { list, total, page, pageSize: take };
}
```

---

## 3. 缓存使用

### T0 严重问题检测清单

- [ ] **热点数据完全不缓存**：频繁查询基本不变化的数据每次都查库
- [ ] **缓存穿透**：缓存不存储空值，大量请求查询不存在的数据直接击穿到数据库
- [ ] **缓存键设计不合理**：过期时间太长占用内存，太短频繁回源

### T1 中等问题检测清单

- [ ] **缓存更新不及时**：数据更新后缓存没有失效，脏数据停留时间过长
- [ ] **缓存雪崩**：大量缓存在同一时间过期，导致全量回源
- [ ] **过度缓存**：缓存不经常访问的数据，浪费内存

### T2 优化检测清单

- [ ] **没有使用分层缓存**：可以用内存一级缓存的场景直接走分布式缓存

---

#### 热点数据不缓存问题示例：

**问题代码**:
```typescript
// ❌ 分类列表基本不变化，每次请求都查数据库
async getCategories(): Promise<Category[]> {
  return this.prisma.categories.findMany();
}
```

**修复后**:
```typescript
// ✅ 添加缓存，减少数据库查询
async getCategories(): Promise<Category[]> {
  const cacheKey = 'categories:all';
  const cached = await this.cacheManager.get<Category[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const categories = await this.prisma.categories.findMany();
  await this.cacheManager.set(cacheKey, categories, 3600); // 缓存 1 小时
  return categories;
}
```

---

## 4. 内存使用

### T0 严重问题检测清单

- [ ] **大对象静态存储**：把超大查询结果存在静态变量/全局变量中永远不释放
- [ ] **内存泄漏风险**：全局 Map/Set 不断增长，只增不删
- [ ] **一次性加载全表数据到内存**：把几万条数据全查到内存再过滤，应该让数据库过滤
- [ ] **未正确清理定时器/事件监听器**：模块销毁后仍然持有引用

### T1 中等问题检测清单

- [ ] **不必要的大对象克隆**：对大对象做深度拷贝消耗内存和 CPU
- [ ] **闭包持有大对象引用**：导致 GC 无法回收

### T2 优化检测清单

- [ ] **过多使用全局状态**：应该请求级别的状态存在全局

---

#### 全局内存泄漏示例：

**问题代码**:
```typescript
// ❌ 全局缓存，只增不删，会不断增长
const allRequests: Request[] = [];

@Injectable()
export class LoggerService {
  logRequest(req: Request) {
    allRequests.push(req); // 永远不清理，内存泄漏！
  }
}
```

**修复后**:
```typescript
// ✅ 使用 LRU Cache 限制最大容量，自动淘汰
import { LRUCache } from 'lru-cache';

const allRequests = new LRUCache<string, Request>({
  max: 1000, // 最多存 1000 条
  ttl: 1000 * 60 * 5, // 5 分钟过期
});

@Injectable()
export class LoggerService {
  logRequest(req: Request) {
    allRequests.set(req.id, req);
  }
}
```

---

## 5. 异步处理

### T0 严重问题检测清单

- [ ] **本该异步的操作同步执行**：发送邮件、调用第三方推送、上传文件等慢操作同步等待
- [ ] **未使用任务队列处理**：批量导入、发送通知等高延迟操作直接在请求链路中处理
- [ ] `Promise.all` 中包含无关操作，一个失败全部失败

### T1 中等问题检测清单

- [ ] **过度并发**：同时启动上百个并发请求，打满线程池
- [ ] **缺少重试机制**：对第三方服务调用失败没有退避重试

### T2 优化检测清单

- [ ] **可以并行的操作串行执行**：优化空间，但不严重

---

#### 同步执行慢操作示例：

**问题代码**:
```typescript
// ❌ 注册用户后，同步发送邮件，拖慢接口响应
async register(userDto: RegisterDto): Promise<User> {
  const user = await this.userService.create(userDto);
  // 发送邮件需要 1-3 秒，接口一直等邮件发完才返回
  await this.emailService.sendWelcomeEmail(user.email);
  return user;
}
```

**修复后**:
```typescript
// ✅ 邮件发送放入队列异步处理，接口立即返回
async register(userDto: RegisterDto): Promise<User> {
  const user = await this.userService.create(userDto);
  // 丢到队列，立刻返回
  await this.queueService.add('send-welcome-email', {
    email: user.email,
  });
  return user;
}
```

---

## 6. 依赖注入与模块架构

### T0 严重问题检测清单

- [ ] **循环依赖**：模块之间循环依赖，可能导致运行时不确定行为
- [ ] **全局模块过度使用**：把所有模块都注册为全局，增加启动时间和内存
- [ ] **提供者作用域不当**：请求级依赖应该用 `REQUEST` 作用域却用了默认 `SINGLETON`

### T1 中等问题检测清单

- [ ] **模块导入冗余**：导入不需要的模块，增加依赖耦合
- [ ] **过度使用动态模块**：可以静态导入的场景不必要用动态模块

### T2 优化检测清单

- [ ] **可以共享的服务没有抽成共享模块**：重复定义相同服务

---

## 7. 代码层面性能

### T0 严重问题检测清单

- [ ] **不必要的嵌套循环**：算法复杂度 O(n²)，数据量大时非常慢
- [ ] **正则表达式陷阱**：容易引发灾难性回溯的正则模式
- [ ] **同步读取大文件**：`fs.readFileSync` 读取大文件阻塞事件循环

### T1 中等问题检测清单

- [ ] **重复计算相同结果**：相同输入每次都重新计算，没有缓存
- [ ] **数组方法使用不当**：频繁用 `unshift`/`splice` 导致数组重排

### T2 优化检测清单

- [ ] **可以懒加载没有懒加载**：模块启动就加载不常用的数据
- [ ] **字符串拼接使用 `+=` 在循环中**：现代 JS 已经优化，问题不大但仍可优化

---

## 输出要求（必须严格遵循）

### 问题输出格式

对于每个发现的性能问题，按照以下结构输出：

```
### [T0/T1/T2] [问题类别] 简短问题标题

**问题描述**:
> 一句话清楚说明性能问题在哪里，会造成什么影响

**当前问题代码**:
```typescript
// 贴出问题代码片段
```

**修复后的正确代码**:
```typescript
// 给出完整的修复示例
```

**为什么需要修复**:
- 说明属于哪类性能问题
- 解释在高并发场景下会造成什么后果
- 说明修复带来的性能提升
```

---

### 最终总结结构

检测完成后，必须输出：

## ⚡ 性能检测总结

| 风险级别 | 发现问题数量 |
|----------|--------------|
| T0 严重 | XX 个 |
| T1 中等 | XX 个 |
| T2 优化 | XX 个 |
| **总计** | **XX 个** |

## 🎯 修复计划（按优先级）

### T0 必须立即修复（严重性能问题）

1. - [ ] **问题描述** - 文件: `路径/文件名.ts:行号`
2. - [ ] ...

### T1 建议尽快修复（影响响应速度）

1. - [ ] **问题描述** - 文件: `路径/文件名.ts:行号`
2. - [ ] ...

### T2 可以后续优化（性能改进点）

1. - [ ] **问题描述** - 文件: `路径/文件名.ts:行号`
2. - [ ] ...

## ✅ 做得好的地方

> 正向总结：列举符合性能最佳实践的亮点，鼓励开发者

- ...

## 📊 性能评级

| 检测维度 | 评分 | 评价 |
|----------|------|------|
| 数据库性能 | 得分/100 | 一句话评价 |
| 接口设计 | 得分/100 | 一句话评价 |
| 缓存使用 | 得分/100 | 一句话评价 |
| 内存管理 | 得分/100 | 一句话评价 |
| 异步处理 | 得分/100 | 一句话评价 |
| 模块架构 | 得分/100 | 一句话评价 |
| 代码质量 | 得分/100 |

**总分**: XX/700

---

## 📚 参考文档

- [NestJS 性能最佳实践](https://docs.nestjs.com/performance)
- [Prisma 性能优化文档](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Node.js 性能诊断指南](https://nodejs.org/en/docs/guides/diagnostics-report-guide/)
- [Prisma 索引最佳实践](https://www.prisma.io/docs/guides/performance-and-optimization/indexing)

---

## 行为准则

1. **优先级分明**：T0 问题必须放在最前面，严重问题不可放过
2. **给出可运行示例**：不光说有问题，一定要给出正确的修复代码示例
3. **解释影响**：帮助开发者理解这个问题在高并发下会造成什么后果
4. **符合框架习惯**：给出的修复方案符合 NestJS + Prisma 官方最佳实践
5. **保持专业**：客观中立，对事不对人，只说问题和改进方案
6. **不吹毛求疵**：区分严重问题和优化点，不要把优化点当成严重问题
