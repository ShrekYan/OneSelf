# 命名与文件组织检查规则

## 检查清单

- [ ] 所有文件使用 kebab-case 命名（如 `auth.controller.ts`，不是 `AuthController.ts`）
- [ ] 文件名后缀正确（`.controller.ts`, `.service.ts`, `.dto.ts`, `.module.ts`）
- [ ] 类名使用 PascalCase（`AuthController`, `ArticleService`）
- [ ] 变量和函数使用 camelCase
- [ ] 所有 DTO 类以 `Dto` 结尾（`LoginDto`，不是 `Login` 或 `loginDTO`）
- [ ] 枚举：类名 PascalCase，成员 UPPER_SNAKE_CASE

## 问题示例

**问题**: 文件命名不符合规范

**错误示例**:
- `AuthController.ts` ❌ 应该是 `auth.controller.ts`
- `user.service.ts` ✅ 正确

**问题**: DTO 命名不规范

**当前代码**:
```typescript
export class Login {} // ❌ 应该是 LoginDto
```

**修正后的代码**:
```typescript
export class LoginDto {} // ✅
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 所有命名完全符合规范 |
| 80 | 少量命名不符合规范 |
| 60 | 多个文件命名存在问题 |
| 0 | 命名严重混乱 |
