/**
 * 公开路由模块
 * 不需要登录就能访问的页面
 */

import React from 'react';
import type { RouteConfig } from '@/routes/types';
import { KeepAliveLayout } from '@/routes/components/KeepAliveLayout';
import { RouteInterceptor } from '@/routes/components/RouteInterceptor';

const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const About = React.lazy(() => import('@/pages/About'));
const Help = React.lazy(() => import('@/pages/Help'));
const TransactionRecord = React.lazy(() => import('@/pages/TransactionRecord'));
const ResultDetail = React.lazy(() => import('@/pages/ResultDetail'));

const publicRoutes: RouteConfig[] = [
  {
    path: '/transactionRecord',
    element: (
      <RouteInterceptor
        routeConfig={{
          path: '/transactionRecord',
          pageName: '交易记录',
          keepAlive: false,
        }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/transactionRecord">
          <TransactionRecord />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '交易记录',
      keepAlive: false,
    },
  },
  {
    path: '/result-detail',
    element: (
      <RouteInterceptor
        routeConfig={{
          path: '/result-detail',
          pageName: '购买结果',
          keepAlive: false,
        }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/result-detail">
          <ResultDetail />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '购买结果',
      keepAlive: false,
    },
  },
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
    path: '/register',
    element: (
      <RouteInterceptor
        routeConfig={{ path: '/register', pageName: '注册', keepAlive: false }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/register">
          <Register />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '注册',
      keepAlive: false,
    },
  },
  {
    path: '/forgot-password',
    element: (
      <RouteInterceptor
        routeConfig={{
          path: '/forgot-password',
          pageName: '忘记密码',
          keepAlive: false,
        }}
      >
        <KeepAliveLayout keepAlive={false} cacheKey="/forgot-password">
          <ForgotPassword />
        </KeepAliveLayout>
      </RouteInterceptor>
    ),
    handle: {
      pageName: '忘记密码',
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
