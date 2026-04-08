# 04 - DTO 与数据验证规范

## DTO 核心原则

- **每个请求/响应都要有 DTO**: 禁止使用 `any` 或不定义类型
- **一个 DTO 一个文件**: 每个 DTO 类单独一个文件，放在 `dto/` 目录
- **统一导出**: 所有 DTO 在 `dto/index.ts` 导出
- **完整文档**: 每个字段都要有 `@ApiProperty` 描述

## DTO 文件内容结构

顺序：导入 → 枚举 → DTO 类

```typescript
// 1. 导入
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

// 2. 枚举（如果有）
export enum ArticleSortBy {
  PUBLISHED_AT = 'publishedAt',
  VIEWS = 'views',
  LIKES = 'likes',
}

// 3. DTO 类
export class QueryArticleListDto {
  @ApiProperty({ required: false, default: 1, description: '页码' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, description: '每页数量' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;
}
```

## 验证规则

- **必须使用 `class-validator` 装饰器** 进行验证
- 数字类型必须配合 `@Type(() => Number)` 做类型转换
- 必填字段不加 `@IsOptional()`，自动要求存在
- 可选字段必须加 `@IsOptional()` 并设置默认值
- 默认值在 DTO 中直接赋值

### 常用验证装饰器

| 场景 | 装饰器 |
|------|--------|
| 必填 | 不添加 `@IsOptional()` |
| 可选 | `@IsOptional()` |
| 字符串 | `@IsString()` |
| 数字 | `@IsInt()`, `@Min()`, `@Max()` |
| 枚举 | `@IsEnum(EnumType)` |
| Boolean | `@IsBoolean()` |
| 邮箱 | `@IsEmail()` |

## 嵌套对象

```typescript
export class AuthorInfoDto {
  @ApiProperty({ description: '作者名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '作者头像' })
  @IsString()
  avatar: string;
}

export class ArticleDetailDto {
  @ApiProperty({ description: '文章ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '作者信息' })
  @Type(() => AuthorInfoDto)
  author: AuthorInfoDto;
}
```

## 导出规则

所有 DTO 在 `dto/index.ts` 中**具名导出**：

```typescript
export { ArticleListItemDto } from './article-list-item.dto';
export { ArticleListResponseDto } from './article-list-response.dto';
export { QueryArticleListDto, ArticleSortBy } from './query-article-list.dto';
```

## 最佳实践

- 请求 DTO 和响应 DTO 分开定义，不混用
- 即使字段可选，也要明确标注 `@IsOptional()`
- 给 `@ApiProperty` 添加 `description`，便于阅读 Swagger 文档
- 默认值可以在 DTO 定义时直接赋值，避免 Service 中处理默认值
- 嵌套对象必须使用 `@Type(() => NestedClass)`

## DTO 目录分类组织规范

当模块下 DTO 文件数量超过 **10 个** 时，建议按**业务领域**进行分类组织，提高可维护性。

### 推荐方案：按业务领域粗分

当模块包含多个独立业务子功能时，按业务领域创建子目录，同一业务领域的所有 DTO 都放在一起：

```
src/[module]/dto/
├── index.ts           # 统一出口，重新导出所有 DTO
├── article/           # 按业务领域划分子目录
│   ├── article-detail.dto.ts
│   ├── article-list-item.dto.ts
│   ├── article-list-response.dto.ts
│   ├── featured-article-item.dto.ts
│   ├── featured-article-list-response.dto.ts
│   ├── get-article-detail-request.dto.ts
│   └── query-article-list.dto.ts
└── like/              # 点赞互动业务
    ├── check-like-status-request.dto.ts
    ├── check-like-status-response.dto.ts
    ├── toggle-like-request.dto.ts
    ├── toggle-like-response.dto
    ├── user-like-list-by-user-id-request.dto.ts
    ├── user-like-list-by-user-id-response.dto.ts
    ├── user-like-list-request.dto.ts
    └── user-like-list-response.dto.ts
```

**优点：**
- ✅ 符合领域驱动设计：同一业务功能的 DTO 聚合在一起
- ✅ 层次更浅：相比"业务 + 请求/响应"双重分类少一层嵌套，路径更简洁
- ✅ 重构成本低：只需要移动文件并更新根 `index.ts` 导出路径
- ✅ 对外兼容：外部导入方式保持不变（仍然从 `./dto` 导入），不需要修改任何使用代码
- ✅ 渐进式演进：单个业务领域文件过多时，可以再进一步拆分为 `request/` + `response/`

**原则：**
- 同一个业务领域的请求 DTO 和响应 DTO 都放在同一子目录
- 保持根 `index.ts` 统一导出，对外部完全透明

### 备选方案：按业务 + 用途双重分类

如果业务领域内文件数量较多（超过 10 个），可以进一步细分：

```
dto/article/
├── request/
│   ├── get-article-detail-request.dto.ts
│   └── query-article-list.dto.ts
└── response/
    ├── article-detail.dto.ts
    ├── article-list-item.dto.ts
    └── ...
```

### 不推荐：仅按用途分类（requests / responses）

```
dto/requests/  dto/responses/
```

这种方式按技术类型而非业务领域分类，同一个业务功能的请求和响应会被拆分到两处，不利于开发时查找和维护，不符合领域驱动设计理念。

### 导入路径更新示例

移动文件后，只需要更新根 `dto/index.ts` 的导出路径：

```typescript
// 修改前（所有文件平摊）
export { ArticleSortBy, QueryArticleListDto } from './query-article-list.dto';
export { GetArticleDetailRequestDto } from './get-article-detail-request.dto';

// 修改后（按业务分类）
export { ArticleSortBy, QueryArticleListDto } from './article/query-article-list.dto';
export { GetArticleDetailRequestDto } from './article/get-article-detail-request.dto';
```

### 影响面分析与风险控制

- **外部使用代码**：`controller.ts` 和 `service.ts` 都从 `./dto` 统一导入，不需要任何修改
- **DTO 内部引用**：同一业务子目录内的互相引用，相对路径保持不变，不需要修改
- **跨子目录引用**：只需要调整相对路径深度（从 `'./xxx'` 变为 `'../article/xxx'`）
- **风险极低**：只重构目录结构，不改变任何业务逻辑

### 检查清单

- [ ] DTO 文件数量超过 10 个时才需要分类
- [ ] 按业务领域划分子目录，不按技术类型分类
- [ ] 保持根 `index.ts` 统一导出，对外接口不变
- [ ] 移动文件后检查相对导入路径
- [ ] 运行 `npx tsc --noEmit` 验证编译通过
