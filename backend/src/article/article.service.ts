import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessException } from '../common/exceptions/business.exception';
import { BusinessErrorCode } from '../common/constants/business-error-codes';
import type { Articles, Prisma } from '@prisma/client';
import {
  QueryArticleListDto,
  ArticleListResponseDto,
  ArticleListItemDto,
  ArticleSortBy,
  FeaturedArticleItemDto,
  FeaturedArticleListResponseDto,
  ToggleLikeRequestDto,
  ToggleLikeResponseDto,
  GetArticleDetailRequestDto,
  ArticleDetailDto,
  UserLikeListRequestDto,
  UserLikeListResponseDto,
  CheckLikeStatusRequestDto,
  CheckLikeStatusResponseDto,
} from './dto';
import { convertArticleContentBlocks } from './utils/article-content.converter';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async queryArticleList(
    query: QueryArticleListDto,
  ): Promise<ArticleListResponseDto> {
    // 构建 where 查询条件
    const where: Prisma.ArticlesWhereInput = {
      is_published: true,
    };

    // 按分类筛选
    if (query.categoryId) {
      where.category_id = query.categoryId;
    }

    // 关键词搜索（标题或摘要包含关键词）
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword } },
        { summary: { contains: query.keyword } },
      ];
    }

    // 构建排序
    const orderBy: Prisma.ArticlesOrderByWithRelationInput = {};
    switch (query.sortBy) {
      case ArticleSortBy.VIEWS:
        orderBy.views = 'desc';
        break;
      case ArticleSortBy.LIKES:
        orderBy.likes = 'desc';
        break;
      case ArticleSortBy.PUBLISHED_AT:
      default:
        orderBy.published_at = 'desc';
        break;
    }

    // 分页参数
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    // 并行查询：数据列表 + 总数
    const [articlesWithCategories, total] = await Promise.all([
      this.prisma.articles.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          categories: true,
        },
      }),
      this.prisma.articles.count({ where }),
    ]);

    // 转换数据库结果为 DTO 格式
    const list: ArticleListItemDto[] = articlesWithCategories.map(
      (article: Articles & { categories: { id: string; name: string } }) => ({
        id: article.id,
        title: article.title,
        summary: article.summary ?? undefined,
        coverUrl: article.cover_url ?? undefined,
        category: {
          id: article.categories.id,
          name: article.categories.name,
        },
        authorId: article.author_id,
        authorName: article.author_name ?? undefined,
        authorAvatar: article.author_avatar ?? undefined,
        tags: article.tags
          ? article.tags.split(',').map((t: string) => t.trim())
          : [],
        views: article.views,
        likes: article.likes,
        commentsCount: article.comments_count,
        publishedAt: new Date(Number(article.published_at)).toISOString(),
        isTop: article.is_top,
        readTime: article.read_time ?? undefined,
      }),
    );

    return {
      list,
      total,
      page,
      pageSize,
      hasMore: skip + list.length < total,
    };
  }

  async getFeaturedArticles(): Promise<FeaturedArticleListResponseDto> {
    // 查询置顶且已发布的文章，按发布时间倒序，限制返回数量
    const articlesWithCategories =
      (await // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      (this.prisma as any).articles.findMany({
        where: {
          is_top: true,
          is_published: true,
        },
        include: {
          categories: true,
        },
        orderBy: {
          published_at: 'desc',
        },
        take: 5,
      })) as (Articles & { categories: { id: string; name: string } })[];

    // 转换数据库结果为 DTO 格式（复用与列表查询相同的转换逻辑）
    const list: FeaturedArticleItemDto[] = articlesWithCategories.map(
      (article: Articles & { categories: { id: string; name: string } }) => ({
        id: article.id,
        title: article.title,
        summary: article.summary ?? undefined,
        coverUrl: article.cover_url ?? undefined,
        category: {
          id: article.categories.id,
          name: article.categories.name,
        },
        authorId: article.author_id,
        authorName: article.author_name ?? undefined,
        authorAvatar: article.author_avatar ?? undefined,
        tags: article.tags
          ? article.tags
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
        views: article.views,
        likes: article.likes,
        commentsCount: article.comments_count,
        publishedAt: new Date(Number(article.published_at)).toISOString(),
        isTop: article.is_top,
        readTime: article.read_time ?? 1,
      }),
    );

    return {
      list,
    };
  }

  async toggleLike(
    userId: string,
    body: ToggleLikeRequestDto,
  ): Promise<ToggleLikeResponseDto> {
    const { articleId } = body;

    // 检查文章是否存在
    const article = await this.prisma.articles.findUnique({
      where: { id: articleId },
      select: { id: true, likes: true },
    });

    if (!article) {
      throw new BusinessException(
        BusinessErrorCode.ARTICLE_NOT_FOUND,
        '文章不存在',
      );
    }

    // 检查当前点赞记录是否存在
    const existingLike = await this.prisma.articleLikes.findUnique({
      where: {
        article_id_user_id: {
          article_id: articleId,
          user_id: userId,
        },
      },
    });
    const isLiked = !!existingLike;

    // 使用事务处理：保证点赞记录和计数同时更新
    const result = await this.prisma.$transaction(async (tx) => {
      if (isLiked) {
        // 取消点赞：删除记录，计数减 1
        await tx.articleLikes.delete({
          where: {
            article_id_user_id: {
              article_id: articleId,
              user_id: userId,
            },
          },
        });
        await tx.articles.update({
          where: { id: articleId },
          data: { likes: { decrement: 1 } },
        });
        return { likes: article.likes - 1, isLiked: false };
      } else {
        // 添加点赞：创建记录，计数加 1
        await tx.articleLikes.create({
          data: {
            id: crypto.randomUUID(),
            article_id: articleId,
            user_id: userId,
            created_at: BigInt(Date.now()),
          },
        });
        await tx.articles.update({
          where: { id: articleId },
          data: { likes: { increment: 1 } },
        });
        return { likes: article.likes + 1, isLiked: true };
      }
    });

    return {
      articleId,
      likes: result.likes,
      isLiked: result.isLiked,
    };
  }

  async checkLikeStatus(
    userId: string,
    query: CheckLikeStatusRequestDto,
  ): Promise<CheckLikeStatusResponseDto> {
    const { articleId } = query;

    const like = await this.prisma.articleLikes.findUnique({
      where: {
        article_id_user_id: {
          article_id: articleId,
          user_id: userId,
        },
      },
      select: { id: true },
    });

    return {
      articleId,
      isLiked: !!like,
    };
  }

  async getUserLikeList(
    userId: string,
    query: UserLikeListRequestDto,
  ): Promise<UserLikeListResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    // 查询该用户点赞总数
    const total = await this.prisma.articleLikes.count({
      where: { user_id: userId },
    });

    if (total === 0) {
      return {
        list: [],
        total: 0,
        page,
        pageSize,
        hasMore: false,
      };
    }

    // 分页查询点赞记录，关联文章和分类信息
    const likesWithArticles = await this.prisma.articleLikes.findMany({
      where: { user_id: userId },
      skip,
      take: pageSize,
      orderBy: { created_at: 'desc' },
      include: {
        articles: {
          include: {
            categories: true,
          },
        },
      },
    });

    // 转换为 ArticleListItemDto 格式
    const list: ArticleListItemDto[] = likesWithArticles
      .map((like) => {
        const article = like.articles as Articles & {
          categories: { id: string; name: string };
        };

        if (!article || !article.is_published) {
          return null; // 文章已删除或未发布，过滤掉
        }

        return {
          id: article.id,
          title: article.title,
          summary: article.summary ?? undefined,
          coverUrl: article.cover_url ?? undefined,
          category: {
            id: article.categories.id,
            name: article.categories.name,
          },
          authorId: article.author_id,
          authorName: article.author_name ?? undefined,
          authorAvatar: article.author_avatar ?? undefined,
          tags: article.tags
            ? article.tags
                .split(',')
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [],
          views: article.views,
          likes: article.likes,
          commentsCount: article.comments_count,
          publishedAt: new Date(Number(article.published_at)).toISOString(),
          isTop: article.is_top,
          readTime: article.read_time ?? undefined,
        } as ArticleListItemDto;
      })
      .filter((item) => item !== null);

    return {
      list,
      total,
      page,
      pageSize,
      hasMore: skip + list.length < total,
    };
  }

  async getArticleDetail(
    query: GetArticleDetailRequestDto,
    userId?: string,
  ): Promise<ArticleDetailDto> {
    const { id } = query;
    // 联合查询文章 + 分类 + 内容块
    const article = await this.prisma.articles.findUnique({
      where: { id },
      include: {
        categories: true,
        article_content_blocks: true,
      },
    });

    // 找不到文章返回空对象（保持现有行为）
    if (!article) {
      return Promise.resolve({} as ArticleDetailDto);
    }

    // 异步递增阅读量（原子操作），不等待返回提升响应速度
    this.prisma.articles
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch((err) => {
        console.error('递增阅读量失败:', err);
      });

    // 如果有用户ID，检查是否已点赞
    let isLiked = false;
    console.log(userId);
    if (userId) {
      const like = await this.prisma.articleLikes.findUnique({
        where: {
          article_id_user_id: {
            article_id: id,
            user_id: userId,
          },
        },
        select: { id: true },
      });
      isLiked = !!like;
    }
    // tags 转换：逗号分隔字符串 -> string[]
    const tags: string[] = article.tags
      ? article.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // 时间戳转换：BigInt -> ISO 字符串
    const publishedAtStr = new Date(Number(article.published_at)).toISOString();
    const updatedAtStr = article.updated_at
      ? new Date(Number(article.updated_at)).toISOString()
      : undefined;

    // 转换内容块为 DTO 格式
    const content = convertArticleContentBlocks(article.article_content_blocks);

    // 组装完整 DTO
    const detail: ArticleDetailDto = {
      // 基础字段
      id: article.id,
      title: article.title,
      summary: article.summary ?? undefined,
      coverUrl: article.cover_url ?? undefined,
      // 分类信息（来自关联表），兼容分类不存在的情况
      category: article.categories
        ? {
            id: article.categories.id,
            name: article.categories.name,
          }
        : {
            id: '',
            name: '未分类',
          },

      // 作者信息
      authorId: article.author_id,
      authorName: article.author_name ?? undefined,
      authorAvatar: article.author_avatar ?? undefined,

      // 作者嵌套对象（DTO 需要）
      author: {
        name: article.author_name || '未知作者',
        avatar:
          article.author_avatar || 'https://picsum.photos/100/100?default',
      },

      // tags 转换后
      tags,

      // 统计数据（views + 1 因为已经递增，返回最新值给前端
      views: article.views + 1,
      likes: article.likes,
      commentsCount: article.comments_count,

      // 布尔字段
      isTop: article.is_top,
      readTime: article.read_time ?? undefined,

      // 时间字段：两个字段都需要（publishedAt 继承自基类，publishAt 在 DTO 新增）
      publishedAt: publishedAtStr,
      publishAt: publishedAtStr,

      // 更新时间
      updatedAt: updatedAtStr,

      // 转换后的内容块
      content,

      // 用户交互状态
      isLiked,
      isCollected: false,

      // SEO 字段
      seoKeywords: tags,
      seoDescription: article.summary ?? undefined,
    };

    return detail;
  }

  private sortArticles(
    articles: ArticleListItemDto[],
    sortBy: ArticleSortBy = ArticleSortBy.PUBLISHED_AT,
  ): void {
    switch (sortBy) {
      case ArticleSortBy.VIEWS:
        articles.sort((a, b) => b.views - a.views);
        break;
      case ArticleSortBy.LIKES:
        articles.sort((a, b) => b.likes - a.likes);
        break;
      case ArticleSortBy.PUBLISHED_AT:
      default:
        articles.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        );
        break;
    }
  }
}
