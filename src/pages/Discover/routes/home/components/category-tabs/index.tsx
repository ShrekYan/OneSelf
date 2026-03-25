import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export interface CategoryTab {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  tabs?: CategoryTab[];
  defaultSelectedId?: string;
  onTabChange?: (tabId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  tabs = [
    { id: 'for-you', name: 'For You' },
    { id: 'following', name: 'Following' },
    { id: 'design', name: 'Design' },
    { id: 'tech', name: 'Tech' },
    { id: 'culture', name: 'Culture' },
  ],
  defaultSelectedId = 'for-you',
  onTabChange,
}) => {
  const [selectedId, setSelectedId] = useState(defaultSelectedId);

  const handleTabClick = (tabId: string) => {
    setSelectedId(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabsScrollContainer}>
        <div className={styles.tabsList}>
          {tabs.map(tab => {
            const isSelected = tab.id === selectedId;
            return (
              <button
                key={tab.id}
                className={classNames(
                  styles.tab,
                  isSelected && styles.selected,
                )}
                onClick={() => handleTabClick(tab.id)}
                type="button"
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
