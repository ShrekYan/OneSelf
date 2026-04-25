import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RemoteJwtAuthGuard } from '../shared/remote-jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user.decorator';
import { ArticleService } from './article.service';
import {
  QueryArticleListDto,
  QueryArticleListByUserIdDto,
  ArticleListResponseDto,
  FeaturedArticleListResponseDto,
  ToggleLikeRequestDto,
  ToggleLikeResponseDto,
  GetArticleDetailRequestDto,
  ArticleDetailDto,
  UserLikeListRequestDto,
  UserLikeListResponseDto,
  CheckLikeStatusRequestDto,
  CheckLikeStatusResponseDto,
  UserLikeListByUserIdResponseDto,
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
  @UseGuards(RemoteJwtAuthGuard)
  toggleLike(
    @CurrentUserId() userId: string,
    @Body() body: ToggleLikeRequestDto,
  ): Promise<ToggleLikeResponseDto> {
    return this.articleService.toggleLike(userId, body);
  }

  @UseGuards(RemoteJwtAuthGuard)
  @Get('my-likes')
  @ApiOperation({ summary: '获取当前用户点赞列表' })
  getUserLikeList(
    @CurrentUserId() userId: string,
    @Query() query: UserLikeListRequestDto,
  ): Promise<UserLikeListResponseDto> {
    return this.articleService.getUserLikeList(userId, query);
  }

  @UseGuards(RemoteJwtAuthGuard)
  @Get('check-like')
  @ApiOperation({ summary: '检查当前用户是否已点赞某篇文章' })
  checkLikeStatus(
    @CurrentUserId() userId: string,
    @Query() query: CheckLikeStatusRequestDto,
  ): Promise<CheckLikeStatusResponseDto> {
    return this.articleService.checkLikeStatus(userId, query);
  }

  @Get('detail')
  @ApiOperation({ summary: '获取文章详情' })
  getArticleDetail(
    @Query() query: GetArticleDetailRequestDto,
    @CurrentUserId() userId?: string,
  ): Promise<ArticleDetailDto> {
    return this.articleService.getArticleDetail(query, userId);
  }

  @UseGuards(RemoteJwtAuthGuard)
  @Post('user-likes')
  @ApiOperation({ summary: '查询当前用户点赞的所有文章ID列表' })
  getUserLikeListByUserId(
    @CurrentUserId() userId: string,
  ): Promise<UserLikeListByUserIdResponseDto> {
    return this.articleService.getUserLikeListByUserId({ userId });
  }

  @Post('list-by-user')
  @ApiOperation({ summary: '根据用户ID分页查询该用户发布的文章列表' })
  queryArticleListByUserId(
    @Body() query: QueryArticleListByUserIdDto,
  ): Promise<ArticleListResponseDto> {
    return this.articleService.queryArticleListByUserId(query);
  }
}
