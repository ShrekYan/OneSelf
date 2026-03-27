/**
 * FAQ 数据常量
 */
export interface FAQItem {
  key: string;
  question: string;
  answer: string;
}

export const FAQ_LIST: FAQItem[] = [
  {
    key: 'register',
    question: '如何注册账号？',
    answer:
      '注册账号非常简单：\n\n1. 打开 APP 点击 "注册" 按钮\n2. 输入您的手机号码，点击获取验证码\n3. 输入短信验证码，设置登录密码\n4. 完成注册并登录即可使用全部功能\n\n如果收不到验证码，请检查手机是否停机，或者检查短信垃圾箱。',
  },
  {
    key: 'profile',
    question: '如何修改个人信息？',
    answer:
      '修改个人信息步骤：\n\n1. 登录后进入 "我的" 页面\n2. 点击头像或用户名进入个人资料页\n3. 点击 "编辑资料" 按钮\n4. 可以修改昵称、头像、个人简介等信息\n5. 修改完成后点击保存即可生效',
  },
  {
    key: 'password',
    question: '忘记密码怎么办？',
    answer:
      '如果您忘记了密码，可以通过以下步骤重置：\n\n1. 在登录页面点击 "忘记密码"\n2. 输入注册时的手机号\n3. 获取并输入短信验证码\n4. 设置新的登录密码\n5. 使用新密码重新登录即可',
  },
  {
    key: 'contact',
    question: '如何联系客服？',
    answer:
      '您可以通过以下方式联系我们的客服：\n\n1. 在线客服：在 APP 内点击 "我的" → "帮助与反馈" → "在线客服"\n2. 客服邮箱：support@example.com\n3. 工作时间：周一至周日 9:00-18:00\n\n我们会在工作日 24 小时内回复您的问题。',
  },
  {
    key: 'about',
    question: '关于我们',
    answer:
      '我们是一个致力于提供优质内容发现服务的团队，希望通过技术手段帮助用户发现更多感兴趣的内容。\n\n我们不断优化产品体验，欢迎您提供宝贵建议。如果您喜欢我们的产品，请分享给身边的朋友。',
  },
];

export const CONTACT_INFO = {
  email: 'support@example.com',
  phone: '400-xxx-xxxx',
  workingHours: '周一至周日 9:00-18:00',
};

/**
 * 应用版本信息
 */
export const APP_VERSION = {
  version: '1.0.0',
  buildDate: '2024-01-01',
  updateDate: '2024-01-01',
};
