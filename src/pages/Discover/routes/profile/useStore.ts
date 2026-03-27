import { useLocalObservable } from 'mobx-react';

/**
 * 用户统计数据
 */
export interface UserStats {
  followers: number;
  following: number;
  likes: string;
}

/**
 * 用户信息
 */
export interface UserInfo {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  stats: UserStats;
}

/**
 * Profile 页面 Store 类型定义
 */
export interface ProfileStoreType {
  /** 用户信息 */
  userInfo: UserInfo;
  /** 加载状态 */
  loading: boolean;

  /** 设置加载状态 */
  setLoading: (state: boolean) => void;
}

type UseProfileStoreType = () => ProfileStoreType;

/**
 * Profile 页面 Store Hook
 */
const useProfileStore: UseProfileStoreType = () => {
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
  }));

  return store;
};

export default useProfileStore;
