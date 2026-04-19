/**
 * 帮助页面事件处理工具函数
 */

import { Toast } from 'antd-mobile';

/**
 * 处理邮箱点击 - 打开邮件客户端
 * @param email - 邮箱地址
 */
export const handleEmailClick = (email: string): void => {
  console.log(`发送邮件到: ${email}`);
  window.location.href = `mailto:${email}`;
};

/**
 * 处理电话点击 - 拨打电话
 * @param phone - 电话号码
 */
export const handlePhoneClick = (phone: string): void => {
  console.log(`拨打电话: ${phone}`);
  const cleanPhone = phone.replace(/\D/g, '');
  window.location.href = `tel:${cleanPhone}`;
};

/**
 * 复制内容到剪贴板
 * @param text - 要复制的文本
 * @param successMsg - 成功提示信息
 */
export const copyToClipboard = async (
  text: string,
  successMsg: string = '复制成功',
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    Toast.show({
      icon: 'success',
      content: successMsg,
    });
  } catch {
    // 降级方案：使用 document.execCommand
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    Toast.show({
      icon: 'success',
      content: successMsg,
    });
  }
};

/**
 * 获取当前应用版本信息
 * @returns 版本号字符串
 */
export const getAppVersion = (): string => {
  // 从环境变量获取版本信息，如果没有则使用默认值
  return import.meta.env.VITE_APP_VERSION || '1.0.0';
};

/**
 * 检查更新
 * @description 这里只是示例，实际项目需要对接后端更新检查接口
 */
export const checkForUpdate = (): void => {
  console.log('检查应用更新');
  Toast.show({
    icon: 'loading',
    content: '正在检查更新...',
    duration: 1000,
  });

  // 模拟检查
  setTimeout(() => {
    Toast.show({
      icon: 'success',
      content: '当前已是最新版本',
    });
  }, 1000);
};
