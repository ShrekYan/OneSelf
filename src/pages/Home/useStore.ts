import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react";

export interface MobxStoreType {
  testLoading: boolean;
  setTestLoading: (value: boolean) => void;
  handleTestClick: () => Promise<void>;
}

type UseMobxStoreType = () => MobxStoreType;

const useMobxStore: UseMobxStoreType = () => {
  const store = useLocalObservable<MobxStoreType>(() => ({
    testLoading: false,

    setTestLoading(value: boolean) {
      runInAction(() => {
        store.testLoading = value;
      });
    },

    async handleTestClick() {
      store.setTestLoading(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        runInAction(() => {
          store.setTestLoading(false);
        });
      } catch (e) {
        console.log(e);
        runInAction(() => {
          store.setTestLoading(false);
        });
      }
    }
  }));

  return store;
};

export default useMobxStore;
