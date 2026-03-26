/**
 * IntersectionObserver 自定义 Hook
 * @description 用于监听元素是否进入可视区域，实现懒加载
 */

import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverOptions {
  /** 交叉比例，当元素可见比例超过此阈值时触发 */
  threshold?: number;
  /** 根元素，默认为浏览器视口 */
  root?: Element | null;
  /** 根元素的边距 */
  rootMargin?: string;
  /** 是否只监听一次，触发后立即取消观察 */
  triggerOnce?: boolean;
}

/**
 * 监听元素是否进入可视区域
 * @param options IntersectionObserver 配置选项
 * @returns [ref, isIntersecting] ref 需要绑定到监听元素，isIntersecting 表示是否相交
 */
export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {},
): [React.RefObject<T | null>, boolean] {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 如果已经触发过一次，不需要重新监听
    if (isIntersecting && triggerOnce) {
      return;
    }

    // 创建 IntersectionObserver 实例
    observerRef.current = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // 如果只触发一次，触发后立即取消观察
          if (triggerOnce && observerRef.current && ref.current) {
            observerRef.current.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        root,
        rootMargin,
      },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    // 清理函数
    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [threshold, root, rootMargin, triggerOnce, isIntersecting]);

  return [ref, isIntersecting];
}

export default useIntersectionObserver;
