/**
 * 文章详情页面常量
 */

export interface ArticleDetail {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  publishAt: string;
  readTime: number;
  content: ArticleContentBlock[];
  stats: {
    likes: number;
    favorites: number;
    isLiked: boolean;
    isFavorited: boolean;
  };
  isFollowing: boolean;
}

export type ArticleContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'quote'; text: string }
  | { type: 'image'; imageUrl: string };

// 默认模拟数据 - 匹配 Pixso 设计稿内容和数据
export const mockArticleDetail: ArticleDetail = {
  id: '1',
  title: 'The Future of Mobile Interface Design in 2024',
  category: 'Design',
  coverUrl:
    'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=750&h=468&fit=crop',
  author: {
    name: 'Sarah Drasner',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  publishAt: 'Oct 24',
  readTime: 5,
  content: [
    {
      type: 'paragraph',
      text: 'Exploring the new paradigms of gesture-based navigation and invisible UI that are reshaping how we interact with our devices.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'The Rise of Invisible Interfaces',
    },
    {
      type: 'paragraph',
      text: "Gone are the days of cluttered navigation bars and explicit buttons. The trend is moving towards subtle, context-aware interfaces that disappear when you don't need them.",
    },
    {
      type: 'heading',
      level: 2,
      text: 'Spatial Computing Influences',
    },
    {
      type: 'quote',
      text: "The best interface is no interface. It's fluid, predictable, and responds to natural human movement.",
    },
    {
      type: 'paragraph',
      text: 'With the advent of AR headsets, 2D mobile screens are beginning to incorporate spatial thinking. Designers are now thinking in three dimensions even for flat surfaces.',
    },
  ],
  stats: {
    likes: 89,
    favorites: 1200,
    isLiked: false,
    isFavorited: false,
  },
  isFollowing: false,
};
