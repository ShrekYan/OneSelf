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
