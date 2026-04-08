import React from 'react';
import { useAppHistory } from '@/hooks/useAppHistory';

export interface AppHistoryProviderProps {
  children: React.ReactNode;
  /** 判断路径是否应该跳过不入栈 */
  shouldSkip?: (pathname: string) => boolean;
}

/**
 * 应用历史栈同步提供者
 * 放在 App 根组件，启动自动同步
 */
export const AppHistoryProvider: React.FC<AppHistoryProviderProps> = ({
  children,
  shouldSkip,
}) => {
  useAppHistory({ shouldSkip });
  return <>{children}</>;
};
