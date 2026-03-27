/**
 * Profile 页面常量定义
 */

export interface MenuItem {
  id: string;
  icon: string;
  title: string;
  badge?: string;
  hasArrow?: boolean;
}

/**
 * 菜单项配置
 */
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'articles',
    icon: 'edit',
    title: 'My Articles',
    badge: '12',
  },
  {
    id: 'saved',
    icon: 'bookmark',
    title: 'Saved Reading',
    badge: '48',
  },
  {
    id: 'stats',
    icon: 'stats',
    title: 'Reading Stats',
    hasArrow: true,
  },
  {
    id: 'preferences',
    icon: 'settings',
    title: 'Preferences',
    hasArrow: true,
  },
];
