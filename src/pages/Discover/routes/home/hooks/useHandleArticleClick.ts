/**
 * 处理文章点击事件
 * @description 跳转到文章详情页
 */

import { useNavigate } from 'react-router-dom';

export const useHandleArticleClick = () => {
  const navigate = useNavigate();

  const handleArticleClick = (articleId: string): void => {
    console.log('Navigate to article detail:', articleId);
    navigate(`/article/${articleId}`);
  };

  return handleArticleClick;
};
