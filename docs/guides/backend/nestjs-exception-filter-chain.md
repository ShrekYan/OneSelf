# NestJS 异常过滤器链式调用详解

> **教学目标**：理解 NestJS 中多个全局异常过滤器的执行顺序和作用范围
>
> **适合人群**：NestJS 新手，了解基础异常处理的开发者
>
> **预计阅读时间**：10 分钟

---

## 一、什么是异常过滤器？

异常过滤器（Exception Filter）是 NestJS 提供的**异常处理机制**，用于捕获应用中抛出的异常，并将其转换为统一的响应格式返回给客户端。

### 为什么需要异常过滤器？

想象一下这个场景：
- 用户访问一个不存在的 API → 返回 404
- 数据库查询失败 → 返回 500
- 业务逻辑错误（如用户不存在）→ 返回友好的错误信息

如果没有异常过滤器，每个地方都要写 `try-catch`，代码会非常冗余。

---

## 二、本项目的三层过滤器架构

在 `services/backend/src/common/common.module.ts` 中，我们注册了三个全局异常过滤器：

```typescript
// common.module.ts
providers: [
  // 全局异常过滤器（按注册顺序）
  { provide: APP_FILTER, useClass: AllExceptionsFilter },
  { provide: APP_FILTER, useClass: BusinessExceptionFilter },
  { provide: APP_FILTER, useClass: PrismaExceptionFilter },
]
```

### 1. PrismaExceptionFilter（最专门）

**文件位置**：`common/filters/prisma-exception.filter.ts`

**作用**：处理 Prisma 数据库操作相关的异常

**能处理的异常类型**：
- `PrismaClientKnownRequestError` - Prisma 已知的请求错误（如唯一约束冲突）
- `PrismaClientUnknownRequestError` - Prisma 未知的请求错误

**实际例子**：
```typescript
// 当用户名已存在时，Prisma 会抛出 P2002 错误
await this.prisma.users.create({
  data: { username: 'existing_user' }
});
// ↓ PrismaExceptionFilter 捕获，返回："数据已存在，违反唯一约束"
```

---

### 2. BusinessExceptionFilter（中间层）

**文件位置**：`common/filters/business-exception.filter.ts`

**作用**：处理业务逻辑的异常（我们自定义的业务错误）

**能处理的异常类型**：
- `BusinessException` - 自定义业务异常类

**实际例子**：
```typescript
// 当用户不存在时
throw new BusinessException(
  BusinessErrorCode.USER_NOT_FOUND,
  '用户不存在',
  HttpStatus.NOT_FOUND
);
// ↓ BusinessExceptionFilter 捕获，返回统一的业务错误格式
```

---

### 3. AllExceptionsFilter（兜底）

**文件位置**：`common/filters/all-exceptions.filter.ts`

**作用**：捕获所有未被前面过滤器处理的异常（兜底层）

**能处理的异常类型**：
- **所有异常**（`@Catch()` 无参数）

**实际例子**：
```typescript
// 代码 bug，访问 undefined 的属性
const user = null;
console.log(user.name); // TypeError
// ↓ AllExceptionsFilter 捕获，返回："Internal server error"
```

---

## 三、关键：执行顺序（重点！）

### 3.1 NestJS 的过滤器匹配规则

**重要规则**：
1. 全局过滤器按照**注册顺序的逆序**执行（后进先出）
2. 每个过滤器通过 `@Catch()` 装饰器声明自己能处理什么异常
3. NestJS 会找到**第一个能处理当前异常的过滤器**并执行

### 3.2 注册顺序 vs 执行顺序

```typescript
// common.module.ts 中的注册顺序
{ provide: APP_FILTER, useClass: AllExceptionsFilter },     // 第1个注册
{ provide: APP_FILTER, useClass: BusinessExceptionFilter },  // 第2个注册
{ provide: APP_FILTER, useClass: PrismaExceptionFilter },    // 第3个注册
```

**实际执行顺序**（逆序）：
```
1. PrismaExceptionFilter   （第3个注册 → 第1个执行）
2. BusinessExceptionFilter （第2个注册 → 第2个执行）
3. AllExceptionsFilter     （第1个注册 → 第3个执行）
```

### 3.3 执行流程图

```
┌─────────────────────────────────┐
│      异常抛出 (throw)           │
└─────────────┬───────────────────┘
              ↓
┌─────────────────────────────────┐
│  PrismaExceptionFilter          │
│  @Catch(PrismaClientKnown...)  │
│                                 │
│  能处理？────是──→ 处理并返回  │
│     ↓                          │
│    否                          │
└─────────────┬───────────────────┘
              ↓
┌─────────────────────────────────┐
│  BusinessExceptionFilter         │
│  @Catch(BusinessException)      │
│                                 │
│  能处理？────是──→ 处理并返回  │
│     ↓                          │
│    否                          │
└─────────────┬───────────────────┘
              ↓
┌─────────────────────────────────┐
│  AllExceptionsFilter            │
│  @Catch()  【兜底】            │
│                                 │
│  处理所有其他异常 → 处理并返回  │
└─────────────────────────────────┘
```

---

## 四、实际案例分析

### 案例 1：数据库唯一约束冲突

**场景**：用户注册时，手机号已存在

```typescript
// article.service.ts
async createUser(mobile: string) {
  try {
    return await this.prisma.users.create({
      data: { username: mobile }
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw error; // 让过滤器处理
    }
    throw error;
  }
}
```

**执行路径**：
1. Prisma 抛出 `PrismaClientKnownRequestError` (code: P2002)
2. `PrismaExceptionFilter` 检查：`@Catch(PrismaClientKnownRequestError)` → **匹配！**
3. 执行 `PrismaExceptionFilter.catch()` 方法
4. 返回：`{ code: 30001, message: "数据已存在，违反唯一约束" }`

---

### 案例 2：业务异常（用户不存在）

**场景**：获取用户信息时，用户不存在

```typescript
// users.service.ts
async getUserById(userId: string) {
  const user = await this.prisma.users.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new BusinessException(
      BusinessErrorCode.USER_NOT_FOUND,
      '用户不存在',
      HttpStatus.NOT_FOUND
    );
  }

  return user;
}
```

**执行路径**：
1. 代码抛出 `BusinessException`
2. `PrismaExceptionFilter` 检查：`@Catch(PrismaClientKnownRequestError)` → 不匹配
3. `BusinessExceptionFilter` 检查：`@Catch(BusinessException)` → **匹配！**
4. 执行 `BusinessExceptionFilter.catch()` 方法
5. 返回：`{ code: 20001, message: "用户不存在" }`

---

### 案例 3：未捕获的代码错误

**场景**：代码 bug，访问 undefined 的属性

```typescript
// 一个 bug
async someMethod() {
  const data = null;
  console.log(data.name); // TypeError: Cannot read properties of null
}
```

**执行路径**：
1. 代码抛出 `TypeError`
2. `PrismaExceptionFilter` 检查：不匹配
3. `BusinessExceptionFilter` 检查：不匹配
4. `AllExceptionsFilter` 检查：`@Catch()` 无参数，**匹配所有异常！**
5. 执行 `AllExceptionsFilter.catch()` 方法
6. 返回：`{ code: 500, message: "Internal server error" }`

---

## 五、为什么这样设计？

### 5.1 分层处理的好处

```
专门化处理 → 通用处理 → 兜底处理
   (Prisma)   (Business)   (All)
```

**优势**：
1. **职责清晰**：每种异常有专门的过滤器处理
2. **避免重复**：不需要在每个过滤器里判断异常类型
3. **易于扩展**：新增异常类型只需添加新的过滤器
4. **安全性**：敏感信息不会泄露（如数据库错误）

### 5.2 对比：如果不这样设计

**糟糕的设计**：
```typescript
// 只有一个过滤器处理所有异常
@Catch()
export class AllExceptionsFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof PrismaClientKnownRequestError) {
      // 处理 Prisma 异常
    } else if (exception instanceof BusinessException) {
      // 处理业务异常
    } else {
      // 处理其他异常
    }
  }
}
```

**问题**：
- 一个过滤器职责太多
- 判断逻辑复杂
- 难以维护和扩展

---

## 六、新手常见问题

### Q1：为什么 PrismaExceptionFilter 要放在最后注册？

**A**：因为 NestJS 的执行顺序是**逆序**（后进先出）。

我们希望执行顺序是：
1. PrismaExceptionFilter（最专门）
2. BusinessExceptionFilter（中间）
3. AllExceptionsFilter（兜底）

所以注册顺序要反过来：
1. AllExceptionsFilter（第1个注册）
2. BusinessExceptionFilter（第2个注册）
3. PrismaExceptionFilter（第3个注册）

---

### Q2：如果我想添加一个新的过滤器，应该怎么做？

**步骤**：

1. **创建过滤器文件**：
```typescript
// common/filters/my-exception.filter.ts
@Catch(MyException)
export class MyExceptionFilter implements ExceptionFilter {
  catch(exception: MyException, host: ArgumentsHost) {
    // 处理逻辑
  }
}
```

2. **在 common.module.ts 中注册**（注意顺序！）：
```typescript
providers: [
  { provide: APP_FILTER, useClass: AllExceptionsFilter },         // 第1个
  { provide: APP_FILTER, useClass: BusinessExceptionFilter },      // 第2个
  { provide: APP_FILTER, useClass: PrismaExceptionFilter },        // 第3个
  { provide: APP_FILTER, useClass: MyExceptionFilter },           // 第4个（新的）
]
```

3. **执行顺序**：MyExceptionFilter → PrismaExceptionFilter → BusinessExceptionFilter → AllExceptionsFilter

---

### Q3：如果异常被多个过滤器匹配，会怎样？

**A**：不会。NestJS 只执行**第一个匹配的过滤器**，后面的不会再执行。

---

## 七、关键要点总结

| 要点 | 说明 |
|------|------|
| **注册顺序** | 按照 `common.module.ts` 中的 `providers` 数组顺序 |
| **执行顺序** | **逆序**（后进先出） |
| **匹配规则** | `@Catch()` 装饰器决定过滤器能处理什么异常 |
| **执行停止** | 匹配到第一个过滤器后就停止，不会继续执行 |
| **兜底机制** | `AllExceptionsFilter` 必须放在**第一个注册**，确保最后执行 |

---

## 八、实践练习

### 练习 1：预测执行结果

**问题**：下面的代码会抛出什么异常？被哪个过滤器捕获？

```typescript
async deleteUser(userId: string) {
  await this.prisma.users.delete({
    where: { id: userId }
  });
}
// 假设用户不存在
```

**答案**：
1. Prisma 抛出 `PrismaClientKnownRequestError` (code: P2025)
2. 被 `PrismaExceptionFilter` 捕获
3. 返回：`{ code: 30002, message: "记录不存在" }`

---

### 练习 2：添加一个新的过滤器

**任务**：创建一个 `ValidationExceptionFilter`，处理 class-validator 的验证异常。

**提示**：
1. 验证异常通常是 `BadRequestException`
2. 应该在 `BusinessExceptionFilter` 之前执行
3. 需要处理 `BadRequestException`

---

## 九、延伸阅读

- [NestJS 官方文档 - 异常过滤器](https://docs.nestjs.com/exception-filters)
- [Prisma 错误处理](https://www.prisma.io/docs/concepts/components/prisma-client/error-reference)
- [本项目业务错误码定义](../backend/src/common/constants/business-error-codes.ts)

---

## 十、总结

通过本文，你应该已经理解：

1. ✅ 三个过滤器各自的作用和处理的异常类型
2. ✅ 过滤器链的执行顺序（逆序 + 第一个匹配原则）
3. ✅ 为什么这样设计（分层处理、职责清晰）
4. ✅ 如何添加新的过滤器

**记住核心**：
> **注册顺序逆序执行，@Catch 决定匹配，第一个匹配就停止。**

---

**文档版本**：v1.0
**最后更新**：2026-07-01
**作者**：Claude Code 教学生成
