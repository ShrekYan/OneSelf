import { render, screen } from '@testing-library/react';
import ErrorFallback from './index';
import userEvent from '@testing-library/user-event';

const mockResetError = vi.fn();

// Mock 依赖的 handle 函数
vi.mock('./handle', () => ({
  handleRetry: (reset: () => void) => reset(),
  handleRefresh: vi.fn(),
}));

describe('ErrorFallback Component', () => {
  it('should render error message correctly', () => {
    render(
      <ErrorFallback
        error={{ name: 'Error', message: 'Test error occurred' }}
        resetErrorBoundary={mockResetError}
      />,
    );

    expect(screen.getByText(/页面出错了/i)).toBeInTheDocument();
    expect(screen.getByText('Test error occurred')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /重试/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /刷新/i })).toBeInTheDocument();
  });

  it('should call resetErrorBoundary when retry button clicked', async () => {
    const user = userEvent.setup();

    render(
      <ErrorFallback
        error={{ name: 'Error', message: 'Test error occurred' }}
        resetErrorBoundary={mockResetError}
      />,
    );

    const retryButton = screen.getByRole('button', { name: /重试/i });
    await user.click(retryButton);

    expect(mockResetError).toHaveBeenCalledTimes(1);
  });
});
