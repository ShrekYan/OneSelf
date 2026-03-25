/**
 * 底部导航栏组件
 * 包含 Home、Explore、Saved、Profile 四个导航项，支持点击切换和高亮当前激活项
 */

import React from 'react';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { BOTTOM_NAV_ITEMS, BottomNavId } from './constant';
import styles from './index.module.scss';

/**
 * 底部导航栏组件
 */
export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从路径 /discover/home 中提取 'home' 作为当前激活项
  const getActiveNavId = (): BottomNavId => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const validIds: BottomNavId[] = ['home', 'explore', 'saved', 'profile'];
    return validIds.includes(lastPart as BottomNavId)
      ? (lastPart as BottomNavId)
      : 'home';
  };

  const activeNavId = getActiveNavId();

  const handleNavClick = (navId: BottomNavId): void => {
    navigate(`/discover/${navId}`);
  };

  // 渲染对应图标
  const renderIcon = (id: BottomNavId, isActive: boolean): React.ReactNode => {
    const strokeColor = isActive ? '#8848f9' : '#7f7f7f';
    const size = isActive ? 26 : 24;
    const strokeWidth = isActive ? 2.5 : 2;

    switch (id) {
      case 'home':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 26 26"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.417 11.042L13 1.354L23.583 11.042V20.583C23.583 22.078 22.348 23.292 20.833 23.292H15.417C13.902 23.292 12.667 22.078 12.667 20.583V16.385C12.667 14.88 11.432 13.677 9.917 13.677H4.583C3.068 13.677 1.833 14.88 1.833 16.385V11.042Z" />
          </svg>
        );
      case 'explore':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="14.5 9.5 9 12 14.5 14.5 12 9 14.5 9.5" />
          </svg>
        );
      case 'saved':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 2V21L12 16.5L21 21V2H3Z" />
          </svg>
        );
      case 'profile':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21V19C20 17.939 19.579 16.922 18.828 16.172C18.078 15.422 17.061 15 16 15H8C6.939 15 5.922 15.422 5.172 16.172C4.422 16.922 4 17.939 4 19V21" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          {BOTTOM_NAV_ITEMS.map(item => {
            const isActive = item.id === activeNavId;
            return (
              <button
                key={item.id}
                className={classNames(
                  styles.navItem,
                  isActive && styles.active,
                )}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.name}
              >
                <div className={styles.iconWrapper}>
                  <span className={styles.icon}>
                    {renderIcon(item.id, isActive)}
                  </span>
                </div>
                <span className={styles.label}>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.spacer} />
    </>
  );
};

BottomNav.displayName = 'BottomNav';

export default BottomNav;
