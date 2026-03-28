/**
 * 关于我们页面
 * @description 显示应用信息、介绍和联系方式
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';
import { useAboutStore } from './useStore';
import * as handle from './handle';
import { Header, Description, Features, Links, Footer } from './components';

import type { Link } from './constant';

/**
 * 关于我们页面
 */
const About: React.FC = () => {
  const store = useAboutStore();

  const onLinkClick = (link: Link): void => {
    handle.handleLinkClick(link);
  };

  return useObserver(() => {
    return (
      <div className={styles.aboutContainer}>
        <Header appName={store.appName} version={store.version} />
        <Description description={store.description} />
        <Features features={store.features} />
        <Links links={store.links} onLinkClick={onLinkClick} />
        <Footer copyright={store.copyright} />
      </div>
    );
  });
};

About.displayName = 'About';

export default About;
