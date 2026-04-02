import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import {
  QueryArticleListDto,
  ArticleListResponseDto,
  FeaturedArticleListResponseDto,
  ToggleLikeRequestDto,
  ToggleLikeResponseDto,
  GetArticleDetailRequestDto,
  ArticleDetailDto,
} from './dto';

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

  @Get('featured')
  @ApiOperation({ summary: '获取特色文章轮播列表（置顶文章）' })
  getFeaturedArticles(): Promise<FeaturedArticleListResponseDto> {
    return this.articleService.getFeaturedArticles();
  }

  @Post('toggle-like')
  @ApiOperation({ summary: '切换文章点赞状态（点赞/取消点赞）' })
  toggleLike(
    @Body() body: ToggleLikeRequestDto,
  ): Promise<ToggleLikeResponseDto> {
    return this.articleService.toggleLike(body);
  }

  @Get('detail')
  @ApiOperation({ summary: '获取文章详情' })
  getArticleDetail(
    @Query() query: GetArticleDetailRequestDto,
  ): Promise<ArticleDetailDto> {
    return this.articleService.getArticleDetail(query);
  }
}
