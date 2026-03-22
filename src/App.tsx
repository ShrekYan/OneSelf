import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import routes from './routes'
import ErrorFallback from './components/ErrorFallback'
import Loading from './components/Loading'
import './styles/global.scss'

const App: React.FC = () => {
  const [isLoading] = useState(false)

  return (
    <div className="app-container">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {isLoading && <Loading tip="加载中..." />}
        <div className="app-content">
          <Routes>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App
