import React from 'react';
import { Button, Space } from 'antd-mobile';
import { useObserver } from 'mobx-react';
import useStore from './useStore';
import { useEffectOnce } from 'react-use';
import { NotFoundConst } from './constant';
import { navigateBack, navigateToHome } from './handle';
import style from './index.module.scss';

const NotFound: React.FC = () => {
  const store = useStore();

  useEffectOnce(() => {
    console.log('NotFound 页面初始化');
  });

  return useObserver(() => (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.icon}>{NotFoundConst.ERROR_ICONS.NOT_FOUND}</div>
        <h1>{store.errorCode}</h1>
        <p className={style['error-title']}>{store.errorTitle}</p>
        <p className={style['error-message']}>{store.errorMessage}</p>

        <Space block>
          <Button color="primary" size="large" onClick={navigateBack}>
            {store.backButtonText}
          </Button>
          <Button size="large" onClick={navigateToHome}>
            {store.homeButtonText}
          </Button>
        </Space>
      </div>
    </div>
  ));
};

export default NotFound;
