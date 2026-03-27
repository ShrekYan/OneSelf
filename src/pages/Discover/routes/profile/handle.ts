/**
 * Profile 个人中心页面业务处理函数
 * @description 存放用户信息编辑、菜单点击、退出登录等业务逻辑
 */

import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_USER_INFO } from './constant';

import type { MenuItem } from './constant';
import type { UserInfo } from './useStore';
import type { ProfileStoreType } from './useStore';

/**
 * 处理编辑按钮点击
 * @param store - Profile store 实例
 */
export const handleEditClick = (store: ProfileStoreType): void => {
  store.setIsEditing(true);
};

/**
 * 保存用户信息编辑
 * @param store - Profile store 实例
 * @param userInfo - 更新后的用户信息
 */
export const handleSaveEdit = async (
  store: ProfileStoreType,
  userInfo: Partial<UserInfo>,
): Promise<void> => {
  store.setLoading(true);
  try {
    // Mock: 延迟模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 500));
    store.updateUserInfo(userInfo);
    store.setIsEditing(false);
    Toast.show({
      icon: 'success',
      content: '保存成功',
    });
  } catch (error) {
    console.error('保存用户信息失败:', error);
    Toast.show({
      icon: 'fail',
      content: '保存失败，请重试',
    });
  } finally {
    store.setLoading(false);
  }
};

/**
 * 取消编辑
 * @param store - Profile store 实例
 */
export const handleCancelEdit = (store: ProfileStoreType): void => {
  store.setIsEditing(false);
};

/**
 * 处理菜单项点击
 * @description 使用柯里化，在组件顶层获取 navigate
 */
export const useHandleMenuItemClick = () => {
  const navigate = useNavigate();
  return (menu: MenuItem): void => {
    if (menu.path) {
      navigate(menu.path);
    }
  };
};

/**
 * 处理设置点击
 */
export const handleSettingsClick = (): void => {
  // TODO: 跳转到设置页面
};

/**
 * 处理退出登录
 * @description 使用柯里化，在组件顶层获取 navigate
 */
export const useHandleSignOut = () => {
  const navigate = useNavigate();
  return async (store: ProfileStoreType): Promise<void> => {
    try {
      // Mock: 延迟模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 300));
      store.clearUserInfo();
      Toast.show({
        icon: 'success',
        content: '已退出登录',
      });
      // 跳转到登录页
      navigate('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
      // 即使 API 失败，仍然清除本地状态并跳转
      store.clearUserInfo();
      navigate('/login');
    }
  };
};

/**
 * 加载用户信息
 * @param store - Profile store 实例
 */
export const fetchUserInfo = async (store: ProfileStoreType): Promise<void> => {
  store.setLoading(true);
  try {
    // Mock: 延迟模拟网络请求，使用默认 mock 数据
    await new Promise(resolve => setTimeout(resolve, 300));
    store.setUserInfo(DEFAULT_USER_INFO);
  } catch (error) {
    console.error('加载用户信息失败:', error);
    Toast.show({
      icon: 'fail',
      content: '加载失败，请重试',
    });
  } finally {
    store.setLoading(false);
  }
};

/**
 * 加载菜单配置
 * @param store - Profile store 实例
 * @param menuItems - 菜单项配置
 */
export const loadMenuItems = (
  store: ProfileStoreType,
  menuItems: MenuItem[],
): void => {
  store.setMenuItems(menuItems);
};

/**
 * 更新菜单项徽章数
 * @param store - Profile store 实例
 * @param menuId - 菜单ID
 * @param badge - 徽章数值
 */
export const updateMenuItemBadge = (
  store: ProfileStoreType,
  menuId: string,
  badge: number | undefined,
): void => {
  store.updateMenuItemBadge(menuId, badge);
};
