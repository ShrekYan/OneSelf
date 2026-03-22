import { ApiProperty } from '@nestjs/swagger';

export class ProductItemDto {
  @ApiProperty({ description: '商品ID' })
  id: string;

  @ApiProperty({ description: '商品标题' })
  title: string;

  @ApiProperty({ description: '商品描述' })
  description: string;

  @ApiProperty({ description: '现价' })
  price: number;

  @ApiProperty({ required: false, description: '原价' })
  originalPrice: number;

  @ApiProperty({ description: '销量' })
  sales: number;

  @ApiProperty({ description: '库存' })
  stock: number;

  @ApiProperty({ description: '分类ID' })
  category: string;

  @ApiProperty({ type: [String], description: '标签数组' })
  tags: string[];

  @ApiProperty({ description: '商品图片URL' })
  image: string;

  @ApiProperty({ description: '评分(0-5)' })
  rating: number;

  @ApiProperty({ description: '评论数' })
  reviews: number;

  @ApiProperty({ required: false, description: '折扣(1-100)' })
  discount: number;
}
