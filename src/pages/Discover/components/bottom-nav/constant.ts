/**
 * 底部导航配置
 */

export interface BottomNavItem {
  id: string;
  name: string;
  icon: string;
}

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'explore', name: 'Explore', icon: '⥁' },
  { id: 'saved', name: 'Saved', icon: '🔖' },
  { id: 'profile', name: 'Profile', icon: '👤' },
];
