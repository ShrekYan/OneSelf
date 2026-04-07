import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
} from './dto';
import { MOCK_ARTICLES, USER_LIKE_MAP, DEFAULT_USER_ID } from './mock';
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

  toggleLike(body: ToggleLikeRequestDto): Promise<ToggleLikeResponseDto> {
    const { articleId } = body;
    const userLikeSet = USER_LIKE_MAP.get(DEFAULT_USER_ID) ?? new Set<string>();

    // 查找文章
    const articleIndex = MOCK_ARTICLES.findIndex((a) => a.id === articleId);
    if (articleIndex === -1) {
      return Promise.resolve({
        articleId,
        likes: 0,
        isLiked: false,
      });
    }

    const article = MOCK_ARTICLES[articleIndex];
    const isLiked = userLikeSet.has(articleId);

    // 切换点赞状态
    if (isLiked) {
      // 取消点赞
      userLikeSet.delete(articleId);
      article.likes = article.likes - 1;
    } else {
      // 添加点赞
      userLikeSet.add(articleId);
      article.likes = article.likes + 1;
    }

    // 更新内存中的数据（所有接口共享此数据源，保证一致性）
    USER_LIKE_MAP.set(DEFAULT_USER_ID, userLikeSet);
    MOCK_ARTICLES[articleIndex] = { ...article };

    return Promise.resolve({
      articleId,
      likes: article.likes,
      isLiked: !isLiked,
    });
  }

  async getArticleDetail(
    query: GetArticleDetailRequestDto,
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

      // 用户交互状态（默认值）
      isLiked: false,
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
