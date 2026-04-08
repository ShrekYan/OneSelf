import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  [key: string]: unknown;
}

export interface MobxStoreType {
  isLoading: boolean;
  userInfo: UserInfo | null;
  token: string;
  setLoading: (value: boolean) => void;
  setUserInfo: (info: UserInfo | null) => void;
  setToken: (token: string) => void;
  reset: () => void;
}

type UseMobxStoreType = () => MobxStoreType;

const useMobxStore: UseMobxStoreType = () => {
  // 初始化时从 localStorage 恢复已保存的用户信息
  const initialUserInfo = ((): UserInfo | null => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (!stored) return null;
      return JSON.parse(stored) as UserInfo;
    } catch {
      return null;
    }
  })();

  const initialToken = ((): string => {
    try {
      return localStorage.getItem('accessToken') || '';
    } catch {
      return '';
    }
  })();

  const store = useLocalObservable<MobxStoreType>(() => ({
    isLoading: false,
    userInfo: initialUserInfo,
    token: initialToken,

    setLoading(value: boolean) {
      runInAction(() => {
        store.isLoading = value;
      });
    },

    setUserInfo(info: UserInfo | null) {
      runInAction(() => {
        store.userInfo = info;
      });
    },

    setToken(token: string) {
      runInAction(() => {
        store.token = token;
      });
    },

    reset() {
      runInAction(() => {
        store.isLoading = false;
        store.userInfo = null;
        store.token = '';
      });
    },
  }));

  return store;
};

export default useMobxStore;
