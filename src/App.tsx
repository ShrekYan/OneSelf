import React, { useState, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalStoreProvider } from '@/store';
import routes from './routes';
import ErrorFallback from './components/ErrorFallback';
import Loading from './components/Loading';
import './styles/global.scss';

const App: React.FC = () => {
  const [isLoading] = useState(false);
  const element = useRoutes(routes);

  return (
    <GlobalStoreProvider>
      <div className="app-container">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {isLoading && <Loading tip="加载中..." />}
          <div className="app-content">
            <Suspense fallback={<Loading tip="页面加载中..." />}>
              {element}
            </Suspense>
          </div>
        </ErrorBoundary>
      </div>
    </GlobalStoreProvider>
  );
};

export default App;
