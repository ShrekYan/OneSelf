import { useLocalObservable } from 'mobx-react';
import { FEATURES, LINKS, APP_INFO } from './mock';
import type { Feature, Link } from './types';

export interface AboutStoreType {
  appName: string;
  version: string;
  description: string;
  copyright: string;
  features: Feature[];
  links: Link[];
}

type UseAboutStoreType = () => AboutStoreType;

const useAboutStore: UseAboutStoreType = () => {
  const store = useLocalObservable<AboutStoreType>(() => ({
    appName: APP_INFO.name,
    version: APP_INFO.version,
    description: APP_INFO.description,
    copyright: APP_INFO.copyright,
    features: FEATURES,
    links: LINKS,
  }));

  return store;
};

export default useAboutStore;
