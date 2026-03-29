/**
 * 公开路由模块
 * 不需要登录就能访问的页面
 */

import React from 'react';
import type { RouteConfig } from '@/routes/types';
import { KeepAliveLayout } from '@/routes/components/KeepAliveLayout';
import { RouteInterceptor } from '@/routes/components/RouteInterceptor';

const Login = React.lazy(() => import('@/pages/Login'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const About = React.lazy(() => import('@/pages/About'));
const Help = React.lazy(() => import('@/pages/Help'));

const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: (
      <RouteInterceptor
        routeConfig={{ path: '/login', pageName: '登录', keepAlive: false }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/login">
          <Login />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '登录',
      keepAlive: false,
    },
  },
  {
    path: '/about',
    element: (
      <RouteInterceptor
        routeConfig={{ path: '/about', pageName: '关于', keepAlive: false }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/about">
          <About />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '关于',
      keepAlive: false,
    },
  },
  {
    path: '/help',
    element: (
      <RouteInterceptor
        routeConfig={{ path: '/help', pageName: '帮助', keepAlive: false }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/help">
          <Help />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '帮助',
      keepAlive: false,
    },
  },
  {
    path: '*',
    element: (
      <RouteInterceptor
        routeConfig={{ path: '*', pageName: '404', keepAlive: false }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="*">
          <NotFound />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '404',
      keepAlive: false,
    },
  },
  // 根路径重定向已经在 discover 模块处理
];

export { publicRoutes };
