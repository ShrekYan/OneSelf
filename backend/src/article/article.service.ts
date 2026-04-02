import { Injectable } from '@nestjs/common';
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
import {
  MOCK_ARTICLES,
  USER_LIKE_MAP,
  DEFAULT_USER_ID,
  generateMockContent,
} from './mock';

@Injectable()
export class ArticleService {
  queryArticleList(
    query: QueryArticleListDto,
  ): Promise<ArticleListResponseDto> {
    let filteredData = [...MOCK_ARTICLES];

    // 按分类筛选
    if (query.categoryId) {
      filteredData = filteredData.filter(
        (article) => article.category.id === query.categoryId,
      );
    }

    // 关键词搜索
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      filteredData = filteredData.filter(
        (article) =>
          article.title.toLowerCase().includes(keyword) ||
          article.summary?.toLowerCase().includes(keyword),
      );
    }

    // 排序
    this.sortArticles(filteredData, query.sortBy);

    // 分页
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const total = filteredData.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return Promise.resolve({
      list: paginatedData,
      total,
      page,
      pageSize,
      hasMore: endIndex < total,
    });
  }

  getFeaturedArticles(): Promise<FeaturedArticleListResponseDto> {
    // 筛选出置顶文章 = 特色文章，数据来自统一数据源
    const featuredArticles: FeaturedArticleItemDto[] = MOCK_ARTICLES.filter(
      (article) => article.isTop === true,
    ).map(
      (article) =>
        ({
          ...article,
          // 确保 readTime 存在（兼容旧数据）
          readTime: article.readTime ?? Math.floor(Math.random() * 10) + 1,
        }) as FeaturedArticleItemDto,
    );

    return Promise.resolve({
      list: featuredArticles,
    });
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

  getArticleDetail(
    query: GetArticleDetailRequestDto,
  ): Promise<ArticleDetailDto> {
    const { id } = query;

    // 查找文章
    const articleIndex = MOCK_ARTICLES.findIndex((a) => a.id === id);
    if (articleIndex === -1) {
      // 用户要求：找不到返回空对象
      return Promise.resolve({} as ArticleDetailDto);
    }

    const article = MOCK_ARTICLES[articleIndex];

    // 增加阅读量计数（内存修改，保持统计）
    article.views += 1;
    MOCK_ARTICLES[articleIndex] = { ...article };

    // 获取当前用户点赞状态
    const userLikeSet = USER_LIKE_MAP.get(DEFAULT_USER_ID);
    const isLiked = userLikeSet?.has(id) ?? false;

    // 生成结构化的 mock 内容
    const content = generateMockContent(article.title, article.tags || []);

    // 组装完整详情，匹配前端期望的数据结构
    const detail: ArticleDetailDto = {
      ...article,
      // author 嵌套对象（提供默认值满足类型检查）
      author: {
        name: article.authorName ?? '未知作者',
        avatar: article.authorAvatar ?? 'https://picsum.photos/100/100?default',
      },
      // publishAt 字段名匹配前端
      publishAt: article.publishedAt,
      // 结构化内容数组
      content,
      // 点赞状态
      isLiked,
      // 默认未收藏
      isCollected: false,
      // SEO 关键词从 tags 生成
      seoKeywords: article.tags,
    };

    return Promise.resolve(detail);
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
