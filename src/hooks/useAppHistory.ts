import { useEffect } from 'react';
import {
  useLocation,
  useNavigationType,
  NavigationType,
  useNavigate,
} from 'react-router-dom';
import { historyStackStore } from '@/store';
import type { HistoryStackItem } from '@/types/app-history';

export interface UseAppHistoryOptions {
  /** 判断路径是否应该跳过不入栈 */
  shouldSkip?: (pathname: string) => boolean;
}

/**
 * 自动同步路由到应用历史栈
 */
export function useAppHistory(options: UseAppHistoryOptions = {}): void {
  const location = useLocation();
  const navigationType = useNavigationType();
  const shouldSkip = options.shouldSkip ?? (() => false);

  useEffect(() => {
    const item: HistoryStackItem = {
      pathname: location.pathname,
      search: location.search,
      key: location.key,
    };

    // 跳过配置的页面
    if (shouldSkip(location.pathname)) {
      return;
    }

    switch (navigationType) {
      case NavigationType.Push:
        historyStackStore.push(item);
        break;
      case NavigationType.Replace:
        historyStackStore.replace(item);
        break;
      case NavigationType.Pop: {
        // 浏览器后退/前进，根据 key 找到正确位置同步索引
        const foundIndex = historyStackStore.stack.findIndex(
          i => i.key === location.key,
        );
        if (foundIndex !== -1) {
          historyStackStore.setIndex(foundIndex);
        }
        break;
      }
    }
  }, [location, navigationType, shouldSkip]);
}

/**
 * 应用层返回方法
 */
export function appGoBack(
  navigate: ReturnType<typeof useNavigate>,
  onLastPage?: () => void | Promise<void>,
): boolean {
  if (!historyStackStore.canGoBack) {
    // 已经是最后一页，调用回调处理退出
    onLastPage?.();
    return false;
  }

  // 应用层索引已经减一，让浏览器真正后退一步，保持两边同步
  historyStackStore.pop();
  navigate(-1);
  return true;
}
