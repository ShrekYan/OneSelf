/**
 * Profile 个人中心模块常量定义
 */

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  badge?: number;
  hasArrow: boolean;
  path?: string;
}

// ==================== 菜单列表 ====================
export const PROFILE_MENU_ITEMS: MenuItem[] = [
  {
    id: 'my-articles',
    title: 'My Articles',
    icon: 'edit',
    badge: 12,
    hasArrow: true,
    path: '/my-articles',
  },
  {
    id: 'saved-reading',
    title: 'Saved Reading',
    icon: 'bookmark',
    badge: 48,
    hasArrow: true,
    path: '/saved',
  },
  {
    id: 'reading-stats',
    title: 'Reading Stats',
    icon: 'trending',
    badge: undefined,
    hasArrow: true,
    path: '/stats',
  },
  {
    id: 'preferences',
    title: 'Preferences',
    icon: 'settings',
    badge: undefined,
    hasArrow: true,
    path: '/settings',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    badge: 3,
    hasArrow: true,
    path: '/notifications',
  },
  {
    id: 'help-center',
    title: 'Help Center',
    icon: 'help-circle',
    badge: undefined,
    hasArrow: true,
    path: '/help',
  },
  {
    id: 'about-us',
    title: 'About Us',
    icon: 'info',
    badge: undefined,
    hasArrow: true,
    path: '/about',
  },
];

// ==================== 默认用户信息 ====================
export const DEFAULT_USER_INFO = {
  userName: 'John Maker',
  userHandle: '@johnmaker',
  userBio:
    'Frontend engineer, UI designer, and tech enthusiast. I write about modern web dev.',
  avatarUrl: '',
  stats: {
    followers: 248,
    following: 156,
    totalLikes: 12400,
  },
} as const;
