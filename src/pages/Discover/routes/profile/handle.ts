/**
 * Profile 个人中心页面业务处理函数
 * @description 存放用户信息编辑、菜单点击、退出登录等业务逻辑
 */

import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import type { MenuItem } from './constant';
import type { UserInfo } from './useStore';
import useProfileStore from './useStore';

/**
 * 处理编辑按钮点击
 * @param store - Profile store 实例
 */
export const handleEditClick = (
  store: ReturnType<typeof useProfileStore>,
): void => {
  store.setIsEditing(true);
  console.log('Enter edit mode');
};

/**
 * 保存用户信息编辑
 * @param store - Profile store 实例
 * @param userInfo - 更新后的用户信息
 */
export const handleSaveEdit = (
  store: ReturnType<typeof useProfileStore>,
  userInfo: Partial<UserInfo>,
): void => {
  store.updateUserInfo(userInfo);
  store.setIsEditing(false);
  Toast.show({
    icon: 'success',
    content: '保存成功',
  });
  console.log('User info updated:', userInfo);
};

/**
 * 取消编辑
 * @param store - Profile store 实例
 */
export const handleCancelEdit = (
  store: ReturnType<typeof useProfileStore>,
): void => {
  store.setIsEditing(false);
};

/**
 * 处理菜单项点击
 * @description 使用柯里化，在组件顶层获取 navigate
 */
export const useHandleMenuItemClick = () => {
  const navigate = useNavigate();
  return (menu: MenuItem): void => {
    console.log('Navigate to menu:', menu.id);

    if (menu.path) {
      navigate(menu.path);
    }
  };
};

/**
 * 处理设置点击
 */
export const handleSettingsClick = (): void => {
  console.log('Navigate to settings');
  // TODO: 跳转到设置页面
};

/**
 * 处理退出登录
 * @description 使用柯里化，在组件顶层获取 navigate
 */
export const useHandleSignOut = () => {
  const navigate = useNavigate();
  return (store: ReturnType<typeof useProfileStore>): void => {
    console.log('Sign out user');
    store.clearUserInfo();
    // TODO: 清除本地存储的 token 等信息
    Toast.show({
      icon: 'success',
      content: '已退出登录',
    });
    // 跳转到登录页
    navigate('/login');
  };
};

/**
 * 加载用户信息
 * @param store - Profile store 实例
 */
export const fetchUserInfo = (
  store: ReturnType<typeof useProfileStore>,
): void => {
  store.setLoading(true);
  try {
    // TODO: 调用 API 获取用户信息
    // const response = await userApi.getUserInfo();
    // store.setUserInfo(response);
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
  store: ReturnType<typeof useProfileStore>,
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
  store: ReturnType<typeof useProfileStore>,
  menuId: string,
  badge: number | undefined,
): void => {
  store.updateMenuItemBadge(menuId, badge);
};
