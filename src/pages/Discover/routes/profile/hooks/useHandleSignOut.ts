import { useNavigate } from 'react-router-dom';
import { Dialog } from 'antd-mobile';
import { userApi } from '@/api';

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
