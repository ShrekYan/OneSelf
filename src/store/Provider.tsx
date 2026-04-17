import React from 'react';
import { useLocalObservable } from 'mobx-react';
import { RootStore } from './RootStore';
import useMobxStore from './AppStore';
import { rootStoreContext } from './context';
import { setRootStore } from './index';

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

  // 保存全局单例引用，供非 React 环境（如 API 拦截器）访问
  setRootStore(rootStore);

  return (
    <rootStoreContext.Provider value={rootStore}>
      {children}
    </rootStoreContext.Provider>
  );
}
