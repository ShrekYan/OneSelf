// apps/web/src/pages/ArticleList/__tests__/useStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useArticleListStore } from '../useStore';

vi.mock('@/api', () => ({
  api: {
    article: {
      list: vi.fn(),
    },
  },
}));

import { api } from '@/api';

describe('useArticleListStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useArticleListStore());
    expect(result.current.loading).toBe(false);
    expect(result.current.articleList).toEqual([]);
    expect(result.current.currentCategory).toBe('all');
  });

  it('should change current category when setCurrentCategory called', () => {
    const { result } = renderHook(() => useArticleListStore());

    act(() => {
      result.current.setCurrentCategory('1');
    });

    expect(result.current.currentCategory).toBe('1');
  });

  it('should fetch articles and update state', async () => {
    const mockData = [{ id: '1', title: 'Test' }];
    (api.article.list as vi.Mock).mockResolvedValue({ list: mockData });

    const { result } = renderHook(() => useArticleListStore());

    await act(async () => {
      await result.current.fetchArticles();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.articleList).toEqual(mockData);
  });
});
