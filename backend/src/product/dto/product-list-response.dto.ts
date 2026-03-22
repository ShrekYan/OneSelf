import { ProductItemDto } from './product-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductItemDto], description: '商品列表' })
  list: ProductItemDto[];

  @ApiProperty({ description: '总数' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页数量' })
  pageSize: number;

  @ApiProperty({ description: '是否有更多数据' })
  hasMore: boolean;
}
