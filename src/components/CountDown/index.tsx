import React, { useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

/**
 * 倒计时组件属性接口
 */
export interface CountDownProps {
  /** 目标时间戳（毫秒） */
  targetTime: number;
  /** 是否自动开始倒计时，默认 true */
  autoStart?: boolean;
  /** 时间格式，支持格式：DD=天, HH=时, mm=分, ss=秒，例如 "HH:mm:ss" */
  format?: string;
  /** 是否显示前导零，默认 true */
  showLeadingZero?: boolean;
  /** 是否分块显示（每个时间块单独框起来），默认 false */
  splitBox?: boolean;
  /** 倒计时结束回调 */
  onFinish?: () => void;
  /** 每秒更新回调，参数为剩余时间 */
  onTick?: (timeData: TimeData) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 剩余时间数据结构
 */
export interface TimeData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

/**
 * 格式化数字，添加前导零
 */
const padZero = (num: number, length: number = 2): string => {
  return num.toString().padStart(length, '0');
};

/**
 * 计算剩余时间
 */
const calculateTimeLeft = (targetTime: number): TimeData => {
  const now = Date.now();
  const diff = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
};

/**
 * 倒计时组件
 * 支持多种显示格式，分块展示，自动倒计时
 *
 * @example
 * ```tsx
 * <CountDown
 *   targetTime={Date.now() + 3600000}
 *   format="HH:mm:ss"
 *   splitBox
 *   onFinish={() => console.log('倒计时结束')}
 * />
 * ```
 */
export const CountDown = React.memo<CountDownProps>(({
  targetTime,
  autoStart = true,
  format = 'HH:mm:ss',
  showLeadingZero = true,
  splitBox = false,
  onFinish,
  onTick,
  className,
  style,
}) => {
  // 存储剩余时间状态
  const [timeLeft, setTimeLeft] = React.useState<TimeData>(() =>
    calculateTimeLeft(targetTime)
  );

  // timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 清除计时器
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * 启动倒计时
   */
  const start = useCallback(() => {
    clearTimer();

    // 如果已经结束，直接返回
    if (timeLeft.totalSeconds <= 0) {
      return;
    }

    timerRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetTime);
      setTimeLeft(newTimeLeft);
      onTick?.(newTimeLeft);

      // 倒计时结束
      if (newTimeLeft.totalSeconds <= 0) {
        clearTimer();
        onFinish?.();
      }
    }, 1000);
  }, [targetTime, timeLeft.totalSeconds, clearTimer, onFinish, onTick]);


  // 组件挂载时自动开始
  useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => clearTimer();
  }, [autoStart, start, clearTimer]);

  // targetTime 变化时重新计算并重启
  useEffect(() => {
    const newTimeLeft = calculateTimeLeft(targetTime);
    setTimeLeft(newTimeLeft);

    if (autoStart && newTimeLeft.totalSeconds > 0) {
      start();
    }

    return () => clearTimer();
  }, [targetTime, autoStart, start, clearTimer]);

  /**
   * 渲染时间部分
   */
  const renderTimePart = (value: number, label: string): React.ReactNode => {
    const displayValue = showLeadingZero ? padZero(value) : value.toString();

    if (splitBox) {
      return (
        <span className={styles.timeBox}>
          <span className={styles.timeNumber}>{displayValue}</span>
          {label && <span className={styles.timeLabel}>{label}</span>}
        </span>
      );
    }

    return <span className={styles.timeText}>{displayValue}</span>;
  };

  /**
   * 根据格式渲染倒计时
   */
  const renderFormattedTime = (): React.ReactNode => {
    const { days, hours, minutes, seconds } = timeLeft;
    const parts: React.ReactNode[] = [];

    // 使用正则替换格式字符串
    const formatParts = format.match(/(DD|HH|mm|ss|[^DHms]+)/g) || [];

    formatParts.forEach((part) => {
      switch (part) {
        case 'DD':
          if (days > 0 || format.includes('DD')) {
            parts.push(renderTimePart(days, '天'));
          }
          break;
        case 'HH':
          parts.push(renderTimePart(hours, '时'));
          break;
        case 'mm':
          parts.push(renderTimePart(minutes, '分'));
          break;
        case 'ss':
          parts.push(renderTimePart(seconds, '秒'));
          break;
        default:
          // 非格式字符直接输出（比如冒号分隔符）
          if (splitBox) {
            parts.push(<span className={styles.separator}>{part}</span>);
          } else {
            parts.push(<span className={styles.separatorText}>{part}</span>);
          }
          break;
      }
    });

    return parts;
  };

  const rootClassName = classNames(
    styles.container,
    {
      [styles.splitBox]: splitBox,
    },
    className
  );

  return (
    <div className={rootClassName} style={style}>
      {renderFormattedTime()}
    </div>
  );
});

CountDown.displayName = 'CountDown';

export default CountDown;
