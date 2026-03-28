import React from 'react';
import { useObserver } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { LazyImage } from '@/components';
import { useProfileStore } from './useStore';
import { MENU_ITEMS } from './constant';
import { useHandleMenuItemClick } from './hooks/useHandleMenuItemClick';
import { useHandleSignOut } from './hooks/useHandleSignOut';
import { handleEditAvatar } from './handle';

/**
 * SVG 图标组件
 */
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const StatsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const SignOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const HelpCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

/**
 * 根据图标名称获取对应的 SVG 组件
 */
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'edit':
      return <PencilIcon />;
    case 'bookmark':
      return <BookmarkIcon />;
    case 'stats':
      return <StatsIcon />;
    case 'settings':
      return <SettingsIcon />;
    case 'help':
      return <HelpCircleIcon />;
    case 'about':
      return <InfoIcon />;
    default:
      return <PencilIcon />;
  }
};

/**
 * Profile 个人资料页面
 */
const Profile: React.FC = () => {
  const profileStore = useProfileStore();
  const onMenuItemClick = useHandleMenuItemClick();
  const onSignOut = useHandleSignOut();
  const navigate = useNavigate();

  const { userInfo } = profileStore;

  // 处理帮助点击
  const handleHelpClick = () => {
    navigate('/help');
  };

  // 处理关于我们点击
  const handleAboutClick = () => {
    navigate('/about');
  };

  return useObserver(() => (
    <div className={styles.profileContainer}>
      {/* 顶部栏 */}
      <header className={styles.header}>
        <div className={styles.logoB}>B</div>
        <div
          className={styles.settingsBtn}
          onClick={() => {}}
          role="button"
          tabIndex={0}
        >
          <GearIcon />
        </div>
      </header>

      {/* 用户信息卡片 */}
      <section className={styles.userCard}>
        <div className={styles.avatarWrapper}>
          <LazyImage
            src={userInfo.avatar}
            alt={userInfo.name}
            className={styles.avatar}
          />
          <div
            className={styles.editBtn}
            onClick={handleEditAvatar}
            role="button"
            tabIndex={0}
          >
            <EditIcon />
          </div>
        </div>
        <h1 className={styles.userName}>{userInfo.name}</h1>
        <div className={styles.username}>{userInfo.username}</div>
        <p className={styles.bio}>{userInfo.bio}</p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {userInfo.stats.followers}
            </span>
            <span className={styles.statLabel}>Followers</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {userInfo.stats.following}
            </span>
            <span className={styles.statLabel}>Following</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{userInfo.stats.likes}</span>
            <span className={styles.statLabel}>Likes</span>
          </div>
        </div>
      </section>

      {/* 菜单列表 */}
      <section className={styles.menuList}>
        {MENU_ITEMS.map(item => (
          <div
            key={item.id}
            className={styles.menuItem}
            onClick={() => onMenuItemClick(item)}
            role="button"
            tabIndex={0}
          >
            <div className={styles.iconWrapper}>
              {getIconComponent(item.icon)}
            </div>
            <div className={styles.title}>{item.title}</div>
            {item.badge && <div className={styles.badge}>{item.badge}</div>}
            {item.hasArrow && (
              <div className={styles.arrow}>
                <ArrowRightIcon />
              </div>
            )}
          </div>
        ))}

        {/* 帮助 */}
        <div
          className={styles.menuItem}
          onClick={handleHelpClick}
          role="button"
          tabIndex={0}
        >
          <div className={styles.iconWrapper}>{getIconComponent('help')}</div>
          <div className={styles.title}>Help</div>
          <div className={styles.arrow}>
            <ArrowRightIcon />
          </div>
        </div>

        {/* 关于我们 */}
        <div
          className={styles.menuItem}
          onClick={handleAboutClick}
          role="button"
          tabIndex={0}
        >
          <div className={styles.iconWrapper}>{getIconComponent('about')}</div>
          <div className={styles.title}>About</div>
          <div className={styles.arrow}>
            <ArrowRightIcon />
          </div>
        </div>
      </section>

      {/* 退出登录 */}
      <section className={styles.signOutWrapper}>
        <div
          className={styles.signOutBtn}
          onClick={onSignOut}
          role="button"
          tabIndex={0}
        >
          <div className={styles.iconWrapper}>
            <SignOutIcon />
          </div>
          <div className={styles.text}>Sign Out</div>
        </div>
      </section>
    </div>
  ));
};

Profile.displayName = 'Profile';

export default Profile;
