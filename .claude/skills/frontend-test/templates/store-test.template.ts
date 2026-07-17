import { renderHook, act } from '@testing-library/react';
import { useStoreName } from '../useStore';

vi.mock('@/api', () => ({
  api: {
    moduleName: {
      methodName: vi.fn(),
    },
  },
}));

import { api } from '@/api';

describe('useStoreName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useStoreName());

    expect(result.current.loading).toBe(false);
    expect(result.current.list).toEqual([]);
  });

  it('should call action and update state', async () => {
    const mockData = [{ id: '1', name: 'item' }];
    (api.moduleName.methodName as vi.Mock).mockResolvedValue({ list: mockData });

    const { result } = renderHook(() => useStoreName());

    await act(async () => {
      await result.current.fetchList();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.list).toEqual(mockData);
  });
});
