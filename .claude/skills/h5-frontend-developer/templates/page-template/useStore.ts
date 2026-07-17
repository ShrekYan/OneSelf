import { useLocalObservable } from 'mobx-react';
import { FEATURES } from './mock';
import type { Feature, Link } from './types';

export interface PageStoreType {
  title: string;
  features: Feature[];
  links: Link[];
}

type UsePageStoreType = () => PageStoreType;

const usePageStore: UsePageStoreType = () => {
  const store = useLocalObservable<PageStoreType>(() => ({
    title: '',
    features: FEATURES,
    links: [],
  }));

  return store;
};

export default usePageStore;