/**
 * 处理分类卡片点击 Hook
 * @description 依赖 useNavigate Hook，所以放在 hooks 目录
 */

import { useNavigate } from 'react-router-dom';

/**
 * 处理分类卡片点击事件
 * @description 在组件顶层调用 Hook 获取 navigate，返回实际处理函数
 * 跳转到分类文章列表页面
 */
export function useHandleCategoryClick() {
  const navigate = useNavigate();

  return (categoryId: string): void => {
    console.log('Navigate to category articles:', categoryId);
    navigate(`/articles/${categoryId}`);
  };
}

export default useHandleCategoryClick;
