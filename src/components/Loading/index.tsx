import React from 'react';
import classNames from 'classnames';
import { LoadingConst } from './constant';
import styles from './index.module.scss';

interface LoadingProps {
  tip?: string;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  /** 是否是全屏加载 */
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  tip = LoadingConst.DEFAULT_TIP,
  size = LoadingConst.SIZE.LARGE,
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
