/**
 * 顶部导航栏组件
 * 包含 Discover 标题、搜索按钮、通知按钮
 */

import React from 'react';
import { useNavigationActions } from '../../handle';
import { PAGE_TITLE } from '../../constant';
import styles from './index.module.scss';

/**
 * 顶部导航栏组件
 * 显示页面标题和操作按钮（搜索、通知）
 */
export const TopBar = React.memo(() => {
  const { navigateToSearch, navigateToNotifications } = useNavigationActions();

  const handleSearchClick = () => {
    navigateToSearch();
  };

  const handleNotificationsClick = () => {
    navigateToNotifications();
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.userAvatar}>B</div>
        <h1 className={styles.title}>{PAGE_TITLE}</h1>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={handleSearchClick}
          title="Search"
        >
          🔍
        </button>
        <button
          className={styles.actionButton}
          onClick={handleNotificationsClick}
          title="Notifications"
        >
          🔔<span className={styles.notificationDot}></span>
        </button>
      </div>
    </div>
  );
});

export default TopBar;
