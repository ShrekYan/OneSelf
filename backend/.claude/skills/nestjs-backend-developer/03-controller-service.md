# 03 - Controller 与 Service 开发规范

## Controller 开发规范

### 路由装饰器

- 使用 `@Controller('route-path')` 定义路由前缀
- 使用 `@Get()`, `@Post()`, `@Put()`, `@Delete()` 定义具体路由
- 路由路径使用 kebab-case，复数命名（RESTful 风格）

```typescript
// ✅ 正确
@ApiTags('article')
@Controller('article')
export class ArticleController {
  @Get('list')
  queryArticleList() { ... }

  @Get('detail')
  getArticleDetail() { ... }
}
```

### 参数获取

- **Query 参数**: 使用 `@Query()` dto: QueryDto
- **路径参数**: 使用 `@Param('id') id: string`
- **Body 参数**: 使用 `@Body() dto: CreateArticleDto`
- **当前用户**: 使用自定义装饰器 `@CurrentUser() userId: string`

### 方法命名规范

| HTTP 方法 | 操作 | 方法命名 |
|-----------|------|----------|
| GET | 查询列表 | `query{Resource}List` |
| GET | 查询单个 | `get{Resource}Detail` |
| GET | 获取特色/特定数据 | `get{FeatureName}` |
| POST | 创建 | `create{Resource}` |
| PUT | 更新 | `update{Resource}` |
| DELETE | 删除 | `delete{Resource}` |
| POST | 操作/切换状态 | `toggle{Action}` |

### 返回类型

- 所有方法必须显式声明返回类型 `Promise<ResponseDto>`
- Controller 方法不需要 `async`/`await`，直接返回 Service Promise
- 不需要捕获异常，让全局异常过滤器处理

```typescript
// ✅ 正确
@Get('list')
@ApiOperation({ summary: '分页查询文章列表' })
queryArticleList(
  @Query() query: QueryArticleListDto,
): Promise<ArticleListResponseDto> {
  return this.articleService.queryArticleList(query);
}

// ❌ 不必要的 async/await
async queryArticleList(...) {
  return await this.articleService.queryArticleList(query);
}
```

## Service 开发规范

### 依赖注入

- 使用构造函数注入，依赖声明在 constructor 参数中
- NestJS 自动处理依赖注入，不需要手动实例化

```typescript
// ✅ 正确
@Injectable()
export class ArticleService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly configService: ConfigService,
  ) {}
}
```

### 方法编写

- 私有方法命名: 小写开头，驼峰命名
- 工具私有方法放在末尾
- 业务逻辑清晰，复杂逻辑拆分多个私有方法

### 环境配置

- 使用 `ConfigService` 获取环境变量，不要硬编码
- 不要直接读取 `process.env`

```typescript
// ✅ 正确
constructor(
  private readonly configService: ConfigService,
) {
  const port = this.configService.get<number>('PORT');
}

// ❌ 错误
const port = process.env.PORT;
```

### Mock 开发

- 开发阶段可以使用内存 Mock 数据，放在 `mock/` 目录
- Mock 数据统一从 `./mock` 导入
- 保持接口定义不变，切换数据库时不影响 Controller

## 代码格式

- 依赖注入构造函数放在 Controller/Service 最前面
- 路由方法按 HTTP 方法排序
- 私有方法放在所有公共方法后面
