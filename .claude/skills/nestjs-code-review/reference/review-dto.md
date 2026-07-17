# DTO 与数据验证检查规则

## 检查清单

- [ ] 所有请求/响应都有独立 DTO 定义，不使用 `any`
- [ ] DTO 文件放在 `dto/` 目录，一个 DTO 一个文件
- [ ] 每个字段都添加 `class-validator` 验证装饰器（`@IsString()`, `@IsInt()`, 等）
- [ ] 数字类型都添加了 `@Type(() => Number)`（class-transformer 需要）
- [ ] 可选字段添加 `@IsOptional()` 并设置默认值
- [ ] 所有字段都添加 `@ApiProperty({ description })` 给 Swagger 文档
- [ ] 所有 DTO 在 `dto/index.ts` 统一导出
- [ ] DTO 文件较多时按业务领域分类子目录

## 问题示例

**问题**: DTO 缺少验证装饰器

**当前代码**:
```typescript
export class CreateUserDto {
  name: string; // ❌ 缺少验证
  age: number;  // ❌ 缺少验证和 Type 装饰器
}
```

**修正后的代码**:
```typescript
import { IsString, IsInt, IsOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: '用户姓名' })
  @IsString()
  name: string;

  @ApiProperty({ description: '用户年龄', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  age?: number;
}
```

## 评分标准

| 等级 | 标准 |
|------|------|
| 100 | DTO 定义完整，验证和文档齐全 |
| 80 | 少量字段缺少验证或文档 |
| 60 | 多个 DTO 存在问题 |
| 0 | 严重缺乏验证和文档 |
