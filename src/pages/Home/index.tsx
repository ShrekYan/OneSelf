import React from 'react';
import { Button, Toast, Space } from 'antd-mobile';
import { useObserver } from 'mobx-react';
import useStore from './useStore';
import { useEffectOnce } from 'react-use';
import { HomeConst, FeatureList, CommandList } from './constant';
import { formatCommand, navigateTo } from './handle';
import style from './index.module.scss';

const Home: React.FC = () => {
  const store = useStore();

  useEffectOnce(() => {
    console.log('Home 页面初始化');
  });

  const handleTestClick = async () => {
    await store.handleTestClick();
    Toast.show({
      icon: 'success',
      content: '加载完成！',
    });
  };

  return useObserver(() => {
    return (
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.icon}>🏠</div>
          <h1>{HomeConst.TITLE}</h1>
        </div>

        <div className={style.content}>
          <div className={style.card}>
            <h2>技术特性</h2>
            <ul className={style.features}>
              {FeatureList.map((feature, index) => (
                <li key={index}>
                  <span className={style.featureIcon}>{feature.icon}</span>
                  <span className={style.featureText}>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={style.card}>
            <h2>开发命令</h2>
            <div className={style.commandList}>
              {CommandList.map((cmd, index) => (
                <div key={index} className={style.codeBlock}>
                  <div className={style.command}>
                    {formatCommand(cmd.command)}
                  </div>
                  <div className={style.description}>{cmd.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={style.card}>
            <Space block>
              <Button
                color="primary"
                size="large"
                loading={store.testLoading}
                onClick={handleTestClick}
              >
                测试加载状态
              </Button>
              <Button size="large" onClick={() => navigateTo('/about')}>
                跳转到关于页面
              </Button>
            </Space>
          </div>
        </div>
      </div>
    );
  });
};

export default Home;
