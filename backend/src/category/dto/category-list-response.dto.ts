import { ApiProperty } from '@nestjs/swagger';
import { CategoryItemDto } from './category-item.dto';

export class CategoryListResponseDto {
  @ApiProperty({ type: [CategoryItemDto], description: '分类列表' })
  list: CategoryItemDto[];

  @ApiProperty({ description: '分类总数' })
  total: number;
}
