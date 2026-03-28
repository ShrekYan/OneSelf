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
    errorTitle: '页面找不到了',
    errorMessage: '您访问的页面不存在或已被移动',
    backButtonText: '返回上页',
    homeButtonText: '回到首页',
  }));

  return store;
}
