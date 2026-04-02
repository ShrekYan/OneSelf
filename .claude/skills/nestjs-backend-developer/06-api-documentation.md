# 06 - API 文档规范

项目使用 `@nestjs/swagger` 自动生成 API 文档，所有接口必须添加完整的文档装饰。

## Controller 级文档

- 每个 Controller 必须添加 `@ApiTags('module-name')`
- 标签名称和路由前缀保持一致

```typescript
@ApiTags('article')
@Controller('article')
export class ArticleController { ... }
```

## 方法级文档

每个路由方法必须添加 `@ApiOperation`：

```typescript
@Get('list')
@ApiOperation({ summary: '分页查询文章列表' })
queryArticleList(...) { ... }
```

## DTO 字段文档

每个 DTO 字段必须添加 `@ApiProperty`：

```typescript
export class QueryArticleListDto {
  @ApiProperty({
    required: false,
    default: 1,
    description: '页码',
  })
  page?: number;
}
```

### ApiProperty 常用参数

- `required`: 是否必填
- `default`: 默认值
- `description`: 字段描述（清晰说明用途）
- `enum`: 枚举类型
- `type`: 明确类型（嵌套对象时需要）

## 响应文档

- 可以添加 `@ApiResponse` 说明常见错误码
- 成功响应 200 可以省略，Swagger 自动推断
- 重要的错误码（401, 403, 404）可以明确标注

```typescript
@ApiOperation({ summary: '获取文章详情' })
@ApiResponse({ status: 200, description: '查询成功' })
@ApiResponse({ status: 404, description: '文章不存在' })
@Get('detail')
getArticleDetail() { ... }
```

## 文档访问

- 开发环境文档: `http://localhost:3000/api`
- Swagger JSON: `http://localhost:3000/api-json`

## 检查点

- [ ] 每个 Controller 都有 `@ApiTags`
- [ ] 每个路由都有 `@ApiOperation` 并填写了 summary
- [ ] 每个 DTO 每个字段都有 `@ApiProperty` 并填写了 description
