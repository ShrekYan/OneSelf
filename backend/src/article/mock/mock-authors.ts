/**
 * Mock 作者数据 - 单独抽离存放
 */

export interface MockAuthor {
  id: string;
  name: string;
  avatar: string;
}

// Mock 作者列表 - 统一管理作者信息
export const MOCK_AUTHORS: MockAuthor[] = [
  {
    id: 'author-1',
    name: 'Dan Abramov',
    avatar: 'https://picsum.photos/100/100?author=1',
  },
  {
    id: 'author-2',
    name: 'Lee Robinson',
    avatar: 'https://picsum.photos/100/100?author=2',
  },
  {
    id: 'author-3',
    name: 'Sarah Drasner',
    avatar: 'https://picsum.photos/100/100?author=3',
  },
  {
    id: 'author-4',
    name: 'Gary Hustwit',
    avatar: 'https://picsum.photos/100/100?author=4',
  },
  {
    id: 'author-5',
    name: 'Kent C. Dodds',
    avatar: 'https://picsum.photos/100/100?author=5',
  },
];
