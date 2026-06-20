# Controller 与 Service 编码检查规则

## Controller 检查清单

- [ ] 路由前缀使用 kebab-case，RESTful 复数命名（`/articles`，不是 `/Article` 或 `/article`）
- [ ] HTTP 方法使用正确（GET 查询，POST 创建，PATCH/PUT 更新，DELETE 删除）
- [ ] 参数获取方式正确（`@Query()` 分页/筛选，`@Param()` ID，`@Body()` 创建/更新）
- [ ] 方法命名符合约定（`queryList`, `getDetail`, `create`, `update`, `remove`）
- [ ] 方法显式声明返回类型 `Promise<ResponseDto>`
- [ ] Controller 方法不使用不必要的 `async/await`（直接返回 Promise 即可）
- [ ] Controller 不包含业务逻辑，只做 HTTP 参数处理和响应

## Service 检查清单

- [ ] 依赖注入使用 `private readonly`
- [ ] PrismaService 正确注入（PrismaModule 已全局注册，直接注入即可）
- [ ] 环境配置通过 ConfigService 获取，不直接读 `process.env`
- [ ] 公共方法在前，私有方法在后，排序清晰

## 问题示例

**问题**: Controller 使用不必要的 async/await

**当前代码**:
```typescript
@Get()
async findAll() {
  const result = await this.service.findAll(); // ❌ 直接返回即可
  return result;
}
```

**修正后的代码**:
```typescript
@Get()
findAll(): Promise<UserDto[]> {
  return this.service.findAll(); // ✅ 直接返回 Promise
}
```

**问题**: 直接读取 process.env

**当前代码**:
```typescript
const apiKey = process.env.API_KEY; // ❌
```

**修正后的代码**:
```typescript
constructor(private readonly configService: ConfigService) {}

const apiKey = this.configService.get('API_KEY'); // ✅
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | 完全符合规范 |
| 80 | 少量问题 |
| 60 | 存在明显问题 |
| 0 | 严重违反规范 |
