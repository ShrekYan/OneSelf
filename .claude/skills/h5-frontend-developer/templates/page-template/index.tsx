import React from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';
import usePageStore from './useStore';
import { ComponentA, ComponentB } from './components';

const PageName: React.FC = () => {
  const store = usePageStore();

  const handleItemClick = (id: string): void => {
    console.log('Item clicked:', id);
  };

  return useObserver(() => (
    <div className={styles.pageNameContainer}>
      <ComponentA title={store.title} />
      <ComponentB data={store.list} onItemClick={handleItemClick} />
    </div>
  ));
};

PageName.displayName = 'PageName';

export default PageName;