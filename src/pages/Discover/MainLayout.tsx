/**
 * Discover 主布局
 * 包含底部导航栏，通过 Outlet 渲染子路由
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './components/bottom-nav';
import styles from './index.module.scss';

/**
 * 主布局组件
 * BottomNav 在顶层持久化显示，子路由通过 Outlet 渲染
 */
const MainLayout: React.FC = () => {
  return (
    <div className={styles.discoverRoot}>
      {/* 子路由内容在这里渲染 */}
      <Outlet />
      {/* 底部导航栏 - 始终显示不销毁 */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
