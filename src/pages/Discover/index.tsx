/**
 * Discover 模块入口
 * 渲染主布局（包含底部导航），子路由通过 Outlet 渲染
 */

import React from 'react';
import MainLayout from './MainLayout';

const Discover: React.FC = () => {
  return <MainLayout />;
};

export default Discover;
