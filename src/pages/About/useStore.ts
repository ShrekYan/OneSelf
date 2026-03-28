import { useLocalObservable } from 'mobx-react';
import { FEATURES, LINKS, APP_INFO, type Feature, type Link } from './constant';

export interface AboutStoreType {
  appName: string;
  version: string;
  description: string;
  copyright: string;
  features: Feature[];
  links: Link[];
}

export const useAboutStore = (): AboutStoreType => {
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
