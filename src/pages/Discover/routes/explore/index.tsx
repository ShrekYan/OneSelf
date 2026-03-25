/**
 * Explore 探索页面
 * @description 探索发现页面，待开发，目前为占位组件
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';

/**
 * Explore 探索页面
 */
const Explore: React.FC = () => {
  return useObserver(() => (
    <div className={styles.container}>
      <p className={styles.text}>Explore - Coming Soon</p>
    </div>
  ));
};

export default Explore;
