# 05 - TypeScript 规范（NestJS 后端特有）

> **通用 TypeScript 规范**：已抽离至 `.claude/rules/typescript-common.md`，本文件仅定义后端特有规范。

---

## 核心原则补充

- **严格模式**: 必须开启 `strict: true`（通用规范已定义）
- **零 any**: 尽量避免 `any`，优先使用 `unknown` 或具体类型（通用规范已定义）
- **类型优先**: 先定义类型/DTO/Entity，再编写业务逻辑（通用规范已定义）
- **class 优先**: NestJS 基于类架构，DTO、Entity、Controller 都使用 class

---

## 1. 类与装饰器规范

### DTO 类（数据传输对象）

- 必须使用 `class`
- 每个字段必须添加校验装饰器（`@IsString()`, `@IsInt()` 等）
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
- HTTP 方法使用正确的装饰器（`@Get()`, `@Post()`, `@Put()`, `@Delete()`）

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

## 2. 依赖注入规范

- 构造函数注入，必须添加 `private readonly`
- 不要使用属性注入（不稳定）

```typescript
// ✅ 正确
@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
}
```

---

## 3. async/await 规范（后端特有）

✅ **Service**: 异步必须返回 `Promise<Type>`，明确声明泛型
✅ **Controller**: 不需要 `async/await`，直接返回 Promise
✅ **只有需要等待结果**的 Service 方法才使用 `async/await`

```typescript
// ✅ 正确 - Controller 直接返回 Promise
queryArticleList(
  @Query() query: QueryArticleListDto,
): Promise<ArticleListResponseDto> {
  return this.articleService.queryArticleList(query);
}

// ❌ 错误 - Controller 不必要的 async/await
async queryArticleList(
  @Query() query: QueryArticleListDto,
): Promise<ArticleListResponseDto> {
  return await this.articleService.queryArticleList(query);
}
```

---

## 4. 导入排序（后端特有）

导入按以下顺序分组，每组之间空一行。同一组内按字母顺序排列。

| 顺序 | 分组 | 示例 |
|------|------|------|
| 1 | NestJS 官方包 | `@nestjs/common`, `@nestjs/config` |
| 2 | 第三方包 | `@prisma/client`, `argon2`, `class-validator` |
| 3 | Prisma 类型 | `import type { ... } from '@prisma/client'` |
| 4 | 内部模块 | `src/prisma/prisma.service`, `src/common/...` |
| 5 | 当前模块相对导入 | `./dto`, `./service` |

```typescript
// ✅ 正确排序
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Article } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { QueryArticleListDto } from './dto';
```

---

## 5. 私有只读规范

- 依赖注入必须使用 `private readonly`
- 不变属性使用 `readonly`
- 尽可能私有，减少公开暴露

---

## 6. 错误处理规范（后端特有）

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

## 7. Prisma 使用规范

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

---

## 8. 响应格式规范

- 统一返回格式，分页数据使用 `{ data: T[], total: number }`
- 错误码遵循 HTTP 状态码语义

---

## 9. 密码加密规范

**通用安全规范**：见 `.claude/rules/security-common.md`

- **必须使用 Argon2id 算法**（通过 `argon2` 包）
- ❌ **不再使用 bcrypt**: 抗 GPU/ASIC 攻击能力弱
- 推荐配置：
  - `type: argon2.argon2id`
  - `memoryCost: 1 << 16`
  - `timeCost: 3`
  - `parallelism: 1`

```typescript
// ✅ 正确示例
import * as argon2 from 'argon2';

// 哈希密码
const passwordHash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 1 << 16,
  timeCost: 3,
  parallelism: 1,
});

// 验证密码
const isValid = await argon2.verify(passwordHash, password);
```

---

## 10. 检查清单

生成代码前，请确认：

- [ ] 是否开启严格模式 `strict: true`？
- [ ] 是否滥用 `any` 类型？
- [ ] DTO 是否都使用 class + 校验装饰器？
- [ ] 异步函数是否都有显式 `Promise<T>` 返回类型？
- [ ] 依赖注入是否使用构造函数 `private readonly`？
- [ ] 错误是否正确抛出 `HttpException`？
- [ ] 路由参数是否有正确类型标注？
- [ ] Prisma 模型名是否使用 PascalCase？
