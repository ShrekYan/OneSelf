/**
 * 404 未找到页面
 * @description 用户访问不存在路由时展示的错误页面，提供返回上页和回到首页操作
 */
import React from 'react';
import { Button, Space } from 'antd-mobile';
import { useObserver } from 'mobx-react';

import { NotFoundConst } from './constant';
import { useNotFoundStore } from './useStore';
import { useNavigateBack, useNavigateToHome } from './hooks/useNavigation';
import styles from './index.module.scss';

/**
 * 404 未找到页面组件
 */
const NotFound: React.FC = () => {
  const store = useNotFoundStore();
  const handleNavigateBack = useNavigateBack();
  const handleNavigateToHome = useNavigateToHome();

  return useObserver(() => (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.notFoundIcon}>
          {NotFoundConst.ERROR_ICONS.NOT_FOUND}
        </div>
        <h1 className={styles.notFoundErrorCode}>{store.errorCode}</h1>
        <p className={styles.notFoundErrorTitle}>{store.errorTitle}</p>
        <p className={styles.notFoundErrorMessage}>{store.errorMessage}</p>

        <Space block className={styles.notFoundButtonGroup}>
          <Button color="primary" size="large" onClick={handleNavigateBack}>
            {store.backButtonText}
          </Button>
          <Button size="large" onClick={handleNavigateToHome}>
            {store.homeButtonText}
          </Button>
        </Space>
      </div>
    </div>
  ));
};

NotFound.displayName = 'NotFound';

export default NotFound;
