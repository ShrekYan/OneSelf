/**
 * Handle go back navigation
 */
import { useNavigate } from 'react-router-dom';

export const useHandleGoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return handleGoBack;
};
