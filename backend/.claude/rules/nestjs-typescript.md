# NestJS TypeScript 开发规范

本文档定义 NestJS 后端项目的 TypeScript 开发规范。本项目是前后端分离项目，后端独立维护自身开发规范。

---

## 核心原则

- **严格模式**: 必须开启 `strict: true`，严禁关闭核心检查
- **零 any**: 严禁滥用 `any`，应使用 `unknown` 结合类型守卫
- **类型优先**: 先定义类型/DTO/Entity，再编写业务逻辑
- **class 优先**: NestJS 基于类架构，DTO、Entity、Controller 都使用 class
- **装饰器规范**: 正确使用 NestJS/Prisma/TypeORM 装饰器

---

## 基础类型声明

### type vs interface vs class

| 场景 | 使用 | 示例 |
|---|---|---|
| **DTO / Entity** | `class` | `CreateUserDto {}`，配合 class-validator 装饰器 |
| **Controller / Service** | `class` | `UserController {}`，配合 NestJS 装饰器 |
| **Prisma Model 类型** | 生成的 `type` | `import type { User } from '@prisma/client'` |
| **普通对象形状** | `interface` | `interface UserServiceOptions {}` |
| **联合/交叉类型** | `type` | `type Status = 'idle' | 'loading' | 'success'` |

### 枚举规范

- **推荐**: 使用 TypeScript `enum`（后端服务端代码，tree-shaking 压力小）

```typescript
// ✅ 正确
enum UserStatus {
  Active = 1,
  Inactive = 0,
}
```

### 空值处理

- 可选字段 `?:`，可能为 `null` 必须 `T | null`
- 使用可选链 `?.`，空值合并 `??`

---

## 类与装饰器规范

### DTO 类（数据传输对象）

- 必须使用 `class`
- 每个字段必须添加校验装饰器 (`@IsString()`, `@IsInt()`, 等)
- 使用 `class-validator` + `class-transformer`
- 分组校验（创建 vs 更新）

```typescript
// ✅ 正确示例
import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### Entity / Model

- Prisma: schema 文件定义模型，生成类型直接使用
- TypeORM: 使用 `@Entity()` 装饰器，每个字段正确添加 `@Column()` 等

```typescript
// TypeORM 示例
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;
}
```

### Controller

- 类名必须以 `Controller` 结尾
- 路由路径使用 `@Controller()` 装饰器
- HTTP 方法使用正确的装饰器 (`@Get()`, `@Post()`, `@Put()`, `@Delete()`)

```typescript
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

---

## 依赖注入

- 构造函数注入，必须添加 `private readonly`
- 不要使用属性注入（不稳定）

```typescript
// ✅ 正确
constructor(private readonly usersService: UsersService) {}

// ❌ 错误
constructor(usersService: UsersService) {} // 缺少 private readonly
@Inject() usersService: UsersService; // 属性注入不推荐
```

---

## 异步与错误处理

- 所有异步方法必须显式标注 `Promise<T>` 返回类型
- 使用 `try/catch` 捕获异常
- 抛出 `HttpException` 或其子类

```typescript
// ✅ 正确
async findOne(id: number): Promise<User> {
  const user = await this.userRepository.findOneBy({ id });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
```

---

## 错误处理

- 使用 NestJS 内置异常层：`HttpException` 及其子类
- 自定义异常继承 `HttpException`
- 不要吞掉异常，至少记录日志

```typescript
try {
  await this.userService.create(data);
} catch (error) {
  this.logger.error('Failed to create user', error);
  throw error;
}
```

---

## 项目特定规则

### Prisma 使用规范

- 模型名使用 PascalCase
- 不要在 `schema.prisma` 中使用全小写模型名（会导致 TypeScript 识别问题）
- 查询结果使用生成的类型，不要重新定义

```prisma
// ✅ 正确
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
}
```

### 响应格式

- 统一返回格式，分页数据使用 `{ data: T[], total: number }`
- 错误码遵循 HTTP 状态码语义

---

## 检查清单

生成代码前，请确认：

- [ ] 是否开启严格模式 `strict: true`？
- [ ] 是否滥用 `any` 类型？
- [ ] DTO 是否都使用 class + 校验装饰器？
- [ ] 异步函数是否都有显式 `Promise<T>` 返回类型？
- [ ] 依赖注入是否使用构造函数 `private readonly`？
- [ ] 错误是否正确抛出 `HttpException`？
- [ ] 路由参数是否有正确类型标注？
- [ ] Prisma 模型名是否使用 PascalCase？
