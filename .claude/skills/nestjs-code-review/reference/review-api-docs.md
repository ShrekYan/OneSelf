# API 文档检查规则

## 检查清单

- [ ] Controller 添加了 `@ApiTags` 标签
- [ ] 每个路由添加了 `@ApiOperation({ summary })` 说明接口用途
- [ ] 每个 DTO 字段都有 `@ApiProperty` 描述
- [ ] 响应类型使用 `@ApiResponse` 标注
- [ ] 错误响应也有对应的 `@ApiResponse`

## 问题示例

**问题**: Controller 缺少 Swagger 装饰器

**当前代码**:
```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll() {} // ❌ 缺少文档
}
```

**修正后的代码**:
```typescript
@ApiTags('用户管理')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  @Get()
  findAll(): Promise<UserDto[]> {} // ✅
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 文档完整，所有接口都有描述 |
| 80 | 基本完整，少量缺失 |
| 60 | 文档不完整 |
| 0 | 几乎没有文档 |
