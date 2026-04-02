import { ArticleListItemDto } from '../dto';
import { ContentBlock } from '../dto';
import { MOCK_AUTHORS } from './mock-authors';

/**
 * Mock 文章数据生成 - 生成文章列表和详情内容
 */

// Mock 文章数据生成函数
export function generateMockArticles(): ArticleListItemDto[] {
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
    const author =
      MOCK_AUTHORS[Math.floor(Math.random() * MOCK_AUTHORS.length)];
    const title = titles[i % titles.length];
    const summary = summaries[i % summaries.length];
    const tagsList = tags[i % tags.length];
    const views = Math.floor(Math.random() * 5000) + 100;
    const likes = Math.floor(Math.random() * 200) + 10;
    const commentsCount = Math.floor(Math.random() * 50);
    const date = new Date();
    date.setDate(date.getDate() - i);
    // 前 5 篇设为置顶（特色文章）
    const isTop = i < 5;
    // 根据内容长度估算阅读时间（平均每分钟 200 字）
    const readTime = Math.ceil((summary?.length || 100) / 200) || 1;

    result.push({
      id: String(i + 1),
      title,
      summary,
      coverUrl: `https://picsum.photos/400/300?random=${i + 1}`,
      category,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      tags: tagsList,
      views,
      likes,
      commentsCount,
      publishedAt: date.toISOString(),
      // isTop 和 readTime 添加到数据中，虽然基类 DTO 不包含但数据存在
      // 特色文章 DTO 会继承并暴露这些字段
      isTop,
      readTime,
    });
  }

  return result;
}

/**
 * 根据文章标题和标签生成结构化的 mock 内容
 * 保持多样性，每篇文章生成不同的内容区块
 */
export function generateMockContent(
  title: string,
  tags: string[],
): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // 1. 引言段落
  blocks.push({
    type: 'paragraph',
    text: `在这篇文章中，我们将深入探讨${title}相关的主题。无论你是初学者还是有经验的开发者，相信都能从中获得一些有价值的启发。`,
  } as const);

  // 2. 第一个二级标题
  blocks.push({
    type: 'heading',
    level: 2,
    text: '为什么需要关注这个话题',
  } as const);

  // 3. 说明段落
  blocks.push({
    type: 'paragraph',
    text: `${title} 作为当前前端开发领域的热门话题，越来越多的开发者开始关注它的最佳实践和进阶技巧。随着技术的不断演进，我们对这个主题的理解也在不断深入。`,
  } as const);

  // 4. 根据标签生成要点列表
  if (tags && tags.length > 0) {
    const listItems = tags.map(
      (tag) => `${tag} 在实际项目中的应用场景和最佳实践`,
    );
    // 额外添加几个通用要点
    listItems.push('性能优化相关的注意事项');
    listItems.push('团队协作中的实践经验');
    blocks.push({
      type: 'list',
      items: listItems,
    } as const);
  }

  // 5. 添加一张示例图片
  blocks.push({
    type: 'image',
    imageUrl: `https://picsum.photos/800/450?random=${Math.random()}`,
  } as const);

  // 6. 第二个二级标题
  blocks.push({
    type: 'heading',
    level: 2,
    text: '核心概念解析',
  } as const);

  // 7. 核心概念段落
  blocks.push({
    type: 'paragraph',
    text: '理解核心概念是掌握任何技术的关键。很多初学者容易跳过基础直接进入实战，这样往往会导致知其然而不知其所以然。建议你花足够的时间打牢基础，再进行进阶学习。',
  } as const);

  // 8. 添加名人名言引用
  blocks.push({
    type: 'quote',
    text: '程序设计是一门艺术，贵在平衡与权衡。—— 程序员格言',
  } as const);

  // 9. 第三个二级标题
  blocks.push({
    type: 'heading',
    level: 2,
    text: '实践中的常见问题',
  } as const);

  // 10. 常见问题段落
  blocks.push({
    type: 'paragraph',
    text: '在实际开发过程中，我们经常会遇到各种各样的问题。这些问题往往不是由于概念不清晰，而是由于对一些细节处理不够到位造成的。',
  } as const);

  // 11. 问题列表
  blocks.push({
    type: 'list',
    items: [
      '版本兼容问题：不同环境下的表现差异',
      '性能瓶颈：如何定位和优化',
      '调试困难：善用开发者工具',
      '团队协作：代码风格和规范统一',
    ],
  } as const);

  // 12. 总结段落
  blocks.push({
    type: 'heading',
    level: 2,
    text: '总结与展望',
  } as const);

  blocks.push({
    type: 'paragraph',
    text: `${title} 是一个值得深入研究的领域。希望这篇文章能帮助你对这个主题有更深入的理解。如果你有任何问题或想法，欢迎在评论区交流讨论。`,
  } as const);

  return blocks;
}
