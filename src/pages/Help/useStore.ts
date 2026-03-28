import { useLocalObservable } from 'mobx-react';
import { FAQ_LIST, CONTACT_INFO, APP_VERSION, type FAQItem } from './constant';

export interface HelpStoreType {
  faqList: FAQItem[];
  contactInfo: {
    email: string;
    phone: string;
    workingHours: string;
  };
  appVersion: {
    version: string;
    buildDate: string;
    updateDate: string;
  };
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
}

export const useHelpStore = (): HelpStoreType => {
  const store = useLocalObservable<HelpStoreType>(() => ({
    faqList: FAQ_LIST,
    contactInfo: CONTACT_INFO,
    appVersion: APP_VERSION,
    activeKey: null,

    setActiveKey: (key: string | null): void => {
      store.activeKey = key;
    },
  }));

  return store;
};
