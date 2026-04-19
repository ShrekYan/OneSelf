/**
 * 404 Not Found Page
 * @description Error page displayed when user visits a non-existent route, provides return to home action
 */
import React from 'react';
import { Button } from 'antd-mobile';
import { useObserver } from 'mobx-react';
import NotFoundIllustration from '@/assets/icons/404-illustration.svg?react';

import { useNotFoundStore } from './useStore';
import { useNavigateToHome } from './hooks/useNavigation';
import styles from './index.module.scss';

/**
 * 404 Not Found Page Component
 */
const NotFound: React.FC = () => {
  const store = useNotFoundStore();
  const handleNavigateToHome = useNavigateToHome();

  return useObserver(() => (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.notFoundIllustration}>
          <NotFoundIllustration className={styles.illustrationSvg} />
        </div>
        <h1 className={styles.notFoundTitle}>{store.errorTitle}</h1>
        <p className={styles.notFoundDescription}>{store.errorMessage}</p>

        <div className={styles.notFoundButtonWrapper}>
          <Button
            block
            color="primary"
            size="large"
            onClick={handleNavigateToHome}
            className={styles.backToHomeButton}
          >
            {store.homeButtonText}
          </Button>
        </div>
      </div>
    </div>
  ));
};

NotFound.displayName = 'NotFound';

export default NotFound;
