import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { QueryProductListDto, ProductListResponseDto } from './dto';

@ApiTags('product')
// 商品模块控制器
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('list')
  @ApiOperation({ summary: '查询商品列表' })
  @ApiBody({ type: QueryProductListDto })
  queryProductList(
    @Query() query: QueryProductListDto,
  ): Promise<ProductListResponseDto> {
    return this.productService.queryProductList(query);
  }
}
