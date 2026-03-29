/**
 * Detail1 页面常量定义
 */

/**
 * 文章详情信息 - 对应设计稿内容
 */
export interface ArticleDetail {
  coverImage: string;
  categoryTag: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  sections: ArticleSection[];
  quote: string;
  interaction: {
    likeCount: number;
    commentCount: number;
  };
}

export interface ArticleSection {
  heading?: string;
  content: string;
}

/**
 * 设计稿中的实际数据
 */
export const ARTICLE_DETAIL: ArticleDetail = {
  coverImage: '',
  categoryTag: 'DESIGN',
  title: 'The Future of Mobile Interface Design in 2024',
  author: {
    name: 'Sarah Drasner',
    avatar: '',
  },
  publishDate: 'Oct 24',
  readTime: '5 min read',
  sections: [
    {
      content:
        'Exploring the new paradigms of gesture-based navigation and spacial design systems. As we move further into the decade, the way we interact with mobile devices is fundamentally changing.',
    },
    {
      heading: 'The Rise of Invisible Interfaces',
      content:
        'Gone are the days of cluttered navigation bars and explicit buttons for every single action. The modern mobile interface relies heavily on intuitive gestures that feel highly organic to the user.',
    },
    {
      heading: 'Spatial Computing Influences',
      content:
        'With the advent of AR headsets, 2D mobile screens are beginning to adopt depth, heavy use of z-index layering, and materials like glass and acrylic that respond to the environment behind them.',
    },
  ],
  quote:
    "\"The best interface is no interface. It's fluid, predictive, and stays completely out of the user's way until it's needed.\"",
  interaction: {
    likeCount: 1200,
    commentCount: 89,
  },
};
