import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { QueryArticleListDto, ArticleListResponseDto } from './dto';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('list')
  @ApiOperation({ summary: '分页查询文章列表' })
  queryArticleList(
    @Query() query: QueryArticleListDto,
  ): Promise<ArticleListResponseDto> {
    return this.articleService.queryArticleList(query);
  }
}
