/**
 * 文章列表页面常量
 */

export interface CategoryItem {
  id: string;
  name: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  summary: string;
  coverUrl?: string;
  categoryId: string;
  authorName: string;
  authorAvatar?: string;
  readTime?: number;
  likes: number;
  commentsCount: number;
  isLiked: boolean;
}

/**
 * 分类列表
 */
export const categoryList: CategoryItem[] = [
  { id: 'all', name: '全部' },
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端开发' },
  { id: 'mobile', name: '移动开发' },
  { id: 'design', name: 'UI/UX 设计' },
  { id: 'product', name: '产品管理' },
  { id: 'devops', name: '运维部署' },
  { id: 'ai', name: '人工智能' },
];

/**
 * 模拟文章数据
 */
export const mockArticleList: ArticleItem[] = [
  {
    id: '1',
    title: 'React 19 新特性详解：并发渲染与自动批处理',
    summary:
      'React 19 带来了许多令人期待的新特性，其中并发渲染和自动批处理是最核心的改进。本文将深入探讨这些特性的工作原理和实际应用场景...',
    coverUrl: 'https://via.placeholder.com/400x280/6366f1/ffffff?text=React+19',
    categoryId: 'frontend',
    authorName: '张开发',
    authorAvatar: 'https://via.placeholder.com/100x100/6366f1/ffffff?text=Z',
    readTime: 8,
    likes: 128,
    commentsCount: 32,
    isLiked: false,
  },
  {
    id: '2',
    title: 'TypeScript 严格模式最佳实践',
    summary:
      '开启 strict 模式后，TypeScript 能够帮我们在开发阶段发现更多潜在问题。本文分享一些在大型项目中使用严格模式的经验和技巧...',
    categoryId: 'frontend',
    authorName: '李类型',
    authorAvatar: 'https://via.placeholder.com/100x100/339af0/ffffff?text=L',
    readTime: 6,
    likes: 256,
    commentsCount: 48,
    isLiked: true,
  },
  {
    id: '3',
    title: 'Node.js 性能调优：从 100ms 到 10ms 的优化之旅',
    summary:
      '通过对依赖分析、内存优化和异步流改进，我们将 API 响应时间从平均 100ms 降低到了 10ms。本文记录完整的优化过程...',
    coverUrl: 'https://via.placeholder.com/400x280/339af0/ffffff?text=Node.js',
    categoryId: 'backend',
    authorName: '王性能',
    authorAvatar: 'https://via.placeholder.com/100x100/ef4444/ffffff?text=W',
    readTime: 10,
    likes: 189,
    commentsCount: 41,
    isLiked: false,
  },
  {
    id: '4',
    title: 'React Native 性能优化实战',
    summary:
      '在开发大型 RN 应用时，性能问题是不可避免的。从列表滚动到启动速度，我们积累了这些经过验证的优化方案...',
    coverUrl: 'https://via.placeholder.com/400x280/00ca82/ffffff?text=RN',
    categoryId: 'mobile',
    authorName: '刘移动',
    authorAvatar: 'https://via.placeholder.com/100x100/00ca82/ffffff?text=L',
    readTime: 7,
    likes: 167,
    commentsCount: 29,
    isLiked: false,
  },
  {
    id: '5',
    title: '设计系统：从规范到落地',
    summary:
      '一个好的设计系统能够显著提升设计和开发效率。本文讲述我们是如何从零开始构建设计系统，并在团队中推广使用的...',
    coverUrl: 'https://via.placeholder.com/400x280/fb7185/ffffff?text=Design',
    categoryId: 'design',
    authorName: '陈设计',
    authorAvatar: 'https://via.placeholder.com/100x100/fb7185/ffffff?text=C',
    readTime: 12,
    likes: 312,
    commentsCount: 67,
    isLiked: false,
  },
  {
    id: '6',
    title: '用户中心产品设计方法论',
    summary:
      '如何从用户需求出发，打造真正解决问题的产品？这里分享我们多年总结的产品设计流程和思考框架...',
    categoryId: 'product',
    authorName: '周产品',
    authorAvatar: 'https://via.placeholder.com/100x100/8b5cf6/ffffff?text=Z',
    readTime: 9,
    likes: 178,
    commentsCount: 35,
    isLiked: true,
  },
  {
    id: '7',
    title: 'Docker + Kubernetes 微服务部署实践',
    summary:
      '从单体应用到微服务架构演进，容器化给我们带来了哪些改变？本文分享完整的落地过程和踩坑记录...',
    coverUrl: 'https://via.placeholder.com/400x280/2563eb/ffffff?text=K8s',
    categoryId: 'devops',
    authorName: '赵运维',
    authorAvatar: 'https://via.placeholder.com/100x100/2563eb/ffffff?text=Z',
    readTime: 15,
    likes: 245,
    commentsCount: 53,
    isLiked: false,
  },
  {
    id: '8',
    title: '大语言模型应用开发入门',
    summary:
      '基于 GPT-4 和 LangChain，我们可以快速构建AI原生应用。这篇入门文章带你从零搭建一个问答应用...',
    coverUrl: 'https://via.placeholder.com/400x280/10b981/ffffff?text=AI',
    categoryId: 'ai',
    authorName: '孙 AI',
    authorAvatar: 'https://via.placeholder.com/100x100/10b981/ffffff?text=S',
    readTime: 8,
    likes: 423,
    commentsCount: 89,
    isLiked: false,
  },
  {
    id: '9',
    title: 'MobX 状态管理最佳实践',
    summary:
      'MobX 以其简洁的范式和出色的性能受到很多开发者喜爱。在大型项目中如何组织好状态？本文分享一些经验...',
    categoryId: 'frontend',
    authorName: '黄状态',
    authorAvatar: 'https://via.placeholder.com/100x100/f59e0b/ffffff?text=H',
    readTime: 5,
    likes: 156,
    commentsCount: 28,
    isLiked: false,
  },
  {
    id: '10',
    title: 'Vite 打包原理与性能优化',
    summary:
      'Vite 凭借其极速的启动速度迅速流行开来。本文深入剖析 Vite 的工作原理，并分享一些项目优化实践...',
    coverUrl: 'https://via.placeholder.com/400x280/64748b/ffffff?text=Vite',
    categoryId: 'frontend',
    authorName: '吴打包',
    authorAvatar: 'https://via.placeholder.com/100x100/64748b/ffffff?text=W',
    readTime: 10,
    likes: 289,
    commentsCount: 57,
    isLiked: true,
  },
  {
    id: '11',
    title: 'Prompt Engineering 进阶技巧',
    summary:
      '好的 Prompt 能够让大模型输出质量提升一个档次。这些经过验证的进阶技巧值得一试...',
    categoryId: 'ai',
    authorName: '郑提示',
    authorAvatar: 'https://via.placeholder.com/100x100/06b6d4/ffffff?text=Z',
    readTime: 6,
    likes: 367,
    commentsCount: 72,
    isLiked: false,
  },
  {
    id: '12',
    title: 'CI/CD 流水线优化实践',
    summary:
      '构建时间从 30 分钟降到 5 分钟，我们做了这些优化。分享给正在被慢构建困扰的你...',
    categoryId: 'devops',
    authorName: '林流水线',
    authorAvatar: 'https://via.placeholder.com/100x100/14b8a6/ffffff?text=L',
    readTime: 8,
    likes: 213,
    commentsCount: 45,
    isLiked: false,
  },
];

export type { CategoryItem as ArticleListCategoryItem };
export type { ArticleItem as ArticleListItemArticle };
