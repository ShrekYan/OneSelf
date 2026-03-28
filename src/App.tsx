import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalStoreProvider } from '@/store';
import { AliveScope } from 'react-activation';
import { AppRouter } from '@/router';
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
            <AliveScope>
              <AppRouter />
            </AliveScope>
          </div>
        </ErrorBoundary>
      </div>
    </GlobalStoreProvider>
  );
};

export default App;
