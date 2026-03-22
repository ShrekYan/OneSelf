import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SortBy {
  DEFAULT = 'default',
  SALES = 'sales',
  PRICE_ASC = 'priceAsc',
  PRICE_DESC = 'priceDesc',
}

export class QueryProductListDto {
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

  @ApiProperty({ required: false, description: '分类ID，all表示全部' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false, description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    required: false,
    enum: SortBy,
    default: SortBy.DEFAULT,
    description: '排序方式',
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.DEFAULT;
}
