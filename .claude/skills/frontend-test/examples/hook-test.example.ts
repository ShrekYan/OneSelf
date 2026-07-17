// hooks/__tests__/useCountDown.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCountDown } from '../useCountDown';

describe('useCountDown', () => {
  it('should initialize with correct seconds', () => {
    const { result } = renderHook(() => useCountDown(10));
    expect(result.current.seconds).toBe(10);
    expect(result.current.isRunning).toBe(false);
  });

  it('should start countdown when calling start', () => {
    const { result } = renderHook(() => useCountDown(3));

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(2);

    vi.useRealTimers();
  });
});
