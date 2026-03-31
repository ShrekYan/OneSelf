import { ApiProperty } from '@nestjs/swagger';

export class CategoryItemDto {
  @ApiProperty({ description: '分类ID' })
  id: string;

  @ApiProperty({ description: '分类名称' })
  name: string;

  @ApiProperty({ description: '该分类下已发布文章数量' })
  articleCount: number;

  @ApiProperty({ description: '封面图片URL', required: false })
  imageUrl?: string;

  @ApiProperty({ description: '分类描述', required: false })
  description?: string;

  @ApiProperty({ description: '排序权重', required: false })
  sortOrder?: number;
}
