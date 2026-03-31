import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryListResponseDto, HotKeywordsResponseDto } from './dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('list')
  @ApiOperation({ summary: '获取全部分类列表' })
  getCategoryList(): Promise<CategoryListResponseDto> {
    return this.categoryService.getList();
  }

  @Get('hot-keywords')
  @ApiOperation({ summary: '获取热门搜索关键词' })
  getHotKeywords(): Promise<HotKeywordsResponseDto> {
    return this.categoryService.getHotKeywords();
  }
}
