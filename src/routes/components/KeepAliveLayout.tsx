/**
 * KeepAlive 缓存包装组件
 * 统一处理 KeepAlive 包装 + Suspense 懒加载 Loading
 */

import React from 'react';
import KeepAlive from 'react-activation';
import { Suspense } from 'react';
import Loading from '@/components/Loading';

export interface KeepAliveLayoutProps {
  /** 是否缓存 */
  keepAlive?: boolean;
  /** 缓存 key（一般用全路径）*/
  cacheKey: string;
  /** 子元素 */
  children: React.ReactNode;
}

/**
 * 统一处理 KeepAlive 包装 + Suspense 懒加载
 * - 如果配置 keepAlive，则用 KeepAlive 包裹
 * - 始终用 Suspense 包裹，支持懒加载
 */
export const KeepAliveLayout: React.FC<KeepAliveLayoutProps> = ({
  keepAlive,
  cacheKey,
  children,
}) => {
  if (keepAlive) {
    return (
      <KeepAlive id={cacheKey} cacheKey={cacheKey} name={cacheKey}>
        <Suspense fallback={<Loading tip="loading..." />}>{children}</Suspense>
      </KeepAlive>
    );
  }

  return (
    <Suspense fallback={<Loading tip="loading..." />}>{children}</Suspense>
  );
};
