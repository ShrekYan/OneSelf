/**
 * Handle go back navigation
 */
import { useNavigate } from 'react-router-dom';
import { useAppGoBack } from '@/hooks/useAppGoBack';

export const useHandleGoBack = () => {
  const navigate = useNavigate();
  // 只需要这一行！
  // onLastPage 是可选的，当已经是最后一页时会调用
  const handleGoBackMethod = useAppGoBack({
    onLastPage: () => {
      navigate('/');
    },
  });

  const handleGoBack = () => {
    handleGoBackMethod();
  };

  return handleGoBack;
};
