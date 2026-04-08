import { useNavigate } from 'react-router-dom';
import { appGoBack } from './useAppHistory';

export interface UseAppGoBackOptions {
  /** 已经是最后一页时的回调（可用于关闭网页） */
  onLastPage?: () => void | Promise<void>;
}

/**
 * 应用层返回 Hook
 * @example
 * const handleGoBack = useAppGoBack({
 *   onLastPage: () => {
 *     // 微信 H5 关闭网页
 *     (window as any).WeixinJSBridge?.invoke('closeWindow');
 *   }
 * });
 */
export function useAppGoBack(options: UseAppGoBackOptions = {}) {
  const { onLastPage } = options;
  const navigate = useNavigate();
  return () => appGoBack(navigate, onLastPage);
}
