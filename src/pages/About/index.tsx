/**
 * 关于我们页面
 * @description 显示应用信息、介绍和联系方式
 */
import React from 'react';
import { useObserver } from 'mobx-react';
import styles from './index.module.scss';
import useAboutStore from './useStore';
import { Header, Description, Features, Links, Footer } from './components';

/**
 * 关于我们页面
 */
const About: React.FC = () => {
  const store = useAboutStore();

  const handleLinkClick = (id: string): void => {
    // 这里可以根据 id 处理不同的跳转逻辑
    console.log('Link clicked:', id);
  };

  return useObserver(() => {
    return (
      <div className={styles.container}>
        <Header appName={store.appName} version={store.version} />
        <Description description={store.description} />
        <Features features={store.features} />
        <Links links={store.links} onLinkClick={handleLinkClick} />
        <Footer copyright={store.copyright} />
      </div>
    );
  });
};

About.displayName = 'About';

export default About;
