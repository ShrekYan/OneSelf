import { useNavigate } from 'react-router-dom';
import { Dialog } from 'antd-mobile';
import { authApi } from '@/api';

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
        // ✅ Token 通过 HttpOnly Cookie 携带，后端登出接口会自动清除 Cookie
        // 兼容：从 localStorage 读取 refreshToken（旧登录用户）
        const refreshToken = localStorage.getItem('refreshToken');
        await authApi.logout(refreshToken ?? undefined);
        // 清除本地存储的用户信息（Token 由后端 Cookie 机制处理）
        sessionStorage.removeItem('userInfo');
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
