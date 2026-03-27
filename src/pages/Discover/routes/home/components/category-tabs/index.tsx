import React, { useState, useRef, useCallback } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const scrollTabToCenter = useCallback((tabId: string) => {
    const container = scrollContainerRef.current;
    const tab = tabRefs.current.get(tabId);

    if (!container || !tab) {
      return;
    }

    const containerWidth = container.clientWidth;
    const tabLeft = tab.offsetLeft;
    const tabWidth = tab.offsetWidth;

    // 计算公式：目标滚动位置 = tab相对于容器左偏移 - (容器可视宽度 / 2) + (tab自身宽度 / 2)
    let targetScrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;

    // 计算最大可滚动距离
    const maxScrollLeft = container.scrollWidth - containerWidth;

    // clamp 边界处理，确保滚动位置在合法范围内
    targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));

    // 平滑滚动到目标位置
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  }, []);

  const handleTabClick = (tabId: string) => {
    setSelectedId(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
    scrollTabToCenter(tabId);
  };

  return (
    <div className={styles.categoryTabsRoot}>
      <div ref={scrollContainerRef} className={styles.tabsScrollContainer}>
        <div className={styles.tabsList}>
          {tabs.map(tab => {
            const isSelected = tab.id === selectedId;
            return (
              <button
                key={tab.id}
                ref={el => {
                  if (el) {
                    tabRefs.current.set(tab.id, el);
                  } else {
                    tabRefs.current.delete(tab.id);
                  }
                }}
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
