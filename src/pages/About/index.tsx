import React from 'react';
import { NavBar, Button } from 'antd-mobile';
import { useObserver } from 'mobx-react';
import useStore from './useStore';
import { useEffectOnce } from 'react-use';
import { AboutConst } from './constant';
import { navigateBack } from './handle';
import styles from './index.module.scss';

const About: React.FC = () => {
  const store = useStore();

  useEffectOnce(() => {
    console.log('About 页面初始化');
  });

  return useObserver(() => (
    <div className={styles.container}>
      <NavBar left={<Button onClick={navigateBack}>返回</Button>}>
        {store.pageTitle}
      </NavBar>

      <div className={styles.content}>
        <div className={styles.card}>
          <h1>H5 前端脚手架</h1>
          <p className={styles.version}>版本: {store.versionInfo.version}</p>

          <div className={styles.infoSection}>
            <h2>📦 依赖库</h2>
            <div className={styles.libraries}>
              <div className={styles.library}>
                <div className={styles.name}>React</div>
                <div className={styles.version}>{store.versionInfo.react}</div>
              </div>
              <div className={styles.library}>
                <div className={styles.name}>TypeScript</div>
                <div className={styles.version}>
                  {store.versionInfo.typescript}
                </div>
              </div>
              <div className={styles.library}>
                <div className={styles.name}>Vite</div>
                <div className={styles.version}>{store.versionInfo.vite}</div>
              </div>
              <div className={styles.library}>
                <div className={styles.name}>Ant Design Mobile</div>
                <div className={styles.version}>{store.versionInfo.antd}</div>
              </div>
              <div className={styles.library}>
                <div className={styles.name}>MobX</div>
                <div className={styles.version}>{store.versionInfo.mobx}</div>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h2>🚀 功能特性</h2>
            <ul className={styles.features}>
              {AboutConst.FEATURES.map((feature, index) => (
                <li key={index}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <span className={styles.featureText}>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.infoSection}>
            <h2>🤝 开发团队</h2>
            <p className={styles.team}>{AboutConst.TEAM_INFO}</p>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default About;
