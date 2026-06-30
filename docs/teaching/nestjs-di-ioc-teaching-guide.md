# NestJS 依赖注入（DI）与控制反转（IoC）学习指南

> **文档说明**: 本文档用于帮助新手理解 NestJS 中的依赖注入（DI）和控制反转（IoC）概念，通过生活类比和代码对比进行讲解。
>
> **适用对象**: NestJS 初学者
>
> **最后更新**: 2026-06-30

---

## 目录

1. [什么是控制反转（IoC）](#什么是控制反转ioc)
2. [什么是依赖注入（DI）](#什么是依赖注入di)
3. [@Injectable() 的作用](#injectable-的作用)
4. [生活类比](#生活类比)
5. [代码对比](#代码对比)
6. [它们的关系](#它们的关系)
7. [总结](#总结)

---

## 什么是控制反转（IoC）

### 核心概念

**控制反转（Inversion of Control，IoC）** 是一种设计思想，简单来说：

> **把"控制权"交给别人（框架），而不是自己控制一切。**

---

### 生活类比：做饭 vs 点外卖

#### 🍳 正控（传统方式）- 自己做饭

```
你想吃饭
  → 自己去买菜
  → 自己洗菜
  → 自己切菜
  → 自己炒菜
  → 自己洗碗
```

**代码对应**：
```typescript
// 你想用 JwtAuthGuard，得自己创建所有依赖
const configService = new ConfigService();  // 自己创建
configService.loadEnv();                   // 自己配置

const guard = new JwtAuthGuard(configService); // 自己传入

// 如果 JwtAuthGuard 还需要别的依赖？
// 你还得继续创建... 很麻烦！
```

**问题**：
- 你（调用者）要**控制**所有对象的创建顺序和依赖关系
- 类之间的耦合度很高（改一个，全要改）

---

#### 🍔 反转（IoC 方式）- 点外卖

```
你想吃饭
  → 告诉餐厅"我要吃饭"
  → 餐厅做饭给你
  → 餐厅洗碗
```

**代码对应**：
```typescript
@Injectable()  // 标记：我可以被 NestJS 管理
class JwtAuthGuard {
  constructor(
    private configService: ConfigService  // 我需要这个，你帮我给
  ) {}
}

// 使用时：
@UseGuards(JwtAuthGuard)  // NestJS 自动创建 guard 并注入 configService
```

**好处**：
- **控制权反转了**：从"你创建依赖"变成"框架帮你创建"
- 你只声明需要什么，不关心怎么创建

---

## 什么是依赖注入（DI）

### 核心概念

**依赖注入（Dependency Injection，DI）** 是实现控制反转的具体方法。

> **依赖** = 你需要的东西（如 `ConfigService`）
>
> **注入** = 别人（框架）主动给你

---

### 代码示例

```typescript
class JwtAuthGuard {
  // 声明：我需要 ConfigService（依赖）
  constructor(
    private configService: ConfigService  // ← 注入点
  ) {}

  // 现在直接用，不用自己创建
  getSecret() {
    return this.configService.get('JWT_SECRET');
  }
}
```

### 怎么"注入"的？

NestJS 在启动时会：
1. 看到 `JwtAuthGuard` 需要 `ConfigService`
2. 先创建 `ConfigService`
3. 创建 `JwtAuthGuard` 时，把 `ConfigService` **传进去**（注入）

---

## @Injectable() 的作用

### 简单解释

`@Injectable()` 是 NestJS 的**依赖注入标记**，作用是：

> **告诉 NestJS：我可以被注入，请帮我管理。**

---

### 为什么需要 @Injectable()？

#### 没有 @Injectable() 时
```typescript
// ❌ 错误示例
class JwtAuthGuard {
  constructor(private configService: ConfigService) {}
}

// NestJS 不知道如何创建这个 Guard
// 无法自动注入 ConfigService
// 运行时会报错
```

#### 有 @Injectable() 时
```typescript
// ✅ 正确示例
@Injectable()  // ← 告诉 NestJS：我可以被注入
class JwtAuthGuard {
  constructor(private configService: ConfigService) {}
}

// NestJS 看到标记后，会自动：
// 1. 创建 ConfigService
// 2. 把它传给 JwtAuthGuard 的构造函数
// 3. 把创建好的 Guard 给你用
```

---

### 什么时候用 @Injectable()？

| 场景 | 是否需要 `@Injectable()` | 示例 |
|------|------------------------|------|
| **Guard** | ✅ 需要 | `JwtAuthGuard` |
| **Service** | ✅ 需要 | `AuthService` |
| **Controller** | ❌ 不需要 | `@Controller()` 已经包含 |
| **Module** | ❌ 不需要 | `@Module()` 已经包含 |
| **DTO** | ❌ 不需要 | 只是数据容器 |
| **普通类** | ❌ 不需要 | 不依赖其他服务的工具类 |

---

## 生活类比

### 餐厅厨房类比

想象一个**餐厅厨房**：

| 概念 | 类比 |
|------|------|
| `@Injectable()` | 告诉厨房："我是食材，可以用" |
| `ConfigService` | 需要的具体食材 |
| NestJS 依赖注入容器 | 厨房的食材管理员 |
| Guard/Service/Controller | 厨师 |

**流程**：
1. 厨师（Guard）说："我需要盐（ConfigService）"
2. 食材管理员（NestJS）看到盐罐上有 `@Injectable()` 标签
3. 自动把盐递给厨师

---

### 快递类比

| 概念 | 类比 |
|------|------|
| **正控** | 你自己去快递站取件 |
| **反转（IoC）** | 快递员送到你手上 |
| **依赖注入（DI）** | 快递员把包裹"注入"到你手中 |
| `@Injectable()` | 告诉快递公司"我可以收快递" |

---

## 代码对比

### 没有依赖注入（传统方式）

```typescript
// 你想用 JwtAuthGuard，得自己创建所有依赖
const configService = new ConfigService();  // 自己创建
configService.loadEnv();                   // 自己配置

const guard = new JwtAuthGuard(configService); // 自己传入

// 如果 JwtAuthGuard 还需要别的依赖？
// 你还得继续创建... 很麻烦！
```

**问题**：
- 类之间的耦合度很高
- 想换实现？所有创建的地方都要改
- 测试困难（无法轻松替换依赖）

---

### 有依赖注入（NestJS 方式）

```typescript
@Injectable()  // 标记：我可以被 NestJS 管理
class JwtAuthGuard {
  constructor(
    private configService: ConfigService  // 我需要这个，你帮我给
  ) {}
}

// 使用时：
@UseGuards(JwtAuthGuard)  // NestJS 自动创建 guard 并注入 configService
```

**好处**：
- **解耦**（最重要）：改 `ConfigService` 内部，其他地方不用动
- **方便测试**：可以轻松注入假的 `ConfigService`
- **管理生命周期**：NestJS 可以决定：是每次创建新的，还是复用同一个？

---

## 它们的关系

```
控制反转（IoC）← 是概念/思想
    ↓ 用这种方式实现
依赖注入（DI）← 是具体做法
    ↓ 在 NestJS 中这样标记
@Injectable() ← 告诉框架"我可以接受注入"
```

### 类比总结

| 名词 | 白话解释 | 类比 |
|------|----------|------|
| **控制反转** | 本来你控制创建对象，现在让框架控制 | 从"自己做饭"变成"点外卖" |
| **依赖注入** | 框架把你需要的东西"塞"给你 | 外卖员把饭送到你手上 |
| **@Injectable()** | 告诉框架"我可以接受注入" | 告诉餐厅"我可以收外卖" |

---

## 总结

### 一句话总结

> **你只管"我要什么"，不管"怎么给我"。**

---

### 核心要点

| 你做的事 | 框架做的事 |
|---------|-----------|
| 标记 `@Injectable()` | 管理类的创建 |
| 在 constructor 声明依赖 | 自动注入依赖 |
| 专注业务逻辑 | 处理对象生命周期 |

---

### 记忆口诀

```
@Injectable() 一加，
框架帮你管依赖。
constructor 声明要什么，
不用管它怎么来。
```

---

### 检查清单

学完后，请确认你能回答：

- [ ] 什么是控制反转？用一句话解释。
- [ ] 什么是依赖注入？和 IoC 有什么关系？
- [ ] `@Injectable()` 的作用是什么？
- [ ] 什么时候需要加 `@Injectable()`？
- [ ] 没有依赖注入时，代码有什么问题？

---

### 下一步学习

- 了解 NestJS 的**模块（Module）** 如何组织代码
- 学习**作用域（Scope）**：为什么有些 Service 是单例，有些不是？
- 实践：自己写一个带依赖的 Service 并注入到 Controller

---

**文档结束** ✅

> 如果你还有疑问，可以：
> 1. 重新阅读生活类比部分
> 2. 运行代码示例，观察区别
> 3. 在项目中找一个 Guard/Service 看看它的依赖是如何注入的
