# TypeScript 类型安全检查规则

## 检查清单

- [ ] 所有方法参数都有显式类型声明
- [ ] 所有方法返回值都有显式类型声明
- [ ] `async` 方法正确返回 `Promise<T>`
- [ ] 尽量避免使用 `any`，优先使用 `unknown` 或具体类型
- [ ] catch 块中 `error: unknown` 正确进行类型收窄（`if (error instanceof Error)`）
- [ ] 仅导出类型时使用 `export type`（利于 tree-shaking）

## 问题示例

**问题**: 使用 `any` 类型

**当前代码**:
```typescript
async findOne(id: string): Promise<any> { // ❌
  return this.prisma.user.findUnique({ where: { id } });
}
```

**修正后的代码**:
```typescript
async findOne(id: string): Promise<UserDto> { // ✅
  return this.prisma.user.findUnique({ where: { id } });
}
```

**问题**: catch 块未正确处理错误类型

**当前代码**:
```typescript
try {
  await this.prisma.user.create(data);
} catch (error: any) { // ❌
  console.log(error.message);
}
```

**修正后的代码**:
```typescript
try {
  await this.prisma.user.create(data);
} catch (error: unknown) { // ✅
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 类型完全安全，无 `any` 使用 |
| 80 | 少量类型问题 |
| 60 | 存在明显类型安全问题 |
| 0 | 大量使用 `any`，类型不安全 |
