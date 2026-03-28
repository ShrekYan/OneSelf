/**
 * 发现页/主页路由模块
 * 底部三个 Tab 页面需要缓存
 */

import React from 'react';
// import { Navigate } from 'react-router-dom';
import type { RouteConfig } from '@/routes/types';
import type { RouteConfigInfo } from '@/routes/components/RouteInterceptor';
import { KeepAliveLayout } from '@/routes/components/KeepAliveLayout';
import { RouteInterceptor } from '@/routes/components/RouteInterceptor';

// Discover 主容器
import Discover from '@/pages/Discover';

// 四个主页直接导入（预先加载，提升切换体验）
import DiscoverHome from '@/pages/Discover/routes/home';
import Explore from '@/pages/Discover/routes/explore';
import Profile from '@/pages/Discover/routes/profile';

/**
 * 创建带缓存的页面元素
 */
const createCachedElement = (
  Component: React.ComponentType,
  pageName: string,
  cacheKey: string,
): React.ReactElement => {
  const routeConfig: RouteConfigInfo = {
    path: cacheKey,
    pageName,
    keepAlive: true,
  };
  return (
    <RouteInterceptor routeConfig={routeConfig}>
      <KeepAliveLayout keepAlive={true} cacheKey={cacheKey}>
        <Component />
      </KeepAliveLayout>
    </RouteInterceptor>
  );
};

const discoverRoutes: RouteConfig[] = [
  {
    path: '/',
    pageName: '主页',
    element: <Discover />,
    handle: {
      pageName: '主页',
      keepAlive: false,
    },
    children: [
      //TODO:XXX
      // {
      //   index: true,
      //   element: <Navigate to="/home" replace />,
      //   handle: {
      //     pageName: '重定向到首页',
      //   },
      // },
      {
        path: '/home',
        element: createCachedElement(DiscoverHome, '首页', '/home'),
        handle: {
          pageName: '首页',
          keepAlive: true,
        },
      },
      {
        path: '/explore',
        element: createCachedElement(Explore, '发现', '/explore'),
        handle: {
          pageName: '发现',
          keepAlive: true,
        },
      },
      {
        path: '/profile',
        element: createCachedElement(Profile, '我的', '/profile'),
        handle: {
          pageName: '我的',
          keepAlive: true,
        },
      },
    ],
  },
];

export { discoverRoutes };
