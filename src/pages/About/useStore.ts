import { useLocalObservable } from "mobx-react";

export interface MobxStoreType {
  pageTitle: string;
  versionInfo: {
    version: string;
    react: string;
    typescript: string;
    vite: string;
    antd: string;
    mobx: string;
  };
}

type UseMobxStoreType = () => MobxStoreType;

const useMobxStore: UseMobxStoreType = () => {
  const store = useLocalObservable<MobxStoreType>(() => ({
    pageTitle: "H5 前端脚手架 - 关于",
    versionInfo: {
      version: "1.0.0",
      react: "19.2.3",
      typescript: "5.5.3",
      vite: "7.3.1",
      antd: "5.42.3",
      mobx: "6.13.5"
    }
  }));

  return store;
};

export default useMobxStore;
