import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CountDown } from '../index';
import type { CountDownProps, TimeData } from '../index';

describe('CountDown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render initial countdown correctly', () => {
    const after3Seconds = Date.now() + 3000;
    render(<CountDown targetTime={after3Seconds} format="HH:mm:ss" />);

    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('00')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('should call onFinish when countdown completes', () => {
    const onFinish = jest.fn();
    const after2Seconds = Date.now() + 2000;

    render(<CountDown targetTime={after2Seconds} onFinish={onFinish} />);

    expect(onFinish).not.toHaveBeenCalled();

    // 前进 2 秒
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should call onTick every second', () => {
    const onTick = jest.fn();
    const after3Seconds = Date.now() + 3000;

    render(<CountDown targetTime={after3Seconds} onTick={onTick} />);

    expect(onTick).not.toHaveBeenCalled();

    // 第一秒
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onTick).toHaveBeenCalledWith(expect.objectContaining({
      totalSeconds: 2,
    }));

    // 第二秒
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onTick).toHaveBeenCalledTimes(2);
    expect(onTick).toHaveBeenCalledWith(expect.objectContaining({
      totalSeconds: 1,
    }));

    // 第三秒
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onTick).toHaveBeenCalledTimes(3);
    expect(onTick).toHaveBeenCalledWith(expect.objectContaining({
      totalSeconds: 0,
    }));
  });

  it('should not autoStart when autoStart is false', () => {
    const onTick = jest.fn();
    const after3Seconds = Date.now() + 3000;

    render(
      <CountDown
        targetTime={after3Seconds}
        autoStart={false}
        onTick={onTick}
      />
    );

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onTick).not.toHaveBeenCalled();
  });

  describe('format rendering', () => {
    it('should render HH:mm:ss format correctly', () => {
      const future = Date.now() + (2 * 3600 + 30 * 60 + 10) * 1000; // 2小时30分10秒
      render(<CountDown targetTime={future} format="HH:mm:ss" />);

      const textContents = screen.getAllByText(/\d+/).map(el => el.textContent);
      expect(textContents).toContain('02');
      expect(textContents).toContain('30');
      expect(textContents).toContain('10');
    });

    it('should render DD days format correctly', () => {
      const future = Date.now() + (2 * 24 * 3600 + 3 * 3600) * 1000; // 2天3小时
      render(<CountDown targetTime={future} format="DD天 HH时 mm分 ss秒" />);

      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getByText('天')).toBeInTheDocument();
      expect(screen.getByText('时')).toBeInTheDocument();
    });

    it('should render custom separator correctly', () => {
      const future = Date.now() + 3600 + 120 + 5;
      render(<CountDown targetTime={future} format="HH:mm:ss" />);

      expect(screen.getByText(':')).toBeInTheDocument();
    });
  });

  describe('showLeadingZero', () => {
    it('should show leading zero when showLeadingZero is true (default)', () => {
      const future = Date.now() + 5 * 1000; // 5秒
      render(<CountDown targetTime={future} format="HH:mm:ss" />);

      expect(screen.getByText('00')).toBeInTheDocument();
      expect(screen.getByText('00')).toBeInTheDocument();
      expect(screen.getByText('05')).toBeInTheDocument();
    });

    it('should not show leading zero when showLeadingZero is false', () => {
      const future = Date.now() + 5 * 1000; // 5秒
      render(
        <CountDown
          targetTime={future}
          format="HH:mm:ss"
          showLeadingZero={false}
        />
      );

      // 查找所有数字文本，不应该有前导零
      const textContents = screen.getAllByText(/\d+/).map(el => el.textContent);
      expect(textContents).toContain('0');
      expect(textContents).toContain('0');
      expect(textContents).toContain('5');
      // 不应该有 '00' 这样的字符串
      const hasDoubleZero = textContents.some(t => t === '00');
      expect(hasDoubleZero).toBe(false);
    });
  });

  describe('splitBox mode', () => {
    it('should render with splitBox structure', () => {
      const future = Date.now() + 3600 + 120 + 15;
      const { container } = render(
        <CountDown targetTime={future} format="HH:mm:ss" splitBox />
      );

      expect(container.firstChild).toHaveClass('splitBox');
      // splitBox 模式下每个时间块都有 timeBox class
      const timeBoxes = container.querySelectorAll('.timeBox');
      expect(timeBoxes.length).toBe(3);
    });

    it('should render labels in splitBox mode', () => {
      const future = Date.now() + 2 * 24 * 3600 * 1000; // 2天
      const { container } = render(
        <CountDown targetTime={future} format="DD HH:mm:ss" splitBox />
      );

      expect(screen.getByText('天')).toBeInTheDocument();
      expect(screen.getByText('时')).toBeInTheDocument();
      expect(screen.getByText('分')).toBeInTheDocument();
      expect(screen.getByText('秒')).toBeInTheDocument();
    });
  });

  it('should restart when targetTime changes', () => {
    const onFinish = jest.fn();
    const after2Seconds = Date.now() + 2000;

    const { rerender } = render(
      <CountDown targetTime={after2Seconds} onFinish={onFinish} />
    );

    // 前进 1 秒，还没结束
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onFinish).not.toHaveBeenCalled();

    // 修改目标时间为 5 秒后
    const newTargetTime = Date.now() + 5000;
    rerender(<CountDown targetTime={newTargetTime} onFinish={onFinish} />);

    // 前进 3 秒，还没结束（因为重新开始了）
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(onFinish).not.toHaveBeenCalled();

    // 再前进 2 秒，总共 5 秒，应该结束
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should immediately show 00:00:00 when targetTime is in past', () => {
    const pastTime = Date.now() - 10000; // 过去
    const onFinish = jest.fn();

    render(<CountDown targetTime={pastTime} onFinish={onFinish} />);

    expect(screen.getByText('00')).toBeInTheDocument();
    expect(onFinish).not.toHaveBeenCalled(); // 因为一开始就是 0，不会触发定时器

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 因为一开始 totalSeconds 就是 0，不会启动定时器，所以 onFinish 不会被调用
    expect(onFinish).not.toHaveBeenCalled();
  });

  it('should pass custom className and style', () => {
    const after3Seconds = Date.now() + 3000;
    const customStyle = { color: 'red', fontSize: '20px' };
    const { container } = render(
      <CountDown
        targetTime={after3Seconds}
        className="custom-class"
        style={customStyle}
      />
    );

    const root = container.firstChild as HTMLDivElement;
    expect(root).toHaveClass('custom-class');
    expect(root.style.color).toBe('red');
    expect(root.style.fontSize).toBe('20px');
  });

  it('should clear timer on unmount', () => {
    const after10Seconds = Date.now() + 10000;
    const { unmount } = render(<CountDown targetTime={after10Seconds} />);

    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
