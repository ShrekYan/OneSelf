import { renderHook, act } from '@testing-library/react';
import { useHookName } from '../path-to-hook';

describe('useHookName', () => {
  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useHookName());

    expect(result.current.state).toBe('initial');
  });

  it('should update state when calling action', () => {
    const { result } = renderHook(() => useHookName());

    act(() => {
      result.current.action();
    });

    expect(result.current.state).toBe('updated');
  });
});
