# NestJS 后端代码审查报告示例

## 问题列表

### 1. [T0] [架构分层] Controller 直接注入 PrismaService 操作数据库

**问题描述**:
> `UsersController` 直接注入 `PrismaService` 并查询数据库，违反了 Controller 只处理 HTTP 的分层原则。

**当前代码**:
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
```

**修正后的正确代码**:
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.findOne(id);
  }
}
```

**为什么要这样改进**:
- 项目规范要求 Controller 只处理 HTTP 参数和响应，业务逻辑和数据访问统一放在 Service
- 分层清晰后便于单元测试和后续维护
- 避免 Controller 直接依赖 Prisma 细节

### 2. [T1] [TypeScript] Service 方法返回类型使用 any

**问题代码**:
```typescript
async findOne(id: string): Promise<any> {
  return this.prisma.user.findUnique({ where: { id } });
}
```

**修正后的代码**:
```typescript
async findOne(id: string): Promise<UserDto> {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new BusinessException(ErrorCode.USER_NOT_FOUND);
  }
  return this.mapToDto(user);
}
```

**为什么要这样改进**:
- 项目 TypeScript 规范要求函数返回值显式声明，避免 `any`
- 返回 DTO 可以屏蔽数据库字段，防止敏感信息泄露

### 3. [T2] [代码质量] 存在调试用的 console.log

**问题代码**:
```typescript
async findAll() {
  console.log('debug: entering findAll');
  return this.prisma.user.findMany();
}
```

**修正后的代码**:
```typescript
async findAll(): Promise<UserDto[]> {
  return this.prisma.user.findMany();
}
```

**为什么要这样改进**:
- 项目规范要求提交前移除调试代码
- 生产环境不应输出无关日志

## 评分表

| 检查维度 | 评分 | 评价 |
|----------|------|------|
| 架构分层 | 60/100 | Controller 直接操作数据库，需拆分到 Service |
| 命名规范 | 90/100 | 文件命名基本规范，少量 DTO 后缀需统一 |
| Controller/Service | 70/100 | Controller 职责过重，Service 返回类型不明确 |
| DTO 验证 | 80/100 | DTO 基本完整，缺少部分 ApiProperty |
| TypeScript | 70/100 | 存在 any 和未收窄的 catch 块 |
| 错误处理 | 75/100 | 部分业务错误未使用 BusinessException |
| Prisma ORM | 80/100 | 查询基本规范，缺少 select 控制字段 |
| API 文档 | 60/100 | Controller 缺少 ApiTags 和部分 ApiOperation |
| 代码质量 | 70/100 | 存在调试代码，需执行 lint 和 format |

**总分**: 655/900

## 优先改进计划

### T0 必须立即修复

1. - [ ] Controller 直接注入 PrismaService 操作数据库 - 文件: `users.controller.ts`

### T1 建议尽快修复

1. - [ ] Service 方法返回类型使用 any - 文件: `users.service.ts`
2. - [ ] catch 块未正确收窄错误类型 - 文件: `users.service.ts`

### T2 可以后续优化

1. - [ ] 移除调试用的 console.log - 文件: `users.service.ts`
2. - [ ] 为 Controller 补充 ApiTags 和 ApiOperation - 文件: `users.controller.ts`

## 做得好的地方

- DTO 文件按领域组织，结构清晰
- 使用了 `private readonly` 进行依赖注入
- Prisma 查询基本遵循了项目命名规范

## 推荐阅读

- [架构与模块分层检查规则](../reference/review-architecture.md)
- [TypeScript 类型安全检查规则](../reference/review-typescript.md)
- [Controller 与 Service 编码检查规则](../reference/review-controller-service.md)
