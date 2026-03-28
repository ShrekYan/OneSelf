import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

const DEFAULT_TIP = '加载中...';

type LoadingSize = 'small' | 'middle' | 'large';

interface LoadingProps {
  tip?: string;
  size?: LoadingSize;
  className?: string;
  /** 是否是全屏加载 */
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  tip = DEFAULT_TIP,
  size = 'large',
  className,
  fullScreen = true,
}) => {
  return (
    <div
      className={classNames(
        styles.loadingRoot,
        fullScreen && styles.fullScreen,
        className,
      )}
    >
      <div className={styles.content}>
        <div className={classNames(styles.spinner, styles[size])} />
        {tip && <div className={styles.tip}>{tip}</div>}
      </div>
    </div>
  );
};

export default Loading;
export type { LoadingProps };
