import { useContext } from 'react';
import type { RootStore } from './RootStore';
import type { MobxStoreType as AppStoreType } from './AppStore';
import { HistoryStackStore } from './HistoryStackStore';
import { rootStoreContext } from './context';
import { GlobalStoreProvider } from './Provider';

export { RootStore } from './RootStore';
export type { AppStoreType };
export { GlobalStoreProvider };
export { HistoryStackStore };

/** 全局应用历史栈实例 */
export const historyStackStore = new HistoryStackStore();

export function useGlobalStore(): RootStore {
  const store = useContext(rootStoreContext);
  if (!store) {
    throw new Error('useGlobalStore must be used within GlobalStoreProvider');
  }
  return store;
}

// 保存全局 RootStore 单例，供非 React 环境访问
let rootStoreInstance: RootStore | null = null;

/**
 * 设置 RootStore 实例（由 GlobalStoreProvider 在初始化时调用）
 */
export function setRootStore(store: RootStore) {
  rootStoreInstance = store;
}

/**
 * 获取全局 RootStore 实例
 */
export function getRootStore(): RootStore | null {
  return rootStoreInstance;
}
