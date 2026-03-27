import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';

/**
 * 用户信息接口
 */
export interface UserInfo {
  uid: string;
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
  const store = useLocalObservable<MobxStoreType>(() => ({
    isLoading: false,
    userInfo: null,
    token: '',

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
