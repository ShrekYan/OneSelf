import { useContext } from 'react';
import type { RootStore } from './RootStore';
import type { MobxStoreType as AppStoreType } from './AppStore';
import { rootStoreContext } from './context';
import { GlobalStoreProvider } from './Provider';

export { RootStore } from './RootStore';
export type { AppStoreType };
export { GlobalStoreProvider };

export function useGlobalStore(): RootStore {
  const store = useContext(rootStoreContext);
  if (!store) {
    throw new Error('useGlobalStore must be used within GlobalStoreProvider');
  }
  return store;
}
