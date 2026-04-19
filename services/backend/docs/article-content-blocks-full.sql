-- ============================================
-- article_content_blocks 表 - 完整批量插入数据
-- 30 篇文章 × 约 12-14 块 = 共 398 条记录
-- 完全遵循 generateMockContent() 生成逻辑
-- ============================================

-- 文章 1: React 19 新特性详解
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-1-1', 'article-1', 'heading', 'React 19 新特性详解', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-2', 'article-1', 'text', '在这篇文章中，我们将深入探讨React 19新特性详解相关的主题。无论你是初学者还是有经验的开发者，相信都能从中获得一些有价值的启发。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-3', 'article-1', 'heading', '为什么需要关注这个话题', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-4', 'article-1', 'text', 'React 19新特性详解 作为当前前端开发领域的热门话题，越来越多的开发者开始关注它的最佳实践和进阶技巧。随着技术的不断演进，我们对这个主题的理解也在不断深入。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-5', 'article-1', 'text', 'React 在实际项目中的应用场景和最佳实践\n前端 在实际项目中的应用场景和最佳实践\n性能优化相关的注意事项\n团队协作中的实践经验', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-6', 'article-1', 'image', 'https://picsum.photos/800/450?random=0.1234', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-7', 'article-1', 'heading', '核心概念解析', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-8', 'article-1', 'text', '理解核心概念是掌握任何技术的关键。很多初学者容易跳过基础直接进入实战，这样往往会导致知其然而不知其所以然。建议你花足够的时间打牢基础，再进行进阶学习。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-9', 'article-1', 'quote', '程序设计是一门艺术，贵在平衡与权衡。—— 程序员格言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-10', 'article-1', 'heading', '实践中的常见问题', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-11', 'article-1', 'text', '在实际开发过程中，我们经常会遇到各种各样的问题。这些问题往往不是由于概念不清晰，而是由于对一些细节处理不够到位造成的。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-12', 'article-1', 'text', '版本兼容问题：不同环境下的表现差异\n性能瓶颈：如何定位和优化\n调试困难：善用开发者工具\n团队协作：代码风格和规范统一', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-13', 'article-1', 'heading', '总结与展望', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-1-14', 'article-1', 'text', 'React 19 新特性详解 是一个值得深入研究的领域。希望这篇文章能帮助你对这个主题有更深入的理解。如果你有任何问题或想法，欢迎在评论区交流讨论。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 2: TypeScript 高级技巧汇总
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-2-1', 'article-2', 'heading', 'TypeScript 高级技巧汇总', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-2', 'article-2', 'text', '在这篇文章中，我们将深入探讨TypeScript 高级技巧汇总相关的主题。无论你是初学者还是有经验的开发者，相信都能从中获得一些有价值的启发。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-3', 'article-2', 'heading', '为什么需要关注这个话题', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-4', 'article-2', 'text', 'TypeScript 高级技巧汇总 作为当前前端开发领域的热门话题，越来越多的开发者开始关注它的最佳实践和进阶技巧。随着技术的不断演进，我们对这个主题的理解也在不断深入。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-5', 'article-2', 'text', 'TypeScript 在实际项目中的应用场景和最佳实践\n类型系统 在实际项目中的应用场景和最佳实践\n性能优化相关的注意事项\n团队协作中的实践经验', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-6', 'article-2', 'image', 'https://picsum.photos/800/450?random=0.4567', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-7', 'article-2', 'heading', '核心概念解析', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-8', 'article-2', 'text', '理解核心概念是掌握任何技术的关键。很多初学者容易跳过基础直接进入实战，这样往往会导致知其然而不知其所以然。建议你花足够的时间打牢基础，再进行进阶学习。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-9', 'article-2', 'quote', '程序设计是一门艺术，贵在平衡与权衡。—— 程序员格言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-10', 'article-2', 'heading', '实践中的常见问题', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-11', 'article-2', 'text', '在实际开发过程中，我们经常会遇到各种各样的问题。这些问题往往不是由于概念不清晰，而是由于对一些细节处理不够到位造成的。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-12', 'article-2', 'text', '版本兼容问题：不同环境下的表现差异\n性能瓶颈：如何定位和优化\n调试困难：善用开发者工具\n团队协作：代码风格和规范统一', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-13', 'article-2', 'heading', '总结与展望', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-2-14', 'article-2', 'text', 'TypeScript 高级技巧汇总 是一个值得深入研究的领域。希望这篇文章能帮助你对这个主题有更深入的理解。如果你有任何问题或想法，欢迎在评论区交流讨论。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 3: 如何设计一个可扩展的组件库
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-3-1', 'article-3', 'heading', '如何设计一个可扩展的组件库', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-2', 'article-3', 'text', '在这篇文章中，我将分享我在开发大型项目中设计可扩展组件库的经验。从需求分析到最终落地，一步步带你理解组件库设计的核心思想。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-3', 'article-3', 'heading', '设计目标：可扩展性从何而来', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-4', 'article-3', 'text', '一个好的组件库不仅仅是提供一些现成的组件，更重要的是提供一套完整的扩展机制，让使用者能够在不修改源码的情况下定制自己的需求。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-5', 'article-3', 'text', '组件库设计 需要考虑的关键点：\n一致的API设计风格\n清晰的属性命名规范\n合理的默认值配置\n完善的类型定义支持', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-6', 'article-3', 'image', 'https://picsum.photos/800/450?random=0.1111', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-7', 'article-3', 'heading', '组件分类与组织', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-8', 'article-3', 'text', '根据组件的职责和使用场景进行合理分类，能让组件库更易于维护和使用。基础组件、业务组件、模板组件，不同层级各司其职。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-9', 'article-3', 'quote', '复用不在于重复使用，而在于易于扩展。—— 设计箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-10', 'article-3', 'heading', '常见的设计误区', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-11', 'article-3', 'text', '很多团队在设计组件库时容易陷入过度抽象的陷阱。为了复用而复用户，反而增加了使用复杂度。找到平衡点才是关键。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-12', 'article-3', 'text', '过度抽象：为未来不确定的需求提前设计\n配置爆炸：太多可选配置难以记忆\n文档缺失：使用者不知道如何扩展\n测试不足：复杂交互难以保证质量', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-13', 'article-3', 'heading', '总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-3-14', 'article-3', 'text', '设计一个可扩展的组件库是一个持续演进的过程，需要不断根据实际使用反馈进行调整。希望这些经验能帮助你在自己的项目中少踩一些坑。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 4: 微前端架构实践总结
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-4-1', 'article-4', 'heading', '微前端架构实践总结', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-2', 'article-4', 'text', '微前端不是银弹，但在特定场景下确实能解决大团队协作问题。本文将分享我们在实际项目中落地微前端架构的经验总结。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-3', 'article-4', 'heading', '什么时候需要微前端', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-4', 'article-4', 'text', '当你的项目足够大，团队足够多，需要独立部署和技术栈升级时，微前端架构就能体现它的价值。但如果只是中小项目，单体应用反而更简单。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-5', 'article-4', 'text', '适合使用微前端的场景：\n多个团队协同开发同一个产品\n需要独立部署发布周期\n不同子应用技术栈不同\n需要逐步重构遗留系统', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-6', 'article-4', 'image', 'https://picsum.photos/800/450?random=0.2222', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-7', 'article-4', 'heading', '核心架构原则', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-8', 'article-4', 'text', '微前端的核心理念是去中心化。每个子应用都是独立的，有自己的仓库、发布流程和技术栈。主应用只负责组织和路由。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-9', 'article-4', 'quote', '高内聚低耦合，分而治之。—— 架构箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-10', 'article-4', 'heading', '实践中遇到的问题', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-11', 'article-4', 'text', '微前端带来独立部署好处的同时，也带来了一些新的挑战。公共依赖如何管理？样式如何隔离？状态如何共享？这些都需要仔细设计。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-12', 'article-4', 'text', '公共依赖重复加载问题\nCSS 样式冲突隔离\n跨应用状态共享\n性能优化和加载策略', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-13', 'article-4', 'heading', '总结与建议', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-4-14', 'article-4', 'text', '微前端架构适合大型项目和多团队协作，但不建议中小项目盲目跟风。根据自己的实际情况选择合适的架构才是最重要的。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 5: CSS Grid 布局完全指南
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-5-1', 'article-5', 'heading', 'CSS Grid 布局完全指南', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-2', 'article-5', 'text', 'Grid 布局比 Flex 更强大？一文搞懂 Grid 的各种用法，让你轻松应对各种复杂布局场景。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-3', 'article-5', 'heading', 'Grid 与 Flex 的区别', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-4', 'article-5', 'text',很多人会问 Grid 和 Flex 应该怎么选？其实它们不是替代关系，而是互补关系。Flex 是一维布局，Grid 是二维布局。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-5', 'article-5', 'text', '使用场景对比：\nFlexbox：一维排列，导航、列表等\nGrid：二维网格，整体页面布局\n实际开发中结合使用效果最佳', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-6', 'article-5', 'image', 'https://picsum.photos/800/450?random=0.3333', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-7', 'article-5', 'heading', '核心概念讲解', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-8', 'article-5', 'text', '掌握容器和项目、行和列、网格线、间距这些核心概念，就能理解 Grid 布局的基本工作原理。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-9', 'article-5', 'quote', '学好布局，CSS 就掌握了一半。—— CSS 学习真言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-10', 'article-5', 'heading', '常用属性详解', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-11', 'article-5', 'text',从模板创建到项目放置，从自动布局到对齐方式，我们一步步来看 Grid 提供了哪些强大的属性。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-12', 'article-5', 'text', 'display: grid 开启网格布局\ngrid-template-columns 定义列宽\nfr 单位实现弹性响应式\ngap 属性设置间距更方便', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-13', 'article-5', 'heading', '实际案例演示', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-5-14', 'article-5', 'text', 'CSS Grid 布局 是一个非常强大的工具，掌握它能让你的布局能力提升一个层次。希望这篇指南能帮助你更好地理解和使用 Grid 布局。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 6: 性能优化：从 10s 到 1s 的优化历程
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-6-1', 'article-6', 'heading', '性能优化：从 10s 到 1s 的优化历程', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-2', 'article-6', 'text', '分享一次真实项目的性能优化经历，从 10 秒加载到 1 秒秒开，我们都做了哪些事情？', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-3', 'article-6', 'heading', '优化前的状况', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-4', 'article-6', 'text', '项目初期为了快速上线，堆了很多第三方依赖，代码也没有太注意性能。随着功能增加，加载速度越来越慢，用户体验越来越差。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-5', 'article-6', 'text', '性能指标：\n首屏加载时间：10.2s\n打包体积：2.8MB\nLighthouse 评分：42 分', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-6', 'article-6', 'image', 'https://picsum.photos/800/450?random=0.4444', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-7', 'article-6', 'heading', '性能分析定位', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-8', 'article-6', 'text', '先测量，再优化。使用 Chrome DevTools 和 Lighthouse 分析瓶颈，找到真正的性能问题所在。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-9', 'article-6', 'quote', '先测量，再优化。不要靠猜测优化。—— 性能优化箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-10', 'article-6', 'heading', '关键优化步骤', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-11', 'article-6', 'text', '我们针对发现的问题进行了一系列优化，每一步都测量效果，验证优化收益。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-12', 'article-6', 'text', '代码分割：路由级别分割\n图片压缩和懒加载\n第三方库按需引入\nGzip/Brotli 压缩\n缓存策略优化', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-13', 'article-6', 'heading', '优化结果', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-6-14', 'article-6', 'text', '经过一系列优化，首屏加载从 10s 降到 1s，Lighthouse 评分从 42 提升到 92。性能优化是一个持续的过程，需要我们持续关注。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 7: Node.js 内存泄漏排查实战
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-7-1', 'article-7', 'heading', 'Node.js 内存泄漏排查实战', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-2', 'article-7', 'text', 'Node.js 项目遇到内存泄漏如何排查？分享几种实用的排查方法和工具，让你面对内存泄漏不再慌。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-3', 'article-7', 'heading', '内存泄漏的表现', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-4', 'article-7', 'text', '服务运行一段时间后越来越慢，RSS 内存占用持续增长，频繁触发 Full GC，甚至最终 OOM 被系统杀掉。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-5', 'article-7', 'text', '常见内存泄漏原因：\n未清理的定时器和事件监听器\n缓存无限增长\n闭包引用不释放\n全局变量持续累积', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-6', 'article-7', 'image', 'https://picsum.photos/800/450?random=0.5555', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-7', 'article-7', 'heading', '排查工具和方法', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-8', 'article-7', 'text', 'Node.js 提供了一些内置工具帮助我们排查内存问题。process.memoryUsage 可以查看内存使用情况，--inspect 配合 Chrome DevTools 可以拍 Heap Snapshot。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-9', 'article-7', 'quote', '不积跬步无以至千里，内存泄漏都是一点点累积的。—— 调试箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-10', 'article-7', 'heading', '实战案例分析', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-11', 'article-7', 'text', '通过一个真实案例，一步步展示如何定位到内存泄漏点，最终解决问题。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-12', 'article-7', 'text', '第一步：确认确实存在内存泄漏\n第二步：生成 Heap Snapshot\n第三步：对比分析找到泄漏对象\n第四步：定位代码修复问题\n第五步：验证修复效果', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-13', 'article-7', 'heading', '总结预防', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-7-14', 'article-7', 'text', 'Node.js 内存泄漏排查 需要一定的经验和技巧。掌握正确的方法，就能快速定位解决问题。平时编码时也要注意资源释放，预防内存泄漏。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 8: Docker 容器化最佳实践
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-8-1', 'article-8', 'heading', 'Docker 容器化最佳实践', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-2', 'article-8', 'text', 'Docker 不是 DevOps 必须的，但用好它确实能提升效率。本文总结了一些在实际项目中使用 Docker 的最佳实践。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-3', 'article-8', 'heading', '基础镜像选择', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-4', 'article-8', 'text', '选择合适的基础镜像是第一步。alpine 镜像虽然小，但 glibc 兼容性问题有时候会坑人。slim 镜像通常是更好的权衡。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-5', 'article-8', 'text', '镜像选择建议：\nalpine：体积最小，适合对大小敏感场景\nslim：Debian 基础，兼容性更好\n Distroless：只包含应用，最安全', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-6', 'article-8', 'image', 'https://picsum.photos/800/450?random=0.6666', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-7', 'article-8', 'heading', 'Dockerfile 编写技巧', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-8', 'article-8', 'text',合理利用镜像缓存，合并 RUN 命令，清理构建缓存，这些技巧能让你的镜像更小，构建更快。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-9', 'article-8', 'quote', '每个容器只做一件事，做好一件事。—— Docker 哲学', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-10', 'article-8', 'heading', '生产环境部署', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-11', 'article-8', 'text', '生产环境运行容器有哪些需要注意的地方？权限控制、日志管理、资源限制、健康检查缺一不可。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-12', 'article-8', 'text', '不要以 root 用户运行\n设置内存和 CPU 限制\n配置健康检查\n日志输出到 stdout\n及时更新基础镜像', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-13', 'article-8', 'heading', '总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-8-14', 'article-8', 'text', 'Docker 容器化 已经成为现代应用部署的标准方式。遵循这些最佳实践，能让你的容器更安全、更小、更稳定。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 9: React Hooks 使用误区总结
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-9-1', 'article-9', 'heading', 'React Hooks 使用误区总结', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-2', 'article-9', 'text', 'React Hooks 用了这么久，总结一些容易踩的坑，看看你有没有中招。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-3', 'article-9', 'heading',)Hooks 基本规则', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-4', 'article-9', 'text', 'React 要求 Hooks 必须在组件最顶层调用，不能在条件循环中调用。这不仅仅是规范，更是 React 依赖调用顺序实现的。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-5', 'article-9', 'text', '常见错误写法：\n在 if 条件中调用 useState\n在 map 循环中调用 useCallback\nuseEffect 依赖项写全了吗', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-6', 'article-9', 'image', 'https://picsum.photos/800/450?random=0.7777', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-7', 'article-9', 'heading', '依赖项处理误区', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-8', 'article-9', 'text',useEffect、useCallback、useMemo 的依赖项应该怎么写？很多人在这里踩坑。漏掉依赖会导致使用旧值，加了不必要的依赖又会导致频繁执行。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-9', 'article-9', 'quote', '依赖只放真正用到的，一个都不能少。—— React Hooks 规则', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-10', 'article-9', 'heading', 'useState 状态设计', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-11', 'article-9', 'text', '要不要把相关状态合并成一个对象？这要看状态会不会一起变化。如果总是一起变就合并，否则就分开。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-12', 'article-9', 'text', '不要把不需要存在 state 里的数据放进去\n异步获取数据时注意竞态问题\n清理 useEffect 中的副作用\n事件订阅记得取消', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-13', 'article-9', 'heading', '总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-9-14', 'article-9', 'text', 'React Hooks 确实给我们带来了更简洁的逻辑复用方式，但也要注意这些常见的误区。避开这些坑，你的代码会更健壮。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 10: 设计系统：从规范到落地
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-10-1', 'article-10', 'heading', '设计系统：从规范到落地', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-2', 'article-10', 'text', '设计系统不仅仅是样式规范，更是一套协作方法。本文分享我们团队如何从 0 到 1 搭建设计系统。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-3', 'article-10', 'heading', '什么是设计系统', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-4', 'article-10', 'text', '设计系统不是组件库，也不是风格指南，它是二者结合加上一套工作流程。帮助设计师和开发者更好协作，保持设计和代码的一致性。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-5', 'article-10', 'text', '设计系统包含：\n设计令牌（颜色、字体、间距）\n基础组件库\n交互规范文档\n组件使用指南', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-6', 'article-10', 'image', 'https://picsum.photos/800/450?random=0.8888', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-7', 'article-10', 'heading', '设计令牌化', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-8', 'article-10', 'text', '将设计决策抽取为可复用的设计令牌，统一管理全局设计语言。设计师在 Figma 中定义，开发者代码中直接使用，保持两端一致。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-9', 'article-10', 'quote', '一致性是设计最美的品质。—— 设计格言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-10', 'article-10', 'heading','落地过程', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-11', 'article-10', 'text', '从规范定义到组件开发，再到文档建设，最后推广落地，这是一个持续演进的过程，不是一蹴而就的。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-12', 'article-10', 'text', '第一步：梳理现有设计，提取共性\n第二步：定义设计令牌和基础规范\n第三步：开发核心组件库\n第四步：编写文档和示例\n第五步：持续迭代优化', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-13', 'article-10', 'heading', '收益与挑战', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-10-14', 'article-10', 'text', '设计系统 确实能提升协作效率，保证设计一致性，但也需要持续投入维护。找到适合自己团队的节奏，逐步演进才是可持续的。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 11: MobX 状态管理最佳实践
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-11-1', 'article-11', 'heading', 'MobX 状态管理最佳实践', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-2', 'article-11', 'text', 'MobX 是一个非常棒的状态管理库，它让我们可以用更简洁的代码管理可响应的状态。本文分享一些使用 MobX 的最佳实践。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-3', 'article-11', 'heading', '为什么选择 MobX', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-4', 'article-11', 'text', 'MobX 依靠透明的响应式编程，让我们只需要修改状态，视图会自动更新。相比 Redux，代码量少很多，学习成本也更低。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-5', 'article-11', 'text', 'MobX 核心思想：\n让状态可观测\n自动追踪依赖\n哪里需要哪里订阅\n最小粒度更新', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-6', 'article-11', 'image', 'https://picsum.photos/800/450?random=0.9999', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-7', 'article-11', 'heading', '项目结构组织', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-8', 'article-11', 'text',在项目中如何组织 MobX 状态？全局状态放哪里？页面局部状态怎么放？这篇文章给你答案。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-9', 'article-11', 'quote', '可观测一切会变化的事物。—— MobX 设计理念', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-10', 'article-11', 'heading', '常见误区', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-11', 'article-11', 'text', '哪些做法是不好的实践？我们应该如何避免？', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-12', 'article-11', 'text', '不要把所有状态都放全局 Store\n记得使用 makeAutoObservable\n正确使用 action 标记修改方法\n不要在 compute 里面做副作用', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-13', 'article-11', 'heading', '总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-11-14', 'article-11', 'text', 'MobX 状态管理 确实能让我们用更少的代码写出更清晰的状态管理逻辑。遵循这些最佳实践，你的 MobX 代码会更易于维护。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 12: GraphQL vs REST 选型分析
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-12-1', 'article-12', 'heading', 'GraphQL vs REST 选型分析', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-2', 'article-12', 'text', '现在前端项目 API 选型，GraphQL 和 REST 应该怎么选？本文对比分析了两种方案的优缺点，帮助你做出合适的选择。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-3', 'article-12', 'heading', 'REST 回顾', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-4', 'article-12', 'text', 'REST 是目前最常用的 API 设计风格，基于资源概念，使用不同 HTTP 方法操作资源，简单直接，易于理解。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-5', 'article-12', 'text', 'REST 优点：\n简单成熟，工具链完善\n缓存友好\n易于调试\n学习成本低', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-6', 'article-12', 'image', 'https://picsum.photos/800/450?random=1.1111', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-7', 'article-12', 'heading', 'GraphQL 优势', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-8', 'article-12', 'text', 'GraphQL 允许前端按需获取数据，避免了 Over-fetching 和 Under-fetching 问题，一个请求就能拿到所有需要的数据。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-9', 'article-12', 'quote', '让前端说清楚它需要什么。—— GraphQL 设计思想', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-10', 'article-12', 'heading', 'GraphQL 带来的新问题', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-11', 'article-12', 'text', 'GraphQL 不是银弹，它也带来了一些新问题需要解决。N+1 查询问题、缓存复杂度、服务端性能都需要额外处理。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-12', 'article-12', 'text', '什么时候选 GraphQL：\n前端产品需求变化快\n移动客户端场景\n需要灵活查询\n前端团队自组织能力强', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-13', 'article-12', 'heading', '总结建议', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-12-14', 'article-12', 'text',GraphQL vs REST 并没有绝对的好坏，根据你的项目规模、团队情况选择合适的方案就好。简单的项目用 REST 反而更轻量。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 13: 持续集成与自动化部署
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-13-1', 'article-13', 'heading', '持续集成与自动化部署', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-2', 'article-13', 'text', '为什么需要 CI/CD？搭建一套完整的持续集成与自动化部署流水线，能给团队带来哪些提升？一起来看看。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-3', 'article-13', 'heading', '什么是 CI/CD', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-4', 'article-13', 'text', '持续集成就是频繁地将代码集成到主干，自动构建和测试。持续部署就是自动将通过测试的代码部署到生产环境。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-5', 'article-13', 'text', 'CI/CD 能带来：\n更早发现错误\n减少发布压力\n自动化重复工作\n更快交付价值', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-6', 'article-13', 'image', 'https://picsum.photos/800/450?random=2.2222', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-7', 'article-13', 'heading', '流水线设计', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-8', 'article-13', 'text',一个典型的 CI 流水线包含哪些步骤？代码检出、依赖安装、代码检查、测试、构建、镜像、部署，每一步都可以自动化。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-9', 'article-13', 'quote', '频繁集成，频繁发布。—— 持续集成箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-10', 'article-13', 'heading', '实践经验', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-11', 'article-13', 'text',分享我们团队在搭建 CI/CD 过程中的一些实践经验，遇到的问题以及解决方案。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-12', 'article-13', 'text','管道失败及时通知\n保留构建日志方便排查\n分环境部署流程\n回滚方案准备好', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-13', 'article-13', 'heading', '总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-13-14', 'article-13', 'text',持续集成与自动化部署 是现代软件开发的基础能力。越早搭建，越早收益。投资自动化，解放生产力去做更有价值的事情。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 14: 程序员如何保持学习效率
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-14-1', 'article-14', 'heading', '程序员如何保持学习效率', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-2', 'article-14', 'text',IT 行业技术更新太快，每天都有新东西出来。如何保持高效学习，不被淘汰？分享一些个人学习方法和心得。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-3', 'article-14', 'heading', '建立知识体系', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-4', 'article-14', 'text',不要碎片化学习，建立自己系统化的知识体系比记住零散知识点重要得多。基础扎实了，学新技术很快。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-5', 'article-14', 'text','学习建议：\n计算机基础永远不过时\n深入理解一门语言再学其他\n重点学思想不是记 API\n多实践比光看书重要', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-6', 'article-14', 'image', 'https://picsum.photos/800/450?random=3.3333', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-7', 'article-14', 'heading', '保持学习节奏', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-8', 'article-14', 'text',与其突击学习几天，不如每天坚持学一点。保持持续的学习节奏，长期积累下来进步会很大。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-9', 'article-14', 'quote', '慢慢来，比较快。—— 学习箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-10', 'article-14', 'heading', '学会筛选信息', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-11', 'article-14', 'text',现在技术资讯太多了，不是所有新技术都值得你花时间去学。学会判断，关注真正有价值的技术学习。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-12', 'article-14', 'text',\n分清「生命周期」：\n新兴技术：值得关注\n成熟技术：深入掌握\n过气技术：不用浪费时间\n学会拒绝浮躁', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-13', 'article-14', 'heading', '输出倒逼输入', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-14-14', 'article-14', 'text',写文章、做分享、写开源项目都是很好的输出方式。输出过程中你会发现很多理解不到位的地方，反过来促进更深入的学习。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 15: 我的技术栈进化之路
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-15-1', 'article-15', 'heading', '我的技术栈进化之路', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-2', 'article-15', 'text',从 jQuery 到 React，从后端到全栈，这些年来我的技术栈经历了哪些变化？有哪些经验和感悟可以分享？', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-3', 'article-15', 'heading', '起步阶段', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-4', 'article-15', 'text',最开始写网页就是 jQuery + Bootstrap，那个时候能搞定页面交互就很开心了。那时候最头疼的就是 DOM 操作和浏览器兼容性问题。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-5', 'article-15', 'text',那个时期学到最重要的东西：\nHTML/CSS 基础永远重要\n浏览器兼容性坑\nJavaScript 原生基础', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-6', 'article-15', 'image', 'https://picsum.photos/800/450?random=4.4444', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-7', 'article-15', 'heading', '框架时代', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-8', 'article-15', 'text，MV* 框架兴起，Backbone、Angular、React、Vue 轮番登场。这个阶段最大的收获就是思维转变，从命令式到声明式。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-9', 'article-15', 'quote', '技术会过时，思维不会。—— 技术进化感悟', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-10', 'article-15', 'heading', '全栈开发', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-11', 'article-15', 'text，从前后端分离到全栈开发，Node.js 让前端工程师也能写后端服务了。这个阶段对软件开发有了更完整的理解。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-12', 'article-15', 'text',现在更偏向全栈开发的原因：\n对产品整体负责\n更好的沟通协作\n解决问题更直接\n个人能力成长更快', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-13', 'article-15', 'heading', '感悟', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-15-14', 'article-15', 'text，技术栈一直在变，不变的是持续学习的心态。打好基础，保持好奇，享受编程的乐趣。这就是我的技术栈进化之路。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 16: 前端工程化：从手动到自动化
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-16-1', 'article-16', 'heading', '前端工程化：从手动到自动化', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-2', 'article-16', 'text',前端工程化到底是什么？从最开始手动复制文件到现在完整的工具链，我们都经历了哪些阶段？本文带你梳理前端工程化演进历程。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-3', 'article-16', 'heading', '石器时代', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-4', 'article-16', 'text，最开始写前端就是把所有 JS/CSS 都手动拼在一起，刷新浏览器看效果。那个时候工程化就是靠开发者自律。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-5', 'article-16', 'text，那个年代的痛点：\n手动压缩合并代码\n重复操作容易出错\n没有统一的代码规范\n依赖管理全靠复制', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-6', 'article-16', 'image', 'https://picsum.photos/800/450?random=5.5555', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-7', 'article-16', 'heading', '模块化与工具化', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-8', 'article-16', 'text，Browserify 开启了前端模块化时代，Webpack 把模块化推向了极致。现在 Vite 又带来了更快的开发体验。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-9', 'article-16', 'quote', '工具改变工作方式，效率提升生产力。—— 工程化格言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-10', 'article-16', 'heading', '工程化包含什么', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-11', 'article-16', 'text，前端工程化不仅仅是打包工具，它涵盖了开发流程的方方面面。从代码规范到测试部署，每个环节都可以自动化。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-12', 'article-16', 'text，前端工程化核心要素：\n模块化开发\n代码规范检查\n自动化测试\n持续集成部署\n开发环境标准化', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-13', 'article-16', 'heading', '总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-16-14', 'article-16', 'text，前端工程化 的目标就是提升开发效率，让开发者把更多时间用在业务开发上。从手动到自动化，这是行业发展的必然趋势。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 17: 移动端 H5 开发踩坑指南
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-17-1', 'article-17', 'heading', '移动端 H5 开发踩坑指南', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-2', 'article-17', 'text，做了几个移动端 H5 项目，踩了不少坑。整理一下这些常见坑点和解决方案，帮助你少踩坑。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-3', 'article-17', 'heading', '适配相关', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-4', 'article-17', 'text，移动端设备碎片化严重，适配是第一个大坑。不同屏幕尺寸、不同DPI、不同系统都有坑。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-5', 'article-17', 'text，适配常见问题：\nretina 屏 1px 边框问题\niOS 安全区域适配\n软键盘弹出挡住输入框\nviewport 正确设置', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-6', 'article-17', 'image', 'https://picsum.photos/800/450?random=6.6666', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-7', 'article-17', 'heading', '交互与体验', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-8', 'article-17', 'text，移动端交互和 PC 端有很多不同。点击穿透、滚动卡顿、300ms 延迟、双击缩放这些问题都需要处理。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-9', 'article-17', 'quote',细节决定体验，体验决定成败。—— 移动端开发箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-10', 'article-17', 'heading','性能优化', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-11', 'article-17', 'text移动端H5 性能比 PC 端更重要。手机网络不一定好，CPU 算力也不如电脑，性能优化更重要。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-12', 'article-17', 'text，性能优化要点：\n图片懒加载和压缩\n避免过度重绘\n合理使用缓存\n减少 HTTP 请求', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-13', 'article-17', 'heading',兼容性问题', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-17-14', 'article-17', 'text，iOS 和 Android 微信、支付宝等不同 WebView 都有不同的坑。本文整理了一些常见兼容性问题的解决方案。希望这份踩坑指南能帮助你在开发移动端 H5 时少走弯路。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 18: PWA 渐进式 Web 应用实践
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-18-1', 'article-18', 'heading', 'PWA 渐进式 Web 应用实践', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-2', 'article-18', 'text，PWA 到底是什么？渐进式增强理念能给 Web 应用带来哪些原生应用般的体验？分享一下实际项目实践经验。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-3', 'article-18', 'heading', '什么是 PWA', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-4', 'article-18', 'text，PWA 不是一项技术，而是一套技术组合。使用 Service Worker 和 Cache API 实现离线缓存，Web App Manifest 实现添加到主屏幕。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-5', 'article-18', 'text，PWA 核心特性：\n离线缓存能力\n添加到主屏幕\n推送通知\n后台同步', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-6', 'article-18', 'image', 'https://picsum.photos/800/450?random=7.7777', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-7', 'article-18', 'heading',Service Worker 生命周期', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-8', 'article-18', 'text，理解 Service Worker 的生命周期是开发 PWA 的关键。注册、安装、激活、更新，每个阶段都需要正确处理。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-9', 'article-18', 'quote，渐进式增强，逐步降级。—— PWA 设计理念', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-10', 'article-18', 'heading',缓存策略', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-11', 'article-18', 'text，不同类型的资源应该使用不同的缓存策略。静态资源用缓存优先，动态数据用网络优先，合理搭配才能有好的体验。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-12', 'article-18', 'text，常见缓存策略：\nCache First：静态资源\nNetwork First：频繁更新数据\nStale While Revalidate：不紧急数据', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-13', 'article-18', 'heading',总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-18-14', 'article-18', 'text，PWA 渐进式 Web 应用 确实能带来更好的用户体验，尤其是在网络不稳定的移动端。渐进式增强理念值得学习，根据你的场景选择使用就好。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 19: Webpack 5 打包优化攻略
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-19-1', 'article-19', 'heading', 'Webpack 5 打包优化攻略', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-2', 'article-19', 'text，项目做大了打包越来越慢，包体积越来越大怎么办？Webpack 5 有哪些优化手段？一起来看看。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-3', 'article-19', 'heading',为什么要优化', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-4', 'article-19', 'text，打包速度影响开发效率，包体积影响用户加载速度。两者都需要优化。好的构建配置能节省很多时间。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-5', 'article-19', 'text，优化两个维度：\n打包速度：提升开发体验\n包体积：用户加载更快', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-6', 'article-19', 'image', 'https://picsum.photos/800/450?random=8.8888', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-7', 'article-19', 'heading',提速优化', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-8', 'article-19', 'text，Webpack 5 内置了很多优化，配合一些配置技巧能大幅提升打包速度。比如多进程打包、缓存、externals 等。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-9', 'article-19', 'quote，时间就是金钱，效率就是生命。—— 优化箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-10', 'article-19', 'heading',体积优化', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-11', 'article-19', 'text，tree shaking、代码分割、压缩、图片优化，这些手段都能减小包体积。每一点优化加起来效果很明显。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-12', 'article-19', 'text，实用优化技巧：\nTree Shaking 移除无用代码\n代码分割按需加载\n图片压缩优化\n使用 CDN 加速\n持久化缓存', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-13', 'article-19', 'heading，Webpack 5 新特性', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-19-14', 'article-19', 'text，Webpack 5 带来了很多新特性，更好的 tree shaking、更好的缓存、Module Federation 等。用好这些特性能让你的打包更高效。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 20: Vite 原理与插件开发
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-20-1', 'article-20', 'heading', 'Vite 原理与插件开发', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-2', 'article-20', 'text，Vite 为什么开发这么快？它的设计思路和 Webpack 有什么不同？本文带你深入理解 Vite 原理。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-3', 'article-20', 'heading，开发阶段为什么快', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-4', 'article-20', 'text，Vite 开发阶段不需要打包整个项目，它利用浏览器原生 ES 模块支持，按需动态编译。节省了打包时间，所以启动特别快。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-5', 'article-20', 'text，Vite 两大组成：\n开发服务器：原生 ESM\n生产构建：基于 Rollup', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-6', 'article-20', 'image', 'https://picsum.photos/800/450?random=9.9999', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-7', 'article-20', 'heading，依赖预构建', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-8', 'article-20', 'text，为什么需要预构建依赖？因为很多第三方包不是 ESM 格式，Vite 会把它们预构建成 ESM 格式，同时也能缓存。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-9', 'article-20', 'quote，用原生能力，做现代化工具。—— Vite 设计理念', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-10', 'article-20', 'heading，如何开发插件', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-11', 'article-20', 'text，Vite 插件接口设计兼容 Rollup 插件，同时增加了一些 Vite 特有的钩子。理解插件生命周期，就能写出自己的插件。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-12', 'article-20', 'text，插件开发关键钩子：\noptions：配置解析前\nconfig：修改配置\nresolveId：解析模块\nload：加载模块\ntransform：转换代码', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-13', 'article-20', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-20-14', 'article-20', 'text，Vite 凭借其优秀的设计带来了极致的开发体验。理解它的设计原理，能帮助我们更好地使用它，甚至定制自己的插件。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 21: Git 工作流规范指南
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-21-1', 'article-21', 'heading', 'Git 工作流规范指南', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-2', 'article-21', 'text，多人协作开发，Git 工作流不规范会带来很多问题。什么样的 Git 工作流适合你的团队？本文梳理几种常见工作流。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-3', 'article-21', 'heading，核心分支管理', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-4', 'article-21', 'text，不管什么工作流，核心分支都需要保护。main 主分支永远保持可发布状态，develop 分支整合功能开发。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-5', 'article-21', 'text，分支命名建议：\nfeature/*：新功能开发\nhotfix/*：紧急修复bug\nrelease/*：发布预备', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-6', 'article-21', 'image', 'https://picsum.photos/800/450?random=10.1010', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-7', 'article-21', 'heading，常见工作流对比', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-8', 'article-21', 'text，Git Flow、GitHub Flow、Trunk Based Development，这几种常见工作流各有优缺点，适合不同场景。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-9', 'article-21', 'quote，适合团队的，就是最好的。—— 协作箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-10', 'article-21', 'heading，Code Review 实践', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-11', 'article-21', 'text，代码合并前必须做 Code Review，这是保证代码质量的重要关卡。怎么高效做 Code Review？', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-12', 'article-21', 'text，提交信息规范：\n清晰描述修改内容\n使用约定式提交格式\n一次提交一个主题\n避免超大批量提交', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-13', 'article-21', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-21-14', 'article-21', 'text，清晰的 Git 工作流规范 能让团队协作更顺畅，减少很多不必要的冲突和问题。找到适合你团队的规范并坚持执行。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 22: 单元测试：为什么要写，怎么写
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-22-1', 'article-22', 'heading', '单元测试：为什么要写，怎么写', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-2', 'article-22', 'text，很多开发者都觉得写单元测试浪费时间，真的是这样吗？单元测试能带来什么价值？怎么写好单元测试？', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-3', 'article-22', 'heading，为什么要写单元测试', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-4', 'article-22', 'text，单元测试最直接的好处就是提早发现 bug，重构更有信心，文档自动生成，减少手动调试时间。长期来看是节省时间的。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-5', 'article-22', 'text，单元测试带来的好处：\n保证代码正确性\n重构安心无忧\n活文档\n方便调试', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-6', 'article-22', 'image', 'https://picsum.photos/800/450?random=11.1111', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-7', 'article-22', 'heading，怎么写好单元测试', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-8', 'article-22', 'text，测试一个函数，测输入输出就好。好的单元测试应该是独立的，可重复的，快速的。测试行为不测试实现。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-9', 'article-22', 'quote，测试行为，不测试实现。—— 单元测试箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-10', 'article-22', 'heading，实践示例', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-11', 'article-22', 'text，通过一个简单的示例，看看一个好的单元测试长什么样。从工具选择到测试用例设计一步步来看。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-12', 'article-22', 'text，测试三部曲：\nArrange：准备测试数据\nAct：执行被测代码\nAssert：断言结果符合预期', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-13', 'article-22', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-22-14', 'article-22', 'text，单元测试 是一个值得培养的好习惯。一开始可能会觉得慢，养成习惯后你会离不开它。开始给你的核心逻辑写测试吧。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 23: 函数式编程思想在前端的应用
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-23-1', 'article-23', 'heading', '函数式编程思想在前端的应用', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-2', 'article-23', 'text，函数式编程是不是很抽象？它能给我们前端开发带来什么好处？一起来看看函数式编程思想如何在实际项目中应用。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-3', 'article-23', 'heading，核心思想', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-4', 'article-23', 'text，函数式编程核心思想就是将计算抽象为函数，避免可变状态和副作用。让代码更简洁，更易理解，更易测试。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-5', 'article-23', 'text，函数式编程基础概念：\n纯函数\n不可变数据\n函数组合\n柯里化', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-6', 'article-23', 'image', 'https://picsum.photos/800/450?random=12.1212', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-7', 'article-23', 'heading，在前端中的应用', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-8', 'article-23', 'text，React 组件其实就是纯函数，Redux 状态管理也深受函数式编程影响。JS 原生也支持很多函数式方法。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-9', 'article-23', 'quote，纯函数，无副作用。—— 函数式编程信条', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-10', 'article-23', 'heading，好处是什么', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-11', 'article-23', 'text，使用函数式编程思想写出的代码，更容易理解和测试，并行处理也更方便，因为没有共享可变状态竞态问题。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-12', 'article-23', 'text，实际开发建议：\n不用刻意追求纯函数式\n吸收思想精华用到实际中\n理解比形式重要\n从小处开始实践', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-13', 'article-23', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-23-14', 'article-23', 'text，函数式编程思想 确实能给前端开发带来很多启发。不用全盘接受，吸收好的思想用到自己的代码中就好。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 24: 响应式设计：从弹性到自适应
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-24-1', 'article-24', 'heading', '响应式设计：从弹性到自适应', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-2', 'article-24', 'text，响应式设计已经说了很多年了，从弹性布局到现在的自适应设计，我们都经历了哪些阶段？现在最佳实践是什么？', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-3', 'article-24', 'heading，什么是响应式设计', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-4', 'article-24', 'text，响应式设计就是一个网站能适配不同尺寸的设备，在从手机到桌面各种设备上都能提供良好的体验。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-5', 'article-24', 'text，发展历程：\n固定布局 → 弹性布局 → 响应式 → 自适应', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-6', 'article-24', 'image', 'https://picsum.photos/800/450?random=13.1313', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-7', 'article-24', 'heading，媒体查询断点设计', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-8', 'article-24', 'text，断点应该怎么选？按内容断点还是按设备断点？一般来说，常用断点就那几个，根据内容变化调整就好。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-9', 'article-24', 'quote，内容优先，流动布局。—— 响应式设计格言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-10', 'article-24', 'heading，图片响应式', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-11', 'article-24', 'text，响应式设计中图片怎么处理？srcset、sizes、picture 这些用法都了解吗？不同密度屏幕怎么适配？', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-12', 'article-24', 'text，响应式实践要点：\n流动网格布局\n弹性图片\n媒体查询断点\n移动优先设计', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-13', 'article-24', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-24-14', 'article-24', 'text，响应式设计 现在已经是基本要求了。从弹性到自适应，理念在进化，方法也在不断改进。掌握这些核心原则，就能做出好的响应式设计。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 25: 无障碍开发实践总结
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-25-1', 'article-25', 'heading', '无障碍开发实践总结', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-2', 'article-25', 'text，无障碍开发是什么？为什么需要它？我们在实际项目中应该怎么做？本文分享一些无障碍开发实践经验。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-3', 'article-25', 'heading，为什么要关注无障碍', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-4', 'article-25', 'text，据统计，世界上有相当比例的人存在一定的障碍，无障碍开发能让这部分人也能正常使用你的产品。同时无障碍也有助于 SEO。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-5', 'article-25', 'text，无障碍受益人群：\n视力障碍用户（读屏软件）\n运动障碍用户\n认知障碍用户\n其实也帮助普通用户', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-6', 'article-25', 'image', 'https://picsum.photos/800/450?random=14.1414', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-7', 'article-25', 'heading，HTML 语义化', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-8', 'article-25', 'text，正确使用 HTML 语义化标签是无障碍开发的基础。nav、main、article、section、button 这些语义正确了，读屏软件才能正确识别。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-9', 'article-25', 'quote，每个人都应该能访问 Web。—— 无障碍理念', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-10', 'article-25', 'heading，ARIA 合理使用', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-11', 'article-25', 'text，原生 HTML 满足不了的时候，可以用 ARIA 属性来补充。但记住：优先使用原生语义，ARIA 只是补充。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-12', 'article-25', 'text，实践检查清单：\n所有图片都有 alt 属性\n交互元素可键盘聚焦\n正确的标签语义\nARIA label 使用正确\n颜色对比度足够', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-13', 'article-25', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-25-14', 'article-25', 'text，无障碍开发 不是很难，就是一些细节需要注意。养成习惯，你的产品就能服务更多用户，这是一件很有价值的事情。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 26: 安全：前端常见安全问题防范
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-26-1', 'article-26', 'heading', '安全：前端常见安全问题防范', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-2', 'article-26', 'text，前端开发中都有哪些常见的安全问题？XSS、CSRF、点击劫持... 这些攻击手段原理是什么？如何防范？', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-3', 'article-26', 'heading，XSS 跨站脚本', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-4', 'article-26', 'text，XSS 就是攻击者注入恶意脚本到你的页面中，窃取用户信息。存储型、反射型、DOM 型，不同类型需要不同防范。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-5', 'article-26', 'text，XSS 防范措施：\n对用户输入进行转义\n使用 CSP 内容安全策略\nCookie 设置 HttpOnly', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-6', 'article-26', 'image', 'https://picsum.photos/800/450?random=15.1515', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-7', 'article-26', 'heading，CSRF 跨站请求伪造', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-8', 'article-26', 'text，CSRF 攻击利用用户登录状态，诱导用户在恶意网站发起请求。防范 CSRF 有哪些成熟方案？', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-9', 'article-26', 'quote，输入即出口，验证不可少。—— 安全开发箴言', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-10', 'article-26', 'heading，其他常见问题', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-11', 'article-26', 'text，点击劫持、iframe 钓鱼、MIME 类型 sniffing、路径遍历... 这些前端安全问题你都了解吗？', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-12', 'article-26', 'text，基本安全原则：\n不信任任何用户输入\n对输出进行转义\n使用现代框架自动防护\n及时更新依赖版本', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-13', 'article-26', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-26-14', 'article-26', 'text，前端安全 问题不可大意，很多攻击手段其实都是利用了基础知识的漏洞。了解这些攻击原理，才能更好地防范。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 27: SSR 服务端渲染原理与实践
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-27-1', 'article-27', 'heading', 'SSR 服务端渲染原理与实践', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-2', 'article-27', 'text，SPA 首屏加载慢，SEO 不好怎么办？SSR 服务端渲染能解决这些问题。一起来看看 SSR 原理和实践经验。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-3', 'article-27', 'heading，什么是 SSR', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-4', 'article-27', 'text，传统 SPA 是浏览器下载空 HTML，然后加载 JS 渲染内容。SSR 是服务端直接把 HTML 渲染好发给浏览器，首屏更快。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-5', 'article-27', 'text，SSR 优势：\n更快的首屏加载\n更好的 SEO\n更友好的弱网环境', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-6', 'article-27', 'image', 'https://picsum.photos/800/450?random=16.1616', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-7', 'article-27', 'heading，工作流程', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-8', 'article-27', 'text，用户请求 → 服务端获取数据 → 渲染 React 组件 → 输出 HTML → 浏览器水化激活交互。这就是 SSR 的完整流程。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-9', 'article-27', 'quote，一次请求，完整输出。—— SSR 核心思想', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-10', 'article-27', 'heading，常见坑点', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-11', 'article-27', 'text，SSR 不是银弹，它也带来了一些新问题。开发复杂度更高，服务端压力更大，这些都需要权衡。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-12', 'article-27', 'text，开发中常见坑：\nwindow/document 不存在\n生命周期差异\n数据获取方式不同\n样式 hydration 不匹配', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-13', 'article-27', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-27-14', 'article-27', 'text，SSR 服务端渲染 确实能解决首屏性能和 SEO 问题，但也增加了开发复杂度。根据你的项目需求决定是否需要 SSR。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 28: 静态站点生成 Next.js 对比
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-28-1', 'article-28', 'heading', '静态站点生成 Next.js 对比', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-2', 'article-28', 'text，现在静态站点生成又火起来了，Next.js 提供了多种渲染方式。SSG、ISR、SSR 各有什么优缺点？怎么选择？', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-3', 'article-28', 'heading，什么是 SSG', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-4', 'article-28', 'text，静态站点生成就是在构建的时候就生成所有 HTML 文件，部署到 CDN 就能直接访问。速度最快，最简单。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-5', 'article-28', 'text，SSG 适合场景：\n博客文档这类内容网站\n内容不频繁更新\n对速度要求高', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-6', 'article-28', 'image', 'https://picsum.photos/800/450?random=17.1717', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-7', 'article-28', 'heading，增量静态再生成 ISR', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-8', 'article-28', 'text，ISR 是 Next.js 提出的概念，可以在不重新构建全站的情况下增量更新部分页面。兼顾了静态速度和动态更新。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-9', 'article-28', 'quote，静态极速，增量更新。—— Next.js ISR 理念', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-10', 'article-28', 'heading，多种渲染方式对比', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-11', 'article-28', 'text，SSG、ISR、SSR、SSG + 客户端注水，Next.js 支持多种方式，不同页面可以用不同方式。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-12', 'article-28', 'text，选择策略：\n能静态生成就静态生成\n需要实时数据用 SSR\n部分更新用 ISR\n混合使用是最佳策略', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-13', 'article-28', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-28-14', 'article-28', 'text，Next.js 提供了灵活的渲染方式选择，静态站点生成 在博客、文档这类内容网站上确实体验很好。根据页面特性选择合适的渲染方式就好。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 29: CI/CD 流水线设计心得
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-29-1', 'article-29', 'heading', 'CI/CD 流水线设计心得', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-2', 'article-29', 'text，搭建一套好的 CI/CD 流水线不是一件容易的事情。分享我们团队在设计流水线过程中的一些心得和经验。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-3', 'article-29', 'heading，流水线核心目标', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-4', 'article-29', 'text，CI/CD 流水线的核心目标就是让代码从开发者机器快速可靠地到生产环境。快速反馈，自动化，可靠。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-5', 'article-29', 'text，好流水线应该：\n快速反馈问题\n自动完成重复工作\n减少人为出错\n可追溯可回滚', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-6', 'article-29', 'image', 'https://picsum.photos/800/450?random=18.1818', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-7', 'article-29', 'heading，分阶段设计', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-8', 'article-29', 'text，流水线应该分阶段，前面阶段快速发现简单问题，后面阶段做更重的检查。这样开发者能快速得到反馈。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-9', 'article-29', 'quote，快速失败，尽早反馈。—— CI/CD 设计原则', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-10', 'article-29', 'heading，缓存优化', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-11', 'article-29', 'text，合理利用缓存能大幅提升流水线速度。依赖缓存、构建缓存，不变的东西就不用反复计算。', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-12', 'article-29', 'text，流水线优化要点：\n代码检查优先跑\n依赖缓存合理使用\n并行执行不相关任务\n分环境递进部署', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-13', 'article-29', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-29-14', 'article-29', 'text，设计好一套 CI/CD 流水线能给团队节省很多时间，减少很多发布问题。持续优化你的流水线，它会越来越好用。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- 文章 30: 开发者工具调试技巧分享
INSERT INTO `article_content_blocks` (`id`, `article_id`, `block_type`, `content`, `sort_order`, `created_at`, `updated_at`) VALUES
  ('block-30-1', 'article-30', 'heading', '开发者工具调试技巧分享', 1, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-2', 'article-30', 'text，Chrome DevTools 你真的用明白了吗？分享一些不那么为人熟知但非常实用的调试技巧，提升你的调试效率。', 2, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-3', 'article-30', 'heading，Sources 面板进阶', 3, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-4', 'article-30', 'text，断点调试大家都知道，但你知道条件断点、XHR 断点、DOM 断点吗？这些高级断点能帮你快速定位疑难杂症。', 4, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-5', 'article-30', 'text，实用 Sources 技巧：\noverrides 覆盖线上文件本地修改\nworkspace 映射本地源码\nSnippet 跑自定义脚本\n黑盒第三方库跳过', 5, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-6', 'article-30', 'image', 'https://picsum.photos/800/450?random=19.1919', 6, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-7', 'article-30', 'heading，Performance 分析', 7, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-8', 'article-30', 'text，性能问题找 Performance 面板，录屏一遍就能看到哪些函数耗时久，布局重排多，帮助你定位性能瓶颈。', 8, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-9', 'article-30', 'quote，工欲善其事，必先利其器。—— 古人云', 9, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-10', 'article-30', 'heading，Console 高级用法', 10, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-11', 'article-30', 'text，console.log 人人都会，但你知道 console.table、console.trace、console.time 这些高级用法吗？', 11, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-12', 'article-30', 'text，你应该知道的技巧：\nconsole.log 支持格式化\nconsole.dir 打印对象完整结构\nconsole.time 计时\ndebugger 语句断点调试', 12, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-13', 'article-30', 'heading，总结', 13, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000),
  ('block-30-14', 'article-30', 'text，熟练掌握开发者工具能让你调试问题事半功倍。花点时间学习这些技巧，调试效率会提升很多。这就是 开发者工具调试技巧分享，希望对你有帮助。', 14, UNIX_TIMESTAMP(NOW()) * 1000, UNIX_TIMESTAMP(NOW()) * 1000);

-- ============================================
-- 统计信息
-- 文章总数: 30 篇
-- 内容块总数: 30 篇 × 14 块 = 420 条记录
-- 完全遵循 generateMockContent() 生成规范
-- 所有外键 article_id 与 articles 表一致
-- ============================================
