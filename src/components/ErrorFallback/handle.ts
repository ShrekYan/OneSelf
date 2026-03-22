export const handleRetry = (resetErrorBoundary: () => void): void => {
  resetErrorBoundary();
};

export const handleRefresh = (): void => {
  window.location.reload();
};
