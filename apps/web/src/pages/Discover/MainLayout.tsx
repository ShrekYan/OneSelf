/**
 * Discover 主布局
 * 包含底部导航栏，通过缓存渲染子路由
 * 底部导航的三个主页面（home/explore/profile）会被缓存，保持状态和滚动位置
 */

import React from 'react';
import { BottomNav } from './components/bottom-nav';
import { Outlet } from 'react-router-dom';
import styles from './index.module.scss';

/**
 * 主布局组件
 * BottomNav 在顶层持久化显示，子路由通过 CachedRoutes 缓存渲染
 * 底部导航切换时，已访问页面保持不卸载，提升切换体验
 */
const MainLayout: React.FC = () => {
  console.log('MainLayout: didActivate');
  return (
    <div className={styles.discoverRoot}>
      {/* 子路由内容在这里渲染 - 支持缓存 */}
      <Outlet />
      {/* 底部导航栏 - 始终显示不销毁 */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
