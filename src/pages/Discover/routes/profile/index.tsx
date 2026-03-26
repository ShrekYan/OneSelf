/**
 * Profile 个人页面
 * @description 个人中心页面，显示用户信息和功能菜单
 */
import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';
import {
  useHandleMenuItemClick,
  useHandleSignOut,
  fetchUserInfo,
  loadMenuItems,
} from './handle';
import { PROFILE_MENU_ITEMS } from './constant';
import useProfileStore from './useStore';

/**
 * Profile 个人页面
 */
const Profile: React.FC = () => {
  // 在组件顶层调用 Hooks 获取处理函数和 store
  const onMenuItemClick = useHandleMenuItemClick();
  const onSignOut = useHandleSignOut();
  const profileStore = useProfileStore();

  // 页面加载时获取数据
  useEffect(() => {
    fetchUserInfo(profileStore);
    loadMenuItems(profileStore, PROFILE_MENU_ITEMS);
  }, [profileStore]);

  return useObserver(() => (
    <div className={styles.container}>
      {/* 顶部栏 */}
      <div className={styles.header}>
        <div className={styles.avatarBadge}>B</div>
        <div className={styles.settingsIcon}>
          <svg
            width={32}
            height={32}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 2.37-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1.024.22 2.071-.417 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>

      {/* 用户信息卡片 */}
      <div className={styles.userCard}>
        {profileStore.loading ? (
          <div className={styles.loadingWrapper}></div>
        ) : (
          <>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {/* 占位，实际使用用户头像 */}
                <div className={styles.avatarPlaceholder} />
              </div>
              <div className={styles.editButton}>
                <svg
                  width={26}
                  height={26}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                >
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
            </div>

            <h1 className={styles.userName}>
              {profileStore.userInfo?.userName || 'John Maker'}
            </h1>
            <p className={styles.userHandle}>
              {profileStore.userInfo?.userHandle || '@johnmaker'}
            </p>
            <p className={styles.userBio}>
              {profileStore.userInfo?.userBio ||
                'Frontend engineer, UI designer, and tech enthusiast. I write about modern web dev.'}
            </p>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {profileStore.userInfo?.stats.followers ?? 248}
                </div>
                <div className={styles.statLabel}>Followers</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {profileStore.userInfo?.stats.following ?? 156}
                </div>
                <div className={styles.statLabel}>Following</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {profileStore.userInfo?.stats.totalLikes
                    ? profileStore.userInfo.stats.totalLikes >= 1000
                      ? `${(profileStore.userInfo.stats.totalLikes / 1000).toFixed(1)}k`
                      : profileStore.userInfo.stats.totalLikes
                    : '12.4k'}
                </div>
                <div className={styles.statLabel}>Likes</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 菜单列表 */}
      <div className={styles.menuList}>
        {profileStore.menuItems.slice(0, 4).map(menu => (
          <div
            key={menu.id}
            className={styles.menuItem}
            onClick={() => onMenuItemClick(menu)}
          >
            <div className={styles.menuIcon}>
              {/* 根据 icon 名称渲染对应图标 - 此处保持现有 SVG 结构 */}
              {menu.id === 'my-articles' && (
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              )}
              {menu.id === 'saved-reading' && (
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              )}
              {menu.id === 'reading-stats' && (
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              )}
              {menu.id === 'preferences' && (
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 2.37-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1.024.22 2.071-.417 2.572-1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </div>
            <span className={styles.menuText}>{menu.title}</span>
            {menu.badge !== undefined && menu.badge > 0 && (
              <span className={styles.menuBadge}>{menu.badge}</span>
            )}
            {menu.hasArrow && (
              <svg
                className={styles.menuArrow}
                width={26}
                height={26}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* 退出登录 */}
      <div className={styles.signOutWrapper}>
        <div
          className={styles.signOutButton}
          onClick={() => onSignOut(profileStore)}
        >
          <div className={styles.signOutIcon}>
            <svg
              width={26}
              height={26}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <span className={styles.signOutText}>Sign Out</span>
        </div>
      </div>
    </div>
  ));
};

Profile.displayName = 'Profile';

export default Profile;
