/**
 * Detail1 页面事件处理工具函数
 */

import { Dialog } from 'antd-mobile';

/**
 * 格式化阅读数量
 * @param count - 阅读数量
 * @returns 格式化后的阅读数量字符串
 */
export const formatReadCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
};

/**
 * 确认关注对话框
 * @returns 是否确认关注
 */
export const confirmFollow = async (): Promise<boolean> => {
  return await Dialog.confirm({
    title: '关注作者',
    content: '确定要关注这位作者吗？',
    confirmText: '关注',
    cancelText: '取消',
  });
};

/**
 * 处理更多选项点击
 * @description 更多选项点击处理逻辑
 */
export const handleMoreOptions = (): void => {
  // 纯函数：仅日志记录，实际菜单由组件处理
  console.log('More options clicked');
};

/**
 * 确认分享对话框
 * @param title - 分享标题
 * @returns 是否确认分享
 */
export const confirmShare = async (title: string): Promise<boolean> => {
  return await Dialog.confirm({
    title: '分享',
    content: `确定要分享「${title}」吗？`,
    confirmText: '分享',
    cancelText: '取消',
  });
};
