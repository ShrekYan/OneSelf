/**
 * Profile 个人页面
 * @description 个人中心页面，待开发，目前为占位组件
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';

/**
 * Profile 个人页面
 */
const Profile: React.FC = () => {
  return useObserver(() => (
    <div className={styles.container}>
      <p className={styles.text}>Profile - Coming Soon</p>
    </div>
  ));
};

export default Profile;
