import React from 'react';
import { Button } from 'antd-mobile';
import classNames from 'classnames';
import styles from './index.module.scss';

const DEFAULT_ERROR_TITLE = 'Something Went Wrong';
const DEFAULT_ERROR_DESCRIPTION =
  'An unexpected error occurred. Please try again or refresh the page.';
const RETRY_BUTTON_TEXT = 'Try Again';
const REFRESH_BUTTON_TEXT = 'Refresh Page';

const handleRetry = (resetErrorBoundary: () => void): void => {
  resetErrorBoundary();
};

const handleRefresh = (): void => {
  window.location.reload();
};

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  className?: string;
  title?: string;
  description?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className,
  title = DEFAULT_ERROR_TITLE,
  description = DEFAULT_ERROR_DESCRIPTION,
}) => {
  return (
    <div className={classNames(styles.errorFallbackContainer, className)}>
      <div className={styles.errorCard}>
        <div className={styles.errorIcon}>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="60"
              cy="60"
              r="57"
              stroke="#ff4d4f"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M38 38L82 82M82 38L38 82"
              stroke="#ff4d4f"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className={styles.errorTitle}>{title}</h1>
        <p className={styles.errorDescription}>{description}</p>
        {error.message && (
          <div className={styles.errorDetails}>{error.message}</div>
        )}
        <div className={styles.buttonGroup}>
          <Button
            block
            color="primary"
            size="large"
            className={styles.retryButton}
            onClick={() => handleRetry(resetErrorBoundary)}
          >
            {RETRY_BUTTON_TEXT}
          </Button>
          <Button
            block
            size="large"
            className={styles.refreshButton}
            onClick={handleRefresh}
          >
            {REFRESH_BUTTON_TEXT}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
