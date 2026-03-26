/**
 * Profile 个人中心模块状态管理
 * @description 使用 MobX 管理用户信息、菜单等状态
 */

import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';

import type { MenuItem } from './constant';

export interface UserStats {
  followers: number;
  following: number;
  totalLikes: number;
}

export interface UserInfo {
  userName: string;
  userHandle: string;
  userBio: string;
  avatarUrl: string;
  stats: UserStats;
}

export interface ProfileStoreType {
  /** 用户信息 */
  userInfo: UserInfo | null;
  /** 菜单项列表 */
  menuItems: MenuItem[];
  /** 加载状态 */
  loading: boolean;
  /** 是否正在编辑 */
  isEditing: boolean;

  /** 设置用户信息 */
  setUserInfo: (userInfo: UserInfo) => void;
  /** 更新部分用户信息 */
  updateUserInfo: (partial: Partial<UserInfo>) => void;
  /** 设置菜单项 */
  setMenuItems: (items: MenuItem[]) => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置编辑状态 */
  setIsEditing: (editing: boolean) => void;
  /** 更新徽章数 */
  updateMenuItemBadge: (menuId: string, badge: number | undefined) => void;
  /** 清空用户信息（退出登录） */
  clearUserInfo: () => void;
}

type UseProfileStoreType = () => ProfileStoreType;

const useProfileStore: UseProfileStoreType = () => {
  const store = useLocalObservable<ProfileStoreType>(() => ({
    userInfo: null,
    menuItems: [],
    loading: false,
    isEditing: false,

    setUserInfo(userInfo: UserInfo) {
      runInAction(() => {
        store.userInfo = userInfo;
      });
    },

    updateUserInfo(partial: Partial<UserInfo>) {
      runInAction(() => {
        if (store.userInfo) {
          store.userInfo = { ...store.userInfo, ...partial };
        }
      });
    },

    setMenuItems(items: MenuItem[]) {
      runInAction(() => {
        store.menuItems = items;
      });
    },

    setLoading(loading: boolean) {
      runInAction(() => {
        store.loading = loading;
      });
    },

    setIsEditing(editing: boolean) {
      runInAction(() => {
        store.isEditing = editing;
      });
    },

    updateMenuItemBadge(menuId: string, badge: number | undefined) {
      runInAction(() => {
        const index = store.menuItems.findIndex(item => item.id === menuId);
        if (index !== -1) {
          store.menuItems[index] = {
            ...store.menuItems[index],
            badge,
          };
        }
      });
    },

    clearUserInfo() {
      runInAction(() => {
        store.userInfo = null;
      });
    },
  }));

  return store;
};

export default useProfileStore;
