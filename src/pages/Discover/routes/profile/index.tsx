/**
 * Profile 个人页面
 * @description 个人中心页面，显示用户信息和功能菜单
 */
import React from 'react';
import styles from './index.module.scss';

/**
 * Profile 个人页面
 */
const Profile: React.FC = () => (
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
          strokeWidth="2"
        >
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1.024.22 2.071-.417 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    </div>

    {/* 用户信息卡片 */}
    <div className={styles.userCard}>
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
            strokeWidth="2"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
      </div>

      <h1 className={styles.userName}>John Maker</h1>
      <p className={styles.userHandle}>@johnmaker</p>
      <p className={styles.userBio}>
        Frontend engineer, UI designer, and tech enthusiast. I write about
        modern web dev.
      </p>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>248</div>
          <div className={styles.statLabel}>Followers</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <div className={styles.statNumber}>156</div>
          <div className={styles.statLabel}>Following</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <div className={styles.statNumber}>12.4k</div>
          <div className={styles.statLabel}>Likes</div>
        </div>
      </div>
    </div>

    {/* 菜单列表 */}
    <div className={styles.menuList}>
      <div className={styles.menuItem}>
        <div className={styles.menuIcon}>
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <span className={styles.menuText}>My Articles</span>
        <span className={styles.menuBadge}>12</span>
      </div>

      <div className={styles.menuItem}>
        <div className={styles.menuIcon}>
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <span className={styles.menuText}>Saved Reading</span>
        <span className={styles.menuBadge}>48</span>
      </div>

      <div className={styles.menuItem}>
        <div className={styles.menuIcon}>
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <span className={styles.menuText}>Reading Stats</span>
        <svg
          className={styles.menuArrow}
          width={26}
          height={26}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      <div className={styles.menuItem}>
        <div className={styles.menuIcon}>
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 2.37-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1.024.22 2.071-.417 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span className={styles.menuText}>Preferences</span>
        <svg
          className={styles.menuArrow}
          width={26}
          height={26}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>

    {/* 退出登录 */}
    <div className={styles.signOutWrapper}>
      <div className={styles.signOutButton}>
        <div className={styles.signOutIcon}>
          <svg
            width={26}
            height={26}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
);

Profile.displayName = 'Profile';

export default Profile;
