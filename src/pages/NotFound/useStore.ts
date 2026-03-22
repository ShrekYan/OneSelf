import { useLocalObservable } from "mobx-react";

export interface MobxStoreType {
  errorCode: string;
  errorTitle: string;
  errorMessage: string;
  backButtonText: string;
  homeButtonText: string;
}

type UseMobxStoreType = () => MobxStoreType;

const useMobxStore: UseMobxStoreType = () => {
  const store = useLocalObservable<MobxStoreType>(() => ({
    errorCode: "404",
    errorTitle: "页面找不到了",
    errorMessage: "您访问的页面不存在或已被移动",
    backButtonText: "返回上页",
    homeButtonText: "回到首页"
  }));

  return store;
};

export default useMobxStore;
