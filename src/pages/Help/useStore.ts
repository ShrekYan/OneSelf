import { useLocalObservable } from 'mobx-react';
import { FAQ_LIST, CONTACT_INFO } from './constant';
import type { FAQItem } from './constant';

export interface HelpStoreType {
  faqList: FAQItem[];
  contactInfo: {
    email: string;
    phone: string;
    workingHours: string;
  };
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
}

type UseHelpStoreType = () => HelpStoreType;

const useHelpStore: UseHelpStoreType = () => {
  const store = useLocalObservable<HelpStoreType>(() => ({
    faqList: FAQ_LIST,
    contactInfo: CONTACT_INFO,
    activeKey: null,

    setActiveKey: (key: string | null): void => {
      store.activeKey = key;
    },
  }));

  return store;
};

export default useHelpStore;
