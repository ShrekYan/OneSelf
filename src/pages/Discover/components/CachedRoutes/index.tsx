/**
 * Discover 嵌套路由缓存组件 - 纯 CSS 终极方案
 * 组件**完全永久挂载**，从不卸载，只通过 CSS 显示隐藏
 * 彻底保证 useEffect 只执行一次，滚动位置和组件状态完整保留
 *
 * 特点：最简单、最可靠、零魔法、完全满足需求
 * 不依赖 Activity 的挂载/卸载控制，只靠 CSS
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './index.module.scss';

// 直接导入具体页面组件
import DiscoverHome from '@/pages/Discover/routes/home';
import Explore from '@/pages/Discover/routes/explore';
import Profile from '@/pages/Discover/routes/profile';

// 提前创建元素，只创建一次，永远保持同一个引用
// 确保 React 永远不会重新挂载
const HOME_ELEMENT = <DiscoverHome />;
const EXPLORE_ELEMENT = <Explore />;
const PROFILE_ELEMENT = <Profile />;

/**
 * 纯 CSS 方案：
 * - 三个页面永久挂载在 DOM 中，从不卸载
 * - 只通过 CSS display: none 隐藏非激活页面
 * - 组件永远存在，useEffect 只执行一次
 * - 滚动位置、组件状态 100% 完整保留
 * - 不使用第三方库，符合需求
 */
export const CachedRoutes: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={styles.cachedRoutesContainer}>
      {/* /home - 永久挂载，从不卸载 */}
      <div className={styles.cachedPage} data-active={currentPath === '/home'}>
        {HOME_ELEMENT}
      </div>

      {/* /explore - 永久挂载，从不卸载 */}
      <div
        className={styles.cachedPage}
        data-active={currentPath === '/explore'}
      >
        {EXPLORE_ELEMENT}
      </div>

      {/* /profile - 永久挂载，从不卸载 */}
      <div
        className={styles.cachedPage}
        data-active={currentPath === '/profile'}
      >
        {PROFILE_ELEMENT}
      </div>
    </div>
  );
};
