import React from 'react';
import { Button, Toast, Space } from 'antd-mobile';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';

import useStore from './useStore';
import { HOME_CONST, FeatureList, CommandList } from './constant';
import style from './index.module.scss';

/**
 * 首页 - 项目欢迎页面
 * @description 展示项目技术特性列表、开发命令，
 * 演示 MobX 异步加载状态管理和路由跳转
 */
const Home: React.FC = observer(() => {
  const store = useStore();
  const navigate = useNavigate();

  // 页面初始化只执行一次
  useEffectOnce(() => {
    if (process.env.NODE_ENV === 'development') {
      //console.log('Home 页面初始化');
    }
  });

  /**
   * 测试按钮点击处理
   * @description 调用 store 模拟异步加载，完成后显示 Toast 提示
   */
  const handleTestClick = async () => {
    try {
      await store.handleTestClick();
      Toast.show({
        icon: 'success',
        content: '加载完成！',
      });
    } catch {
      Toast.show({
        icon: 'fail',
        content: '操作失败，请重试',
      });
    }
  };

  return (
    <div className={style.container}>
      {/* 头部区域 - 显示图标和页面标题 */}
      <div className={style.header}>
        <div className={style.icon}>🏠</div>
        <h1>{HOME_CONST.TITLE}</h1>
      </div>

      {/* 内容区域 - 多个卡片容器 */}
      <div className={style.content}>
        {/* 技术特性卡片 - 展示项目技术栈特性列表 */}
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

        {/* 开发命令卡片 - 展示常用开发命令说明 */}
        <div className={style.card}>
          <h2>开发命令</h2>
          <div className={style.commandList}>
            {CommandList.map((cmd, index) => (
              <div key={index} className={style.codeBlock}>
                <div className={style.command}>{cmd.command}</div>
                <div className={style.description}>{cmd.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 操作按钮卡片 - 演示加载状态和路由跳转 */}
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
            <Button size="large" onClick={() => navigate('/about')}>
              跳转到关于页面
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
});

export default Home;
