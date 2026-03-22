import React from "react";
import style from "./index.module.scss";

/**
 * 懒加载图片组件接口
 */
interface LazyImageProps {
  src: string;       // 图片URL
  alt: string;       // 图片替代文本
  className: string;  // 容器样式类名
}

/**
 * 懒加载图片组件
 * 使用 IntersectionObserver API 实现图片懒加载
 * 当图片进入视口范围时才开始加载，提升页面性能
 */
export const LazyImage = React.memo(({ src, alt, className }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = React.useState(false);       // 图片是否加载完成
  const [isVisible, setIsVisible] = React.useState(false);     // 图片是否进入视口
  const imgRef = React.useRef<HTMLImageElement>(null);          // imgRef: 图片元素的引用
  const containerRef = React.useRef<HTMLDivElement>(null);      // containerRef: 容器元素的引用

  React.useEffect(() => {
    // 创建 IntersectionObserver 监听元素是否进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // entry: IntersectionObserverEntry 对象，包含目标元素的交叉信息
          if (entry.isIntersecting) {
            setIsVisible(true);    // 进入视口后开始加载图片
            if (containerRef.current) {
              observer.unobserve(containerRef.current);  // 停止观察
            }
          }
        });
      },
      { rootMargin: '100px' }  // 提前 100px 开始加载
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 清理函数
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {isVisible && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"  // 原生懒加载属性作为后备方案
          className={style.image}
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}  // 淡入动画效果
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
});
