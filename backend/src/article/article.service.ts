import { Injectable } from '@nestjs/common';
import {
  QueryArticleListDto,
  ArticleListResponseDto,
  ArticleListItemDto,
  ArticleSortBy,
} from './dto';

// Mock 文章数据 - 生成 30 条示例文章
const generateMockArticles = (): ArticleListItemDto[] => {
  const categories = [
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'ui-ux-design', name: 'UI/UX Design' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'mobile', name: 'Mobile Dev' },
    { id: 'devops', name: 'DevOps' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'life-culture', name: 'Life & Culture' },
  ];

  const titles = [
    'React 19 新特性详解',
    'TypeScript 高级技巧汇总',
    '如何设计一个可扩展的组件库',
    '微前端架构实践总结',
    'CSS Grid 布局完全指南',
    '性能优化：从 10s 到 1s 的优化历程',
    'Node.js 内存泄漏排查实战',
    'Docker 容器化最佳实践',
    'React Hooks 使用误区总结',
    '设计系统：从规范到落地',
    'MobX 状态管理最佳实践',
    'GraphQL vs REST 选型分析',
    '持续集成与自动化部署',
    '程序员如何保持学习效率',
    '我的技术栈进化之路',
    '前端工程化：从手动到自动化',
    '移动端 H5 开发踩坑指南',
    'PWA 渐进式 Web 应用实践',
    'Webpack 5 打包优化攻略',
    'Vite 原理与插件开发',
    'Git 工作流规范指南',
    '单元测试：为什么要写，怎么写',
    '函数式编程思想在前端的应用',
    '响应式设计：从弹性到自适应',
    '无障碍开发实践总结',
    '安全：前端常见安全问题防范',
    'SSR 服务端渲染原理与实践',
    '静态站点生成 Next.js 对比',
    'CI/CD 流水线设计心得',
    '开发者工具调试技巧分享',
  ];

  const summaries = [
    'React 19 带来了哪些令人期待的新特性？让我们一起来看看...',
    '整理了一些日常开发中常用的 TypeScript 高级技巧，提升代码质量...',
    '分享一下我在开发大型项目中设计可扩展组件库的经验...',
    '微前端不是银弹，但在特定场景下确实能解决大团队协作问题...',
    'Grid 布局比 Flex 更强大？一文搞懂 Grid 的各种用法...',
    '分享一次真实项目的性能优化经历，从 10 秒加载到 1 秒秒开...',
    'Node.js 项目遇到内存泄漏如何排查？分享几种实用的排查方法...',
    'Docker 不是 DevOps 必须的，但用好它确实能提升效率...',
    'React Hooks 用了这么久，总结一些容易踩的坑...',
    '设计系统不仅仅是样式规范，更是一套协作方法...',
  ];

  const tags = [
    ['React', '前端'],
    ['TypeScript', '类型系统'],
    ['组件库', '架构设计'],
    ['微前端', '架构'],
    ['CSS', '布局'],
    ['性能优化', '实践'],
    ['Node.js', '调试'],
    ['Docker', 'DevOps'],
    ['React', 'Hooks'],
    ['设计系统', '架构'],
  ];

  const result: ArticleListItemDto[] = [];

  for (let i = 0; i < 30; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const title = titles[i % titles.length];
    const summary = summaries[i % summaries.length];
    const tagsList = tags[i % tags.length];
    const views = Math.floor(Math.random() * 5000) + 100;
    const likes = Math.floor(Math.random() * 200) + 10;
    const commentsCount = Math.floor(Math.random() * 50);
    const date = new Date();
    date.setDate(date.getDate() - i);

    result.push({
      id: String(i + 1),
      title,
      summary,
      coverUrl: `https://picsum.photos/400/300?random=${i + 1}`,
      category,
      tags: tagsList,
      views,
      likes,
      commentsCount,
      publishedAt: date.toISOString(),
    });
  }

  return result;
};

const MOCK_ARTICLES = generateMockArticles();

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
