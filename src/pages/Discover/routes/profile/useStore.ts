import { useLocalObservable } from 'mobx-react';

/**
 * 用户统计数据
 */
export type UserStats = {
  followers: number;
  following: number;
  likes: string;
};

/**
 * 用户信息
 */
export type UserInfo = {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  stats: UserStats;
};

/**
 * Profile 页面 Store 类型定义
 */
export type ProfileStoreType = {
  /** 用户信息 */
  userInfo: UserInfo;
  /** 加载状态 */
  loading: boolean;

  /** 设置加载状态 */
  setLoading: (state: boolean) => void;

  /** 获取用户信息 */
  fetchUserInfo: () => Promise<void>;
};

/**
 * Profile 页面 Store Hook
 */
export function useProfileStore(): ProfileStoreType {
  const store = useLocalObservable<ProfileStoreType>(() => ({
    userInfo: {
      name: 'John Maker',
      username: '@johnmaker',
      bio: 'Frontend engineer, UI designer, and tech enthusiast. I write about modern web dev.',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
      stats: {
        followers: 248,
        following: 156,
        likes: '12.4k',
      },
    },

    loading: false,

    setLoading(state: boolean) {
      this.loading = state;
    },

    async fetchUserInfo(): Promise<void> {
      this.setLoading(true);
      await Promise.resolve();
      // 模拟网络延迟
      try {
        // TODO: 调用 API 获取用户信息
        // const data = await api.user.getProfile();
        // this.userInfo = data;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        this.setLoading(false);
      }
    },
  }));

  return store;
}
