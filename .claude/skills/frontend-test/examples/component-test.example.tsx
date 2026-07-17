// components/CountDown/__tests__/index.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CountDown from '../index';

describe('CountDown', () => {
  it('should render initial seconds', () => {
    render(<CountDown initialSeconds={10} />);
    expect(screen.getByText('10s')).toBeInTheDocument();
  });

  it('should call onComplete when countdown finishes', () => {
    const onComplete = vi.fn();
    vi.useFakeTimers();

    render(<CountDown initialSeconds={1} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /开始/ }));

    vi.advanceTimersByTime(1000);
    expect(onComplete).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
