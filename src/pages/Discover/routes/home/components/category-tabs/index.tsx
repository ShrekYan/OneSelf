/**
 * 分类标签栏组件
 * 水平滚动的分类标签列表，支持切换高亮
 */

import React from 'react';
import { useObserver } from 'mobx-react';
import { CATEGORY_TABS } from '../../constant';
import useStore from '../../useStore';
import classNames from 'classnames';
import styles from './index.module.scss';

/**
 * 分类标签栏组件
 * 显示可横向滚动的分类标签，支持点击切换
 */
export const CategoryTabs = React.memo(() => {
  const store = useStore();

  const handleTabClick = (tabId: string) => {
    store.setActiveCategoryId(tabId);
  };

  return useObserver(() => (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.id}
            className={classNames(
              styles.tabItem,
              tab.id === store.activeCategoryId && styles.active,
            )}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  ));
});

export default CategoryTabs;
