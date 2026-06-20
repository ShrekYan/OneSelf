# 错误处理检查规则

## 检查清单

- [ ] 检查到错误立即抛出，不吞异常（不返回 `null` 隐藏错误）
- [ ] 业务错误使用 `BusinessException` + 预定义业务错误码
- [ ] Prisma 操作正确处理常见错误（P2002 唯一冲突、P2025 记录不存在）
- [ ] 错误消息清晰易懂，对用户友好
- [ ] 遵循项目异常分层体系，不自行返回错误码

## 问题示例

**问题**: 使用原始 `throw new Error()`

**当前代码**:
```typescript
if (!user) {
  throw new Error('User not found'); // ❌
}
```

**修正后的代码**:
```typescript
if (!user) {
  throw new BusinessException(ErrorCode.USER_NOT_FOUND); // ✅
}
```

**问题**: 未处理 Prisma 错误

**当前代码**:
```typescript
async create(data: CreateUserDto) {
  return this.prisma.user.create({ data }); // ❌ 未处理唯一约束冲突
}
```

**修正后的代码**:
```typescript
async create(data: CreateUserDto) {
  try {
    return this.prisma.user.create({ data });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new BusinessException(ErrorCode.USER_NAME_CONFLICT);
      }
    }
    throw error;
  }
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 错误处理完善，使用统一异常体系 |
| 80 | 基本处理，少量遗漏 |
| 60 | 存在错误处理问题 |
| 0 | 错误处理严重不足 |
