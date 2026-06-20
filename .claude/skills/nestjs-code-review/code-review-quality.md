# 代码质量与格式检查规则

## 检查清单

- [ ] 执行过 `npm run lint` 没有错误
- [ ] 执行过 `npm run format` 格式化
- [ ] 移除了调试用的 `console.log`
- [ ] `npx tsc --noEmit` 类型检查通过
- [ ] 代码注释清晰，复杂逻辑有说明

## 问题示例

**问题**: 存在调试代码

**当前代码**:
```typescript
async findAll() {
  console.log('debug: entering findAll'); // ❌ 调试代码
  return this.prisma.user.findMany();
}
```

**修正后的代码**:
```typescript
async findAll() {
  return this.prisma.user.findMany(); // ✅
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 代码质量高，无调试代码，格式规范 |
| 80 | 基本符合标准 |
| 60 | 存在少量问题 |
| 0 | 代码质量严重问题 |
