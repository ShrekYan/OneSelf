# Prisma ORM 最佳实践检查规则

## 检查清单

- [ ] Schema 中每个模型和字段都有 `///` 文档注释
- [ ] 模型名 PascalCase，表名使用 `@@map("underscore")` 下划线复数
- [ ] 字段名数据库层面使用下划线命名
- [ ] 查询使用 `select` 只获取需要的字段（提升查询性能）
- [ ] 多个原子写操作使用事务 `$transaction` 保证一致性
- [ ] 查询单条记录处理了记录不存在的情况（抛出对应业务异常）
- [ ] 从数据库到 DTO 正确完成下划线 → 驼峰命名转换
- [ ] 分页查询正确使用 `skip` + `take` 并查询总数
- [ ] 常用查询字段添加了索引 (`@@index` 或 `@unique`)
- [ ] 全小写模型名正确处理了 TypeScript 类型问题

## 问题示例

**问题**: 查询未使用 select，返回所有字段

**当前代码**:
```typescript
const user = await this.prisma.user.findUnique({
  where: { id },
}); // ❌ 返回所有字段
```

**修正后的代码**:
```typescript
const user = await this.prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
  }, // ✅ 只选择需要的字段
});
```

**问题**: 未处理记录不存在的情况

**当前代码**:
```typescript
async findOne(id: string) {
  return this.prisma.user.findUnique({ where: { id } }); // ❌
}
```

**修正后的代码**:
```typescript
async findOne(id: string) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new BusinessException(ErrorCode.USER_NOT_FOUND); // ✅
  }
  return user;
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | Prisma 使用规范，性能优化到位 |
| 80 | 基本符合规范 |
| 60 | 存在明显问题 |
| 0 | Prisma 使用严重不规范 |
