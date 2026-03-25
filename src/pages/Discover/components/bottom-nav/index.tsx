/**
 * 底部导航栏组件
 * 包含首页、发现、创建、收藏、我的五个导航项，支持点击切换和高亮当前激活项
 */

import React from 'react';
import { useObserver } from 'mobx-react';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { BOTTOM_NAV_ITEMS } from './constant';
import styles from './index.module.scss';

/**
 * 底部导航栏组件
 */
export const BottomNav = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从路径 /discover/home 中提取 'home' 作为当前激活项
  const getActiveNavId = (): string => {
    const pathParts = location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  };

  const activeNavId = getActiveNavId();

  const handleNavClick = (navId: string) => {
    navigate(`/discover/${navId}`);
  };

  return useObserver(() => (
    <>
      <div className={styles.container}>
        {BOTTOM_NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={classNames(
              styles.navItem,
              item.id === activeNavId && styles.active,
            )}
            onClick={() => handleNavClick(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.name}</span>
          </button>
        ))}
      </div>
      <div className={styles.spacer} />
    </>
  ));
});

export default BottomNav;
