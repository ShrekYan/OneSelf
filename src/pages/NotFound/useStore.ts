import { useLocalObservable } from 'mobx-react';

/**
 * NotFound 页面 Store 类型定义
 */
export type NotFoundStoreType = {
  errorCode: string;
  errorTitle: string;
  errorMessage: string;
  backButtonText: string;
  homeButtonText: string;
};

/**
 * NotFound 页面局部状态 Store
 * 使用 MobX useLocalObservable 管理局部状态
 */
export function useNotFoundStore(): NotFoundStoreType {
  const store = useLocalObservable<NotFoundStoreType>(() => ({
    errorCode: '404',
    errorTitle: 'Page Not Found',
    errorMessage:
      'The page you are looking for does not exist or has been moved',
    backButtonText: 'Go Back',
    homeButtonText: 'Back to Home',
  }));

  return store;
}
