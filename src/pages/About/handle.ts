/**
 * About 页面事件处理工具函数
 */

import { Dialog } from 'antd-mobile';

import type { Link } from './constant';

/**
 * 处理链接点击
 * @param link - 点击的链接项
 * @description 根据链接 id 处理不同的跳转逻辑
 */
export const handleLinkClick = (link: Link): void => {
  console.log('Link clicked:', link.id, link.title);

  // 根据不同的链接 id 处理不同的跳转逻辑
  // 实际项目中这里会根据业务需求实现具体的跳转逻辑
  switch (link.id) {
    case 'website':
      // window.open('https://example.com', '_blank');
      break;
    case 'github':
      // window.open('https://github.com', '_blank');
      break;
    case 'email':
      window.location.href = 'mailto:support@example.com';
      break;
    case 'feedback':
      // 跳转到反馈页面
      // navigate('/feedback');
      break;
    default:
      break;
  }
};

/**
 * 确认打开外部链接对话框
 * @param url - 外部链接地址
 * @param title - 链接标题
 * @returns 是否确认打开
 */
export const confirmOpenExternalLink = async (
  url: string,
  title: string,
): Promise<boolean> => {
  // url 参数留给调用方使用，这里只是确认对话框
  console.log('Confirm open external link:', url);
  return await Dialog.confirm({
    title: '打开外部链接',
    content: `确定要在浏览器中打开「${title}」吗？`,
    confirmText: '打开',
    cancelText: '取消',
  });
};
