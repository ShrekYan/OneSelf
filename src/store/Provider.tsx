import React from 'react';
import { useLocalObservable } from 'mobx-react';
import { RootStore } from './RootStore';
import useMobxStore from './AppStore';
import { rootStoreContext } from './context';

export interface GlobalStoreProviderProps {
  children: React.ReactNode;
}

export function GlobalStoreProvider({ children }: GlobalStoreProviderProps) {
  const appStore = useMobxStore();

  const rootStore = useLocalObservable(() => {
    const store = new RootStore();
    store.init(appStore);
    return store;
  });

  return (
    <rootStoreContext.Provider value={rootStore}>
      {children}
    </rootStoreContext.Provider>
  );
}
