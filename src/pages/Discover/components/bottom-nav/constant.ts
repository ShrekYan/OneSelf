/**
 * 底部导航配置
 */

export type BottomNavId = 'home' | 'explore' | 'saved' | 'profile';

export interface BottomNavItem {
  id: BottomNavId;
  name: string;
}

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { id: 'home', name: 'Home' },
  { id: 'explore', name: 'Explore' },
  { id: 'saved', name: 'Saved' },
  { id: 'profile', name: 'Profile' },
];
