import { useNavigate } from 'react-router-dom';
import { Dialog } from 'antd-mobile';
import { userApi } from '@/api';
import type { ProfileStoreType } from './useStore';
import type { MenuItem } from './constant';

/**
 * 处理菜单项点击
 */
export const useHandleMenuItemClick = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (item: MenuItem) => {
    // TODO: 根据菜单项 ID 跳转到对应页面
    // 目前 navigate 变量保留用于未来跳转
    void navigate;
    switch (item.id) {
      case 'articles':
        // 跳转我的文章
        console.log('Navigate to My Articles');
        break;
      case 'saved':
        // 跳转收藏阅读
        console.log('Navigate to Saved Reading');
        break;
      case 'stats':
        // 跳转阅读统计
        console.log('Navigate to Reading Stats');
        break;
      case 'preferences':
        // 跳转偏好设置
        console.log('Navigate to Preferences');
        break;
      default:
        break;
    }
  };

  return handleMenuItemClick;
};

/**
 * 处理退出登录
 */
export const useHandleSignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const confirmed = await Dialog.confirm({
      title: 'Confirm Sign Out',
      content:
        'Are you sure you want to sign out? You will need to sign in again to access your personal account information after signing out.',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await userApi.signOut();
        // 清除本地存储的 token
        localStorage.removeItem('token');
        // 跳转到登录页面
        navigate('/login');
      } catch (error) {
        console.error('Sign out failed:', error);
        // Error is automatically handled by API interceptor with Toast prompt
      }
    }
  };

  return handleSignOut;
};

/**
 * 处理编辑头像点击
 */
export const handleEditAvatar = () => {
  // TODO: 打开头像编辑弹窗
  console.log('Edit avatar');
};

/**
 * 获取用户信息（如果需要从 API 拉取）
 */
export const fetchUserInfo = async (store: ProfileStoreType): Promise<void> => {
  store.setLoading(true);
  await Promise.resolve();
  // 模拟网络延迟
  try {
    // TODO: 调用 API 获取用户信息
    // const data = await api.user.getProfile();
    // store.userInfo = data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
  } finally {
    store.setLoading(false);
  }
};
