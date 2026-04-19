import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalStoreProvider } from '@/store';
import { AliveScope } from 'react-activation';
import { AppHistoryProvider } from '@/routes/components/AppHistoryProvider';
import { AppRouter } from '@/routes';
import ErrorFallback from './components/ErrorFallback';
import Loading from './components/Loading';
import './styles/global.scss';

const App: React.FC = () => {
  const [isLoading] = useState(false);

  return (
    <GlobalStoreProvider>
      <div className="app-container">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {isLoading && <Loading tip="loading..." />}
          <div className="app-content">
            <AppHistoryProvider
              shouldSkip={pathname => {
                // 默认跳过登录相关页面不入应用历史栈
                return ['/login', '/register', '/forgot-password'].includes(
                  pathname,
                );
              }}
            >
              <AliveScope>
                <AppRouter />
              </AliveScope>
            </AppHistoryProvider>
          </div>
        </ErrorBoundary>
      </div>
    </GlobalStoreProvider>
  );
};

export default App;
