# 架构与模块分层检查规则

## 检查清单

- [ ] 是否按业务领域正确拆分模块
- [ ] 分层职责是否清晰（Controller 只处理 HTTP，Service 处理业务逻辑，不交叉）
- [ ] 目录结构是否符合标准模块结构
- [ ] 导入是否正确分组排序（NestJS 包 → 第三方包 → 内部模块 → 当前模块）
- [ ] DTO 是否统一从 `./dto` 导入，不是直接导入单个文件

## 问题示例

**问题**: Controller 中包含业务逻辑

**当前代码**:
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // ❌ Controller 直接操作数据库
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
```

**修正后的代码**:
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // ✅ Controller 只调用 Service
    return this.usersService.findOne(id);
  }
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 架构清晰，分层明确，无交叉职责 |
| 80 | 基本符合规范，少量交叉 |
| 60 | 存在明显的分层问题 |
| 0 | 严重违反分层原则 |
