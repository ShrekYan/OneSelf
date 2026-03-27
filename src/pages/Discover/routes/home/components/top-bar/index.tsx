import React from 'react';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title = 'Discover' }) => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleAvatarClick = () => {
    console.log('Navigate to user profile');
    // TODO: 跳转到个人主页
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div
          className={styles.avatar}
          onClick={handleAvatarClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleAvatarClick();
            }
          }}
        >
          B
        </div>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.rightSection}>
        <div
          className={styles.iconBtn}
          onClick={handleSearchClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSearchClick();
            }
          }}
          aria-label="搜索"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <div
          className={styles.iconBtn}
          onClick={handleNotificationClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleNotificationClick();
            }
          }}
          aria-label="通知"
        >
          <svg viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div className={styles.notificationDot} />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
