import { useNavigate } from 'react-router-dom';
import type { MenuItem } from '../constant';

/**
 * 处理菜单项点击
 */
export const useHandleMenuItemClick = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (item: MenuItem) => {
    // TODO: 根据菜单项 ID 跳转到对应页面
    // 目前保留 navigate 变量用于未来跳转
    void navigate;
    switch (item.id) {
      case 'articles':
        // 跳转我的文章
        console.log('Navigate to My Articles');
        break;
      case 'saved':
        // 跳转收藏阅读
        console.log('Navigate to Saved Reading');
        break;
      case 'stats':
        // 跳转阅读统计
        console.log('Navigate to Reading Stats');
        break;
      case 'preferences':
        // 跳转偏好设置
        console.log('Navigate to Preferences');
        break;
      default:
        break;
    }
  };

  return handleMenuItemClick;
};
