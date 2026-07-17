import { useLocalObservable } from 'mobx-react';

export interface StoreItem {
  id: string;
}

export interface StoreType {
  data: StoreItem[];
  loading: boolean;
  error: string | null;
}

type UseStoreType = () => StoreType;

const useStore: UseStoreType = () => {
  const store = useLocalObservable<StoreType>(() => ({
    data: [],
    loading: false,
    error: null,
  }));

  return store;
};

export default useStore;