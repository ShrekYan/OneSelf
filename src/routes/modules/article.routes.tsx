/**
 * 文章相关路由模块
 */

import React from 'react';
import type { RouteConfig } from '@/routes/types';
import { KeepAliveLayout } from '@/routes/components/KeepAliveLayout';
import { RouteInterceptor } from '@/routes/components/RouteInterceptor';

const ArticleDetail = React.lazy(() => import('@/pages/ArticleDetail'));
const Search = React.lazy(() => import('@/pages/Discover/routes/search'));
const Notifications = React.lazy(() => import('@/pages/Notifications'));

const articleRoutes: RouteConfig[] = [
  {
    path: '/article/:id',
    element: (
      <RouteInterceptor
        routeConfig={{
          path: '/article/:id',
          pageName: '文章详情',
          keepAlive: false,
        }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/article/:id">
          <ArticleDetail />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '文章详情',
      keepAlive: false,
    },
  },
  {
    path: '/search',
    element: (
      <RouteInterceptor
        routeConfig={{ path: '/search', pageName: '搜索', keepAlive: false }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/search">
          <Search />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '搜索',
      keepAlive: false,
    },
  },
  {
    path: '/notifications',
    element: (
      <RouteInterceptor
        routeConfig={{
          path: '/notifications',
          pageName: '消息通知',
          keepAlive: false,
        }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/notifications">
          <Notifications />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '消息通知',
      keepAlive: false,
    },
  },
];

export { articleRoutes };
