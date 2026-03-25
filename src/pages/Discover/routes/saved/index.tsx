/**
 * Saved 收藏页面
 * @description 我的收藏页面，待开发，目前为占位组件
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';

/**
 * Saved 收藏页面
 */
const Saved: React.FC = () => {
  return useObserver(() => (
    <div className={styles.container}>
      <p className={styles.text}>Saved - Coming Soon</p>
    </div>
  ));
};

export default Saved;
