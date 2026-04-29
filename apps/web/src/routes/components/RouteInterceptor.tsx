/**
 * 路由拦截器
 * - ✅ 权限认证检查：一次性调用接口验证登录状态
 * - 缓存清理策略（预留）
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore } from '@/store';
import { getCurrentUser, UserDto } from '@/api/auth';

/**
 * 路由配置信息，只需要 RouteConfig 的必要字段
 */
export interface RouteConfigInfo {
  path: string;
  pageName?: string;
  keepAlive?: boolean;
}

export interface RouteInterceptorProps {
  routeConfig: RouteConfigInfo;
  children: React.ReactElement;
}

/**
 * 需要认证的路由前缀
 * 所有以这些路径开头的路由都需要登录才能访问
 */
const AUTH_REQUIRED_PATHS = [
  '/profile',
  '/settings',
  '/article/edit',
  '/publish',
];

/**
 * 路由拦截器
 * 🎯 无 observer，纯本地状态管理
 * 🎯 一次性认证检查，认证完成前不渲染子组件
 */
export const RouteInterceptor: React.FC<RouteInterceptorProps> = ({
  routeConfig,
  children,
}) => {
  const rootStore = useGlobalStore();
  const app = rootStore.app;
  const navigate = useNavigate();

  /**
   * 认证状态（完全本地管理，不依赖 MobX 响应式）
   */
  const [authState, setAuthState] = useState<{
    status: 'idle' | 'pending' | 'authenticated' | 'unauthenticated';
  }>({ status: 'idle' });

  /**
   * 检查当前路由是否需要认证
   */
  const needAuth = AUTH_REQUIRED_PATHS.some((path) =>
    routeConfig.path.startsWith(path)
  );

  /**
   * ✅ 一次性认证检查
   * 无 observer，纯 useEffect + useState
   */
  useEffect(() => {
    // 不需要认证的路由，直接跳过
    if (!needAuth) return;

    // 防止组件卸载后 setState 导致警告
    let isMounted = true;

    const checkAuth = async () => {
      // 🟡 第一步：检查 sessionStorage 缓存优化性能
      // 注意：这只是性能优化，接口验证才是真正的认证依据
      const cachedUserInfo = sessionStorage.getItem('userInfo');
      if (cachedUserInfo) {
        try {
          app.setUserInfo(JSON.parse(cachedUserInfo) as UserDto as Parameters<typeof app.setUserInfo>[0]);
          if (isMounted) {
            setAuthState({ status: 'authenticated' });
          }
          return;
        } catch {
          // 解析失败，清理无效缓存，继续走接口验证
          sessionStorage.removeItem('userInfo');
        }
      }

      // ✅ 第二步：无缓存 → 调用后端接口验证（Cookie 自动携带）
      if (isMounted) {
        setAuthState({ status: 'pending' });
      }

      try {
        const userInfo = await getCurrentUser();
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        app.setUserInfo(userInfo as Parameters<typeof app.setUserInfo>[0]);
        if (isMounted) {
          setAuthState({ status: 'authenticated' });
        }
      } catch {
        console.warn('认证检查失败，跳转登录页');
        // Token 验证失败，清理无效缓存
        sessionStorage.removeItem('userInfo');
        if (isMounted) {
          setAuthState({ status: 'unauthenticated' });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [needAuth, app]);

  // 不需要认证 → 直接渲染
  if (!needAuth) {
    return children;
  }

  // 🛡️ 状态 1：认证中 / 未开始 → 显示 Loading，不渲染子组件
  if (authState.status === 'idle' || authState.status === 'pending') {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        正在验证登录状态...
      </div>
    );
  }

  // 🛡️ 状态 2：未认证 → 跳转登录页
  if (authState.status === 'unauthenticated') {
    const redirect = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    navigate(`/login?redirect=${redirect}`, { replace: true });
    return null;
  }

  // ✅ 状态 3：已认证 → 正常渲染子组件
  // 走到这里时，app.userInfo 已设置完成
  return children;
};
