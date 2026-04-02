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
