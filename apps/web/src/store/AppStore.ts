import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';
import { secureSessionStorage } from '@/utils/secure-storage';

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
  setLoading: (value: boolean) => void;
  setUserInfo: (info: UserInfo | null) => void;
  reset: () => void;
}

type UseMobxStoreType = () => MobxStoreType;

const useMobxStore: UseMobxStoreType = () => {
  // 初始化时从 sessionStorage 恢复已保存的用户信息
  // ✅ sessionStorage 在浏览器关闭时自动清除，避免用户信息泄露风险
  const initialUserInfo = secureSessionStorage.get<UserInfo>('userInfo');

  const store = useLocalObservable<MobxStoreType>(() => ({
    isLoading: false,
    userInfo: initialUserInfo,

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

    reset() {
      runInAction(() => {
        store.isLoading = false;
        store.userInfo = null;
      });
    },
  }));

  return store;
};

export default useMobxStore;
