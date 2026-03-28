/**
 * NotFound 页面导航 Hooks
 * 依赖 React Router Hook，所以放在 hooks 目录
 */
import { useNavigate } from 'react-router-dom';

/**
 * 返回上一页，如果没有历史记录则跳转到首页
 */
export const useNavigateBack = () => {
  const navigate = useNavigate();

  const handleNavigateBack = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/discover/home');
    }
  };

  return handleNavigateBack;
};

/**
 * 跳转到首页
 */
export const useNavigateToHome = () => {
  const navigate = useNavigate();

  const handleNavigateToHome = (): void => {
    navigate('/discover/home');
  };

  return handleNavigateToHome;
};
