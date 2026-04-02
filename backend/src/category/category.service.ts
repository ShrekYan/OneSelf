import { Injectable } from '@nestjs/common';
import {
  CategoryListResponseDto,
  CategoryItemDto,
  HotKeywordsResponseDto,
  HotKeywordDto,
} from './dto';

// Mock 分类数据，与前端保持一致
const MOCK_CATEGORIES: CategoryItemDto[] = [
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    articleCount: 142,
    imageUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: 'engineering',
    name: 'Engineering',
    articleCount: 284,
    imageUrl: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    articleCount: 95,
    imageUrl: 'https://picsum.photos/400/300?random=3',
  },
  {
    id: 'life-culture',
    name: 'Life & Culture',
    articleCount: 213,
    imageUrl: 'https://picsum.photos/400/300?random=4',
  },
  {
    id: 'web3-crypto',
    name: 'Web3 & Crypto',
    articleCount: 87,
    imageUrl: 'https://picsum.photos/400/300?random=5',
  },
  {
    id: 'startups',
    name: 'Startups',
    articleCount: 164,
    imageUrl: 'https://picsum.photos/400/300?random=6',
  },
  {
    id: 'frontend',
    name: 'Frontend',
    articleCount: 326,
    imageUrl: 'https://picsum.photos/400/300?random=7',
  },
  {
    id: 'backend',
    name: 'Backend',
    articleCount: 198,
    imageUrl: 'https://picsum.photos/400/300?random=8',
  },
  {
    id: 'mobile',
    name: 'Mobile Dev',
    articleCount: 127,
    imageUrl: 'https://picsum.photos/400/300?random=9',
  },
  {
    id: 'devops',
    name: 'DevOps',
    articleCount: 89,
    imageUrl: 'https://picsum.photos/400/300?random=10',
  },
];

@Injectable()
export class CategoryService {
  getList(): Promise<CategoryListResponseDto> {
    return Promise.resolve({
      list: MOCK_CATEGORIES,
      total: MOCK_CATEGORIES.length,
    });
  }

  getHotKeywords(): Promise<HotKeywordsResponseDto> {
    const keywords: HotKeywordDto[] = MOCK_CATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
    }));
    return Promise.resolve({ keywords });
  }
}
