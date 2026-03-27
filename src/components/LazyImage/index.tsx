import React from 'react';
import styles from './index.module.scss';

/**
 * 懒加载图片组件 Props 接口
 */
export interface LazyImageProps {
  /** 图片 URL */
  src: string;
  /** 图片替代文本 */
  alt: string;
  /** 容器 CSS class name（可选） */
  className?: string;
  /** 提前加载边距（px），默认 100px */
  rootMargin?: number;
  /** 图片加载完成回调（可选） */
  onLoad?: () => void;
}

/**
 * 懒加载图片组件
 * 使用 IntersectionObserver API 实现图片懒加载
 * 当图片进入视口范围时才开始加载，提升页面性能
 */
export const LazyImage = React.memo<LazyImageProps>(
  ({ src, alt, className, rootMargin = 100, onLoad }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              if (containerRef.current) {
                observer.unobserve(containerRef.current);
              }
            }
          });
        },
        { rootMargin: `${rootMargin}px` },
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }, [rootMargin]);

    const handleLoad = React.useCallback(() => {
      setIsLoaded(true);
      onLoad?.();
    }, [onLoad]);

    return (
      <div ref={containerRef} className={className}>
        {isVisible && (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={styles.image}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={handleLoad}
          />
        )}
      </div>
    );
  },
);

LazyImage.displayName = 'LazyImage';

export default LazyImage;
