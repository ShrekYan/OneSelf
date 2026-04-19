/**
 * NotFound 页面纯导航处理函数
 * @description 无 React Hook 依赖的纯导航逻辑
 */

/**
 * 返回上一页，如果没有历史记录则跳转到首页
 * @note 不依赖 React Router Hook，直接操作 window
 */
export const handleNavigateBack = (): void => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/discover/home';
  }
};

/**
 * 跳转到首页
 * @note 不依赖 React Router Hook，直接操作 window
 */
export const handleNavigateToHome = (): void => {
  window.location.href = '/discover/home';
};
