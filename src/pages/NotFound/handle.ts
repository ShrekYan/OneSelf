/**
 * NotFound 页面导航处理函数
 */

/**
 * 返回上一页，如果没有历史记录则跳转到首页
 */
export const navigateBack = (): void => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/home';
  }
};

/**
 * 跳转到首页
 */
export const navigateToHome = (): void => {
  window.location.href = '/home';
};
